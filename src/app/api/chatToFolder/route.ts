import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { method } = req;
    if (method === 'POST') {
      const { chatUUID, folderUUID } = await req.json();

      console.log(chatUUID, folderUUID);

      const token = req.headers.get('authorization') as string;

      const endpoint = `http://localhost:9000/api/v1/chat/ChatToFolder`;
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ chatUUID, folderUUID }),
      };

      const res = await fetch(endpoint, options);

      console.log(res);

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
