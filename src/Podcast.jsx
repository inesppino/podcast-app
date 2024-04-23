import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPodcastById } from "./services/PodcastService";
import { hasOneDAyPassed, normalizePodcastDetail } from "./utils";

const Podcast = () => {
  const { podcastId } = useParams();
  const [podcastInfo, setPodcastInfo] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const localStorageData = localStorage.getItem(podcastId);
    const localStorageDate = localStorage.getItem(`date_${podcastId}`);
    if (!localStorageDate || hasOneDAyPassed(localStorageDate)) {
      getPodcastById(podcastId)
        .then((data) => {
          const normalizedData = normalizePodcastDetail(data.podcastInfo);
          localStorage.setItem(
            normalizedData.id,
            JSON.stringify(normalizedData)
          );
          localStorage.setItem(
            `date_${normalizedData.id}`,
            new Date().toISOString()
          );
          setPodcastInfo(normalizedData);
        })
        .catch((err) => {
          console.error(err);
          setError(true);
        });
    } else {
      const data = JSON.parse(localStorageData);
      setPodcastInfo(data);
    }
  }, [podcastId]);

  if (error) return <h1>Something went wrong</h1>;

  return (
    <div className="detail__container">
      <div className="detail__summary">
        <div className="detail__summary--image">
          <img src={podcastInfo.image} alt={`${podcastInfo.name} logo`} />
        </div>
        <div className="detail__summary--info">
          <p className="detail__summary--info-title">{podcastInfo.name}</p>
          <p className="detail__summary--info-author">
            by: <span> {podcastInfo.author}</span>
          </p>
        </div>
        <div className="detail__summary--description">
          <p className="detail__summary--description-title">Description:</p>
          <p className="detail__summary--description-text">
            {podcastInfo.description}
          </p>
        </div>
      </div>

      <div className="detail__episodes">
        <p className="detail__episodes--number">
          Episodes: {podcastInfo.episodes?.length}
        </p>

        <div className="detail__episodes--list">
          <h3>Title</h3>
          <h3>Date</h3>
          <h3>Duration</h3>
          {podcastInfo.episodes?.map((episode, index) => (
            <li key={index}>
              <Link to={`./episode/${episode.id}`}>
                <span className="detail__episodes--title">{episode.title}</span>
              </Link>
              <p>{new Date(episode.date).toLocaleDateString("es")}</p>
              <p>{episode.duration}</p>
            </li>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Podcast;
