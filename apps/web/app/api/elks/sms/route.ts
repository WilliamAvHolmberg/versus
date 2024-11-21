import { ElksService } from '../../../../src/services/elks'
//import { env } from '../../../../env'

export async function POST(request: Request) {
    try {
        // Verify request is from 46elks
        // const authHeader = request.headers.get('authorization')
        // const expectedAuth = `Basic ${Buffer.from(`${env.ELKS_API_USERNAME}:${env.ELKS_API_PASSWORD}`).toString('base64')}`

        // if (authHeader !== expectedAuth) {
        //     return new Response('Unauthorized', { status: 401 })
        // }

        const formData = await request.formData()

        const sms = {
            id: formData.get('id') as string,
            from: formData.get('from') as string,
            to: formData.get('to') as string,
            message: formData.get('message') as string,
            created: formData.get('created') as string,
        }

        console.debug('SMS webhook received', sms)

        await ElksService.handleIncomingSMS(sms)

        return new Response(undefined, { status: 204 })

    } catch (error) {
        console.error('SMS webhook error:', error)
        return new Response(
            JSON.stringify({
                error: error instanceof Error ? error.message : 'Internal server error'
            }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
    }
} 