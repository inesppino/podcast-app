import { normalizeEpisodes } from "../utils";

const BASE_URL = "https://itunes.apple.com";
const ORIGINS_URL = "https://api.allorigins.win/get?charset=ISO-8859-1&url=";

const fetchData = async () => {
  const url = `${BASE_URL}/us/rss/toppodcasts/limit=100/genre=1310/json`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

export default fetchData;

export const getPodcastById = async (podcastId) => {
  const url = `${BASE_URL}/lookup?id=${podcastId}`;
  const allowOriginsUrl = `${ORIGINS_URL}${url}`;
  try {
    const response = await fetch(allowOriginsUrl);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    const parsedContent = JSON.parse(data.contents);
    const episodes = await getPodcastFeed(parsedContent.results[0].feedUrl);
    const enrichedData = {
      podcastInfo: parsedContent.results[0],
      lastUpdated: new Date(),
    };
    enrichedData.podcastInfo.episodes = episodes;
    return enrichedData;
  } catch (error) {
    console.error(error);
  }
};

const getPodcastFeed = async (feed) => {
  const allowOriginsUrl = `${ORIGINS_URL}${feed}`;
  try {
    const response = await fetch(allowOriginsUrl);
    if (response.ok) {
      //sometimes data will arrive in xml, sometimes in base64
      const responseText = await response.json();
      const contentText = responseText.contents;
      let xmlString;

      if (contentText.startsWith("data:")) {
        const base64String = contentText.split("base64,")[1];
        if (!base64String) {
          throw new Error("No Base64 content found in the data URL");
        }
        xmlString = atob(base64String);
      } else {
        xmlString = contentText;
      }

      const parser = new DOMParser();
      const parsedData = parser.parseFromString(xmlString, "text/xml");
      const parserErrors = parsedData.getElementsByTagName("parsererror");
      if (parserErrors.length > 0) {
        throw new Error(`Error parsing XML: ${parserErrors[0].textContent}`);
      }

      const formattedEpisodes = normalizeEpisodes(parsedData);
      return formattedEpisodes;
    } else {
      throw new Error("Network response was not ok");
    }
  } catch (error) {
    console.error("Error fetching and parsing podcast feed:", error);
    throw error;
  }
};
