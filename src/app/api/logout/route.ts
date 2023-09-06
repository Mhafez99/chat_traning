export async function DELETE(req: Request) {
  try {
    const { method } = req;
    if (method === 'DELETE') {
      const body = await req.json();
      const refreshToken = body.refreshToken;
      const endpoint = `http://localhost:9000/api/v1/auth/logout`;
      const options = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      };
      const res = await fetch(endpoint, options);
      const user = await res.json();
      console.log(user);
      if (user.statusCode === 200) {
        return new Response('Logged out successfully', { status: res.status });
      } else {
        throw new Error('Invalid');
      }
    }
  } catch (error) {
    console.log(error);
    return new Response('An error occurred', { status: 500 });
  }
}
