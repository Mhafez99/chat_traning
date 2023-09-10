import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { method } = req;
    if (method === 'POST') {
      const { user } = await req.json();

      const endpoint = `${process.env.BACKEND_API_ROUTE}/api/v1/auth/register`;
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...user }),
      };

      const res = await fetch(endpoint, options);
      const data = await res.json();
      console.log(data);

      if (res.status !== 200) {
        return NextResponse.json(data, { status: data.statusCode });
      }

      return NextResponse.json({
        message: `You has been registered successfully with the email: ${user.email}.`,
      });
    }
  } catch (error) {
    console.log(error);
  }
}
