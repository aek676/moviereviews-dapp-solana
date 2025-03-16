export async function getMoviePoster(title: string) {
  const apikey = "18aeb44b";
  const url = `http://www.omdbapi.com/?apikey=${apikey}&t=${encodeURIComponent(
    title
  )}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await response.json();

  if (data.Response === "False") {
    throw new Error(data.Error);
  }

  if (data.Poster === "N/A") {
    throw new Error("No poster available");
  }

  return data.Poster;
}
