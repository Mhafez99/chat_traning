import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { method } = req;
    if (method === 'POST') {
      const chatTitle = await req.json();

      const token = req.headers.get('authorization') as string;

      const endpoint = `http://localhost:9000/api/v1/chat/NewChat`;
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
      console.log(data);

      if (res.status !== 200) {
        return NextResponse.json(data, { status: data.statusCode });
      }

      return NextResponse.json(data);
    }
  } catch (error) {
    console.log(error);
  }
}
