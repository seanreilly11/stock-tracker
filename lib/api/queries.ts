export const standardFetch = async (
  endpoint: string,
  params?: Record<string, string>,
) => {
  const urlParams = new URLSearchParams(params);
  const url = new URL(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}${urlParams.toString() ? `?${urlParams.toString()}` : ""}`,
  );

  const response = await fetch(url);
  return await parseResponse(response);
};

export const polygonFetch = async (
  path: string,
  params: Record<string, string> = {},
) => {
  const urlParams = new URLSearchParams({
    ...params,
    apiKey: process.env.POLYGON_API_KEY || "",
  });
  const url = `https://api.polygon.io${path}?${urlParams.toString()}`;
  const response = await fetch(url);
  return await parseResponse(response);
};

const parseResponse = async (res: Response) => {
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return await res.json();
};
