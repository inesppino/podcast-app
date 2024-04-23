export const normalizeData = (data) => {
  return data.map((podcast) => {
    return {
      id: podcast.id.attributes["im:id"],
      name: podcast["im:name"].label,
      image: podcast["im:image"][2].label,
      artist: podcast["im:artist"].label,
      title: podcast.title.label,
    };
  });
};

export const hasOneDAyPassed = (date) => {
  const oneDay = 1000 * 60 * 60 * 24;
  const lastUpdated = new Date(date);
  return new Date() - lastUpdated > oneDay;
};

const formatDuration = (duration) => {
  if (duration.includes(":")) {
    const [minutes, seconds] = duration.split(":");
    return `${minutes}:${seconds}`;
  } else {
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds}`;
  }
};

const formatString = (string) => {
  if (string === undefined) return "";
  return string.replace("<![CDATA[", "").replace("]]>", "");
};

export const normalizePodcastDetail = (data) => {
  return {
    author: data.artistName,
    id: data.collectionId,
    name: data.collectionName,
    description: data.episodes.description,
    image: data.artworkUrl600,
    episodes: data.episodes.list,
    trackCount: data.trackCount,
  };
};

export const normalizeEpisodes = (episodes) => {
  const formattedEpisodes = {
    description: "",
    list: [],
  };
  const items = episodes.querySelectorAll("item");
  const description =
    episodes.getElementsByTagName("itunes:summary").length > 0
      ? episodes.getElementsByTagName("itunes:summary")
      : episodes.getElementsByTagName("description");
  formattedEpisodes.description = formatString(description[0].innerHTML);

  items.forEach((element) => {
    const rawTitle =
      element.getElementsByTagName("itunes:title")[0]?.innerHTML ||
      element.getElementsByTagName("title")[0].innerHTML;
    const id =
      element.getElementsByTagName("omny:clipId")[0]?.innerHTML ||
      element.getElementsByTagName("guid")[0].innerHTML;
    const episode = {
      id: formatString(id),
      title: formatString(rawTitle),
      date: element.getElementsByTagName("pubDate")[0].innerHTML,
      duration: formatDuration(
        element.getElementsByTagName("itunes:duration")[0].innerHTML
      ),
      description: formatString(
        element.getElementsByTagName("description")[0].innerHTML
      ),
      audio: element.getElementsByTagName("enclosure")[0].getAttribute("url"),
    };

    formattedEpisodes.list.push(episode);
  });
  return formattedEpisodes;
};
