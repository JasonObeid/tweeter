export async function get<T>(request: RequestInfo): Promise<T | null> {
  const response = await fetch(request);

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
  requestConfig?: RequestInit,
): Promise<T | null> {
  const response = await fetch(request, { ...requestConfig, method: "POST" });

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
