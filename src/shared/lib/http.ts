/**
 * Decodes a JSON response using the response contract declared at the call site.
 * Keep the generic aligned with the corresponding server route response type.
 */
export async function readJson<T>(response: Response): Promise<T> {
  const payload: unknown = await response.json();
  return payload as T;
}
