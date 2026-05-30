export default async function handler(request, response) {
  const { search = "", page = "1" } = request.query;

  const cleanSearch = search.trim();

  if (!cleanSearch) {
    return response.status(400).json({ data: [] });
  }

  try {
    const normalizedTerms = cleanSearch
      .toLowerCase()
      .replace(/[’']/g, "")
      .replace(/[^a-z0-9\s-]/g, " ")
      .split(/\s+/)
      .filter(Boolean);

    const queryText = normalizedTerms
      .map((term) => `name:${term}*`)
      .join(" ");

    const query = encodeURIComponent(queryText);

    const apiResponse = await fetch(
      `https://api.pokemontcg.io/v2/cards?q=${query}&pageSize=24&page=${page}`,
      {
        headers: {
          "X-Api-Key": process.env.VITE_POKEMON_TCG_API_KEY || "",
        },
      }
    );

    const text = await apiResponse.text();

    if (!apiResponse.ok) {
      return response.status(apiResponse.status).json({
        data: [],
        error: text,
      });
    }

    const data = JSON.parse(text);

    return response.status(200).json(data);
  } catch (error) {
    return response.status(500).json({
      data: [],
      error: error.message,
    });
  }
}