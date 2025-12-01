

export async function POST(request) {
  try {
    const body = await request.json(); // Parse incoming JSON body
    const { username, pin, token, password } = body;


    return new Response(JSON.stringify({username, pin, token, password }))
    

  } catch (error) {
    console.log({error});
    return new Response(JSON.stringify({ error: 'Invalid JSON or server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

