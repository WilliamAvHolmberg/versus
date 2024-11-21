import { NextResponse } from 'next/server';
import { getSession } from '@/actions/auth';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    console.log(session.user.id);

    const { url, title } = await request.json();

    if (!url) {
      return new NextResponse('URL is required', { status: 400 });
    }

    const contentType = await prisma.contentType.findFirst({
      where: {
        name: 'other'
      }
    })

    if (!contentType) {
      throw new Error('Default content type "other" not found in database')
    }

    const bookmark = await prisma.bookmark.create({
      data: {
        url,
        title: title || url,
        userId: session.user.id,
        contentTypeId: contentType.id,
        status: 'unread',
        source: 'extension',
      },
      include: {
        contentType: true,
        user: true,
      },
    })

    return NextResponse.json({ bookmark });
  } catch (error) {
    console.error('Error creating bookmark:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 