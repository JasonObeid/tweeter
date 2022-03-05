export async function get<T>(
  request: RequestInfo,
  headers?: Record<string, string | undefined>,
): Promise<T | null> {
  const response = await fetch(request, {
    headers: new Headers({ ...headers, "Content-Type": "application/json" }),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  try {
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`failed to read response body from ${request.toString()}`);
    return null;
  }
}

export async function post<T>(
  request: RequestInfo,
  headers?: Record<string, string | undefined>,
): Promise<T | null> {
  const response = await fetch(request, {
    method: "POST",
    headers: new Headers({ ...headers, "Content-Type": "application/json" }),
  });

  if (!response.ok) {
    console.error(await response.text());
    return null;
  }

  try {
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`failed to read response body from ${request.toString()}`);
    return null;
  }
}
