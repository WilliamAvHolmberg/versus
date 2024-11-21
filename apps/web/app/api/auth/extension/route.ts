import { initiateExtensionAuth, verifyExtensionCode } from '@/lib/auth';

// Initiate login
export async function POST(req: Request) {
  try {
    const { phone } = await req.json();

    // Use existing initiateExtensionAuth function
    await initiateExtensionAuth(phone);

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Failed to initiate login' }, { status: 400 });
  }
}

// Verify code
export async function PUT(req: Request) {
  try {
    const { phone, code } = await req.json();

    // Use existing verifyExtensionCode function
    const user = await verifyExtensionCode(phone, code);
    if (!user) {
      return Response.json({ error: 'Invalid code' }, { status: 400 });
    }

    // No need to manually set cookie as verifyExtensionCode already handles it
    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Failed to verify code' }, { status: 400 });
  }
} 