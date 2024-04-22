import { useEffect, useState } from "react";
// import "./App.scss";

const Home = () => {
  const [podcasts, setPodcasts] = useState([]);

  const normalizeData = (data) => {
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

  const fetchData = async () => {
    const url =
      "https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json";
    const response = await fetch(url);
    const data = await response.json();
    return data;
  };

  const hasOneDAyPassed = () => {
    const oneDay = 1000 * 60 * 60 * 24;
    const lastUpdated = new Date(localStorage.getItem("podcasts_lastUpdated"));
    return new Date() - lastUpdated > oneDay;
  };

  useEffect(() => {
    if (localStorage.getItem("podcasts_lastUpdated") && hasOneDAyPassed()) {
      fetchData().then((data) => {
        const normalizedPodcasts = normalizeData(data.feed.entry);
        localStorage.setItem("podcasts_lastUpdated", new Date().toISOString());
        localStorage.setItem("podcasts", JSON.stringify(normalizedPodcasts));
        setPodcasts(normalizedPodcasts);
      });
    } else {
      const data = JSON.parse(localStorage.getItem("podcasts"));
      setPodcasts(data);
    }
  }, []);

  return (
    <>
      <header className="header__container">
        <a href="/">
          <h1>Podcaster</h1>
        </a>
      </header>

      <ul className="podcasts__container">
        {podcasts.map((podcast) => (
          <li key={podcast.id}>
            <div className="podcast__card">
              <img
                className="podcast__card--image"
                src={podcast.image}
                alt={`${podcast.title} logo`}
              />
              <h4 className="podcast__card--title">{podcast.name}</h4>
              <p className="podcast__card--author">Author: {podcast.artist} </p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Home;
