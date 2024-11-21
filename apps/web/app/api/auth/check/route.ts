import { NextResponse } from 'next/server'
import { getSession } from '@/actions/auth'

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
  })
}

export async function GET() {
  try {
    const session = await getSession()
    
    if (!session) {
      return new NextResponse(null, { 
        status: 401,
        headers: corsHeaders
      })
    }

    return new NextResponse(JSON.stringify({ authenticated: true }), {
      status: 200,
      headers: corsHeaders
    })
  } catch (error) {
    console.error(error);
    return new NextResponse(null, { 
      status: 500,
      headers: corsHeaders
    })
  }
}

const corsHeaders = {
  'Access-Control-Allow-Origin': 'chrome-extension://*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
} 