export interface CharacterItem { id: string; name?: string; title?: string; [k: string]: any }

export const getCharacters = async (): Promise<CharacterItem[]> => {
  const token = sessionStorage.getItem("tokenUser");
  const base = process.env.REACT_APP_BACKEND_URL || "";
  const response = await fetch(base ? `${base}/characters` : `/characters`, {
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to fetch characters: ${response.status} ${response.statusText} ${text}`);
  }
  const data = await response.json();
  if (Array.isArray(data)) return data as CharacterItem[];
  const maybeData = (data as any)?.data ?? data;
  return (maybeData?.items ?? maybeData?.results ?? maybeData ?? []) as CharacterItem[];
};
