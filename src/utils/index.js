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
  formattedEpisodes.description = description[0].innerHTML;

  items.forEach((element) => {
    const id =
      element.getElementsByTagName("omny:clipId")[0]?.innerHTML ||
      element.getElementsByTagName("guid")[0].innerHTML;
    const episode = {
      id: id.replace("<![CDATA[", "").replace("]]>", ""),
      title:
        element.getElementsByTagName("itunes:title")[0]?.innerHTML ||
        element.getElementsByTagName("title")[0].innerHTML,
      date: element.getElementsByTagName("pubDate")[0].innerHTML,
      duration: element.getElementsByTagName("itunes:duration")[0].innerHTML,
      description: element.getElementsByTagName("description")[0].innerHTML,
      audio: element.getElementsByTagName("enclosure")[0].getAttribute("url"),
    };

    formattedEpisodes.list.push(episode);
  });
  return formattedEpisodes;
};
