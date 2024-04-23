import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { startLoading, stopLoading } from "../../store/global/globalActions";
import fetchData from "../../services/PodcastService";
import { hasOneDAyPassed, normalizeData } from "../../utils";
import InputSearch from "../../components/input-search";
import Card from "../../components/card";

const Home = () => {
  const dispatch = useDispatch();
  const [podcasts, setPodcasts] = useState([]);
  const [filteredPodcasts, setFilteredPodcasts] = useState([]);

  useEffect(() => {
    if (
      !localStorage.getItem("podcasts_lastUpdated") ||
      hasOneDAyPassed(localStorage.getItem("podcasts_lastUpdated"))
    ) {
      dispatch(startLoading());
      fetchData().then((data) => {
        const normalizedPodcasts = normalizeData(data.feed.entry);
        localStorage.setItem("podcasts_lastUpdated", new Date().toISOString());
        localStorage.setItem("podcasts", JSON.stringify(normalizedPodcasts));
        setPodcasts(normalizedPodcasts);
        setFilteredPodcasts(normalizedPodcasts);
        dispatch(stopLoading());
      });
    } else {
      const data = JSON.parse(localStorage.getItem("podcasts"));
      setPodcasts(data);
      setFilteredPodcasts(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
              <Card
                image={podcast.image}
                title={podcast.title}
                name={podcast.name}
                author={podcast.artist}
              />
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Home;
