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
