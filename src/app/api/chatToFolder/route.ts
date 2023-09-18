import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { method } = req;
    if (method === 'POST') {
      const { chatUUID, folderUUID } = await req.json();

      const token = req.headers.get('authorization') as string;

      const endpoint = `${process.env.BACKEND_API_ROUTE}/api/v1/chat/ChatToFolder`;
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ chatUUID, folderUUID }),
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
