export interface BattleQueryParams {
  page?: number;
  limit?: number;
}

export const getCollection = async (params: BattleQueryParams = {}): Promise<any> => {
  const token = sessionStorage.getItem("tokenUser");
  const { page, limit } = params;
  try {
    const base = process.env.REACT_APP_BACKEND_URL || "";
    const url = new URL((base ? base : "") + "/battles", window.location.origin);
    if (page) url.searchParams.set("page", String(page));
    if (limit) url.searchParams.set("limit", String(limit));

    const response = await fetch(base ? `${base}/battles${url.search}` : `/battles${url.search}`, {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to fetch battles: ${response.status} ${response.statusText} ${text}`);
    }

    return response.json();
  } catch (error) {
    console.error("Fetching battles failed:", error);
    throw error;
  }
};

// Optional factory to keep backward compatibility if referenced elsewhere
export const getApiBattle = () => ({ getCollection });

export default getApiBattle;