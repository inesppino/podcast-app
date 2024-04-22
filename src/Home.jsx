import { useEffect, useState } from "react";
import fetchData from "./services/PodcastService";
import { hasOneDAyPassed, normalizeData } from "./utils";

const Home = () => {
  const [podcasts, setPodcasts] = useState([]);

  useEffect(() => {
    if (
      localStorage.getItem("podcasts_lastUpdated") &&
      hasOneDAyPassed(localStorage.getItem("podcasts_lastUpdated"))
    ) {
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
