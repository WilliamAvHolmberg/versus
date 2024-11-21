import { env } from '../../env'
import { prisma } from '../lib/db'
import { getUrlMetadata } from '../lib/preview'

const API_BASE = 'https://api.46elks.com/a1'
const AUTH_TOKEN = Buffer.from(`${env.ELKS_API_USERNAME}:${env.ELKS_API_PASSWORD}`).toString('base64')

interface ElksResponse<T> {
    success: boolean
    data?: T
    error?: string
}

interface SendSMSResponse {
    id: string
    status: string
    created: string
    direction: string
    from: string
    to: string
    message: string
}

interface IncomingSMS {
    id: string
    from: string
    to: string
    message: string
    created: string
}

export class ElksService {
    static async request<T>(path: string, options: RequestInit = {}): Promise<ElksResponse<T>> {
        try {
            const response = await fetch(`${API_BASE}${path}`, {
                ...options,
                headers: {
                    'Authorization': `Basic ${AUTH_TOKEN}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                    ...options.headers,
                },
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            return {
                success: true,
                data: data as T
            }
        } catch (error) {
            console.error('Elks API error:', error)
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            }
        }
    }

    static async sendSMS(to: string, message: string): Promise<ElksResponse<SendSMSResponse>> {
        const params = new URLSearchParams({
            from: 'Pagepin',
            to,
            message
        })

        return this.request<SendSMSResponse>('/sms', {
            method: 'POST',
            body: params.toString()
        })
    }

    static async handleIncomingSMS(sms: IncomingSMS) {
        try {
            // Find user by phone number
            const user = await prisma.user.findFirst({
                where: {
                    phone: sms.from
                }
            })

            if (!user) {
                await this.sendSMS(sms.from, `Error: Phone number not registered with Pagepin. Please register first. ${sms.from}/register`)
                return
            }

            // Parse message format: URL #tag1 #tag2 "Optional Title"
            const url = sms.message

            // Get metadata from URL
            const metadata = await getUrlMetadata(url)

            // Extract title (text between quotes) or use metadata title
            const title = metadata.title

            // Try to find matching content type, fallback to "other"
            let contentType = metadata.type ? await prisma.contentType.findFirst({
                where: {
                    name: metadata.type
                }
            }) : null

            // If no matching content type found, use the default "other" type
            if (!contentType) {
                contentType = await prisma.contentType.findFirst({
                    where: {
                        name: 'other'
                    }
                })

                if (!contentType) {
                    throw new Error('Default content type "other" not found in database')
                }
            }

            // Create bookmark
            const bookmark = await prisma.bookmark.create({
                data: {
                    url,
                    title,
                    tags: [],
                    contentTypeId: contentType.id,
                    preview: metadata.image,
                    userId: user.id,
                    source: 'sms'
                },
                include: {
                    contentType: true,
                    user: true,
                },
            })
            // Prepare confirmation message with metadata
            // const confirmationParts = [
            //     '✅ Bookmark created!',
            //     `📝 ${title}`,
            //     metadata.description ? `📄 ${metadata.description.slice(0, 100)}...` : null,
            //     metadata.author ? `👤 ${metadata.author}` : null,
            //     allTags.length > 0 ? `🏷️ ${allTags.map(t => '#' + t).join(' ')}` : null,
            //     metadata.publishedAt ? `📅 Published: ${new Date(metadata.publishedAt).toLocaleDateString()}` : null
            // ].filter(Boolean)

            // Send rich confirmation SMS
            // await this.sendSMS(
            //     sms.from,
            //     confirmationParts.join('\n')
            // )

            return bookmark

        } catch (error) {
            console.error('Error handling incoming SMS:', error)

            // Send error message back to user
            await this.sendSMS(
                sms.from,
                `Error creating bookmark: ${error instanceof Error ? error.message : 'Unknown error'}`
            )

            throw error
        }
    }
} 