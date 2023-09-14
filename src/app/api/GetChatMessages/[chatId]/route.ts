import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: any) {
  try {
    const { chatId } = params;
    const { method } = req;
    if (method === 'GET') {
      const token = req.headers.get('authorization') as string;
      console.log(token);
      const endpoint = `${process.env.BACKEND_API_ROUTE}/api/v1/chat/${chatId}`;
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      };
      const response = await fetch(endpoint, options);

      console.log(response);

      if (response.status === 200) {
        const data = await response.json();

        console.log(data);

        return new NextResponse(data, { status: 200 });
      } else {
        throw new Error('Server Error');
      }
    }
  } catch (error) {
    console.log(error);
  }
}
