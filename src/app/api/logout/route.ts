import { NextResponse } from 'next/server';

export async function DELETE(req: Request) {
  try {
    const { method } = req;
    if (method === 'DELETE') {
      const refreshToken = await req.json();

      const endpoint = `${process.env.BACKEND_API_ROUTE}/api/v1/auth/logout`;
      const options = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(refreshToken),
      };
      const res = await fetch(endpoint, options);

      if (res.status !== 200) {
        return NextResponse.json({ status: res.status });
      }

      return NextResponse.json(res.status);
    }
  } catch (error) {
    return new Response('An error occurred', { status: 500 });
  }
}
