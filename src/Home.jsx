import { useEffect, useState } from "react";
import fetchData from "./services/PodcastService";
import { hasOneDAyPassed, normalizeData } from "./utils";
import Header from "./components/header";

const Home = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [filteredPodcasts, setFilteredPodcasts] = useState([]);

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
        setFilteredPodcasts(normalizedPodcasts);
      });
    } else {
      const data = JSON.parse(localStorage.getItem("podcasts"));
      setPodcasts(data);
      setFilteredPodcasts(data);
    }
  }, []);

  const handleInputChange = (e) => {
    const searchValue = e.target.value.toLowerCase();
    const filteredPodcasts = podcasts.filter((podcast) =>
      podcast.name.toLowerCase().includes(searchValue)
    );
    setFilteredPodcasts(filteredPodcasts);
  };

  return (
    <>
      <Header />

      <div className="input__container">
        <span className="input__container--counter">
          {filteredPodcasts.length}
        </span>
        <input
          className="input__container--input"
          type="text"
          placeholder="Filter podcasts..."
          onChange={handleInputChange}
        ></input>
      </div>

      <ul className="podcasts__container">
        {filteredPodcasts.map((podcast) => (
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
