import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getPodcastById } from "../../services/PodcastService";
import { startLoading, stopLoading } from "../../store/global/globalActions";
import { hasOneDAyPassed, normalizePodcastDetail } from "../../utils";
import Summary from "../../components/summary";

const Podcast = () => {
  const dispatch = useDispatch();
  const { podcastId } = useParams();
  const [podcastInfo, setPodcastInfo] = useState(undefined);
  const [error, setError] = useState(null);

  useEffect(() => {
    const localStorageData = localStorage.getItem(podcastId);
    const localStorageDate = localStorage.getItem(`date_${podcastId}`);
    if (!localStorageDate || hasOneDAyPassed(localStorageDate)) {
      dispatch(startLoading());
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
          dispatch(stopLoading());
        })
        .catch((err) => {
          console.error(err);
          setError(true);
        });
    } else {
      const data = JSON.parse(localStorageData);
      setPodcastInfo(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [podcastId]);

  if (error) return <h1>Something went wrong</h1>;

  if (podcastInfo === undefined) return <div></div>;

  return (
    <div className="detail__container">
      <Summary
        image={podcastInfo.image}
        name={podcastInfo.name}
        author={podcastInfo.author}
        description={podcastInfo.description}
        id={podcastId}
      />

      <div className="detail-episodes__container">
        <p className="detail-episodes__number">
          Episodes: {podcastInfo.episodes?.length}
        </p>

        <table className="detail-episodes__table">
          <thead>
            <tr>
              <th className="detail-episodes__table-header">Title</th>
              <th className="detail-episodes__table-header">Date</th>
              <th className="detail-episodes__table-header">Duration</th>
            </tr>
          </thead>
          <tbody>
            {podcastInfo.episodes?.map((episode, index) => (
              <tr key={index} className="detail-episodes__table-row">
                <td className="detail-episodes__table-cell">
                  <Link to={`./episode/${episode.id}`}>
                    <span className="detail-episodes__table-title">
                      {episode.title}
                    </span>
                  </Link>
                </td>
                <td className="detail-episodes__table-cell">
                  {new Date(episode.date).toLocaleDateString("es")}
                </td>
                <td className="detail-episodes__table-cell detail-episodes__table-cell--duration">
                  {episode.duration}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Podcast;
