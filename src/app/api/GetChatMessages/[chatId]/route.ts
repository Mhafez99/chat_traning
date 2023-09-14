import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: any) {
  try {
    const { chatId } = params;
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
