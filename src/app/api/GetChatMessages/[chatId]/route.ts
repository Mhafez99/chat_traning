import { NextResponse } from 'next/server';

type Props = {
  params: {
    chatId: string;
  };
};

export async function GET(req: Request, { params: { chatId } }: Props) {
  // const chatId = req.url.slice(req.url.lastIndexOf('/') + 1);
  try {
    const { method } = req;
    if (method === 'GET') {
      const token = req.headers.get('authorization') as string;
      const endpoint = `${process.env.BACKEND_API_ROUTE}/api/v1/chat/${chatId}`;
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
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
