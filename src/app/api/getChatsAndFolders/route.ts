import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { method } = req;
    if (method === 'GET') {
      const token = req.headers.get('authorization') as string;

      const endpoint = `${process.env.BACKEND_API_ROUTE}/api/v1/chat`;
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
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
