import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { method } = req;
    if (method === 'POST') {
      const chatTitle = await req.json();
      if (!chatTitle)
        return NextResponse.json({ message: 'Missing requried data' });

      const token = req.headers.get('authorization') as string;

      const endpoint = `${process.env.BACKEND_API_ROUTE}/api/v1/chat/NewChat`;
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(chatTitle),
      };

      const res = await fetch(endpoint, options);

      const data = await res.json();

      if (res.status !== 200) {
        return NextResponse.json(data, { status: data.statusCode });
      }

      return NextResponse.json(data);
    }
  } catch (error) {
    console.log(error);
  }
}
