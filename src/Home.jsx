import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import fetchData from "./services/PodcastService";
import { hasOneDAyPassed, normalizeData } from "./utils";
import Header from "./components/header";
import InputSearch from "./components/inputSearch";

const Home = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [filteredPodcasts, setFilteredPodcasts] = useState([]);

  useEffect(() => {
    if (
      !localStorage.getItem("podcasts_lastUpdated") ||
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
    const filteredPodcasts = podcasts.filter(
      (podcast) =>
        podcast.name.toLowerCase().includes(searchValue) ||
        podcast.artist.toLowerCase().includes(searchValue)
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
        <InputSearch onChange={handleInputChange} />
      </div>

      <ul className="podcasts__container">
        {filteredPodcasts.map((podcast) => (
          <li key={podcast.id}>
            <Link to={`podcast/${podcast.id}`}>
              <div className="podcast__card">
                <img
                  className="podcast__card--image"
                  src={podcast.image}
                  alt={`${podcast.title} logo`}
                />
                <h4 className="podcast__card--title">{podcast.name}</h4>
                <p className="podcast__card--author">
                  Author: {podcast.artist}{" "}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Home;
