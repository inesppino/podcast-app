import { normalizeEpisodes } from "../utils";

const BASE_URL = "https://itunes.apple.com";
const ORIGINS_URL = "https://api.allorigins.win/get?charset=ISO-8859-1&url=";

const fetchData = async () => {
  const url = `${BASE_URL}/us/rss/toppodcasts/limit=100/genre=1310/json`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

export default fetchData;

export const getPodcastById = async (podcastId) => {
  const url = `${BASE_URL}/lookup?id=${podcastId}`;
  const allowOriginsUrl = `${ORIGINS_URL}${url}`;

  const res = await fetch(allowOriginsUrl)
    .then((response) => response.json())
    .then(async (data) => {
      const parsedContent = JSON.parse(data.contents);
      const podcastFeed = await getPodcastFeed(
        parsedContent.results[0].feedUrl
      ).then((episodes) => {
        const enrichedData = {
          podcastInfo: parsedContent.results[0],
          lastUpdated: new Date(),
        };
        enrichedData.podcastInfo.episodes = episodes;
        return enrichedData;
      });
      return podcastFeed;
    });
  return res;
};

const getPodcastFeed = async (feed) => {
  const allowOriginsUrl = `${ORIGINS_URL}${feed}`;
  const res = await fetch(allowOriginsUrl)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Network response was not ok");
      }
    })
    .then((str) => {
      const parsedData = new window.DOMParser().parseFromString(
        str.contents,
        "text/xml"
      );
      return parsedData;
    })
    .then((data) => {
      if (!data) {
        throw new Error("Data could not be retrieved from the API");
      }
      const formattedEpisodes = normalizeEpisodes(data);
      return formattedEpisodes;
    })
    .catch((err) => {
      console.error(err);
    });
  return res;
};
