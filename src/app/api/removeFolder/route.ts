import { NextResponse } from 'next/server';

export async function DELETE(req: Request) {
  try {
    const { method } = req;
    if (method === 'DELETE') {
      const folderUUID = await req.json();

      console.log(folderUUID);

      const token = req.headers.get('authorization') as string;

      const endpoint = `${process.env.BACKEND_API_ROUTE}/api/v1/chat/RemoveFolder`;
      const options = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(folderUUID),
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
