import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0, 
    });

    return new Response(JSON.stringify({ message: 'Logged out' }), {
      status: 200,
    });
  } catch (error) {
    console.error('[LOGOUT ERROR]', error);
    return new Response(JSON.stringify({ message: 'Logout failed' }), {
      status: 500,
    });
  }
}
