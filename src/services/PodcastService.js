const fetchData = async () => {
  const url =
    "https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json";
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

export default fetchData;
