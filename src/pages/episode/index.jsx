import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { startLoading, stopLoading } from "../../store/global/globalActions";
import { getPodcastById } from "../../services/PodcastService";
import {
  getEpisodeById,
  hasOneDAyPassed,
  normalizePodcastDetail,
} from "../../utils";
import Summary from "../../components/summary";

const Episode = () => {
  const dispatch = useDispatch();
  const { podcastId, episodeId } = useParams();
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
          const selectedEpisode = getEpisodeById(
            normalizedData.episodes,
            episodeId
          );
          normalizedData.selectedEpisode = selectedEpisode;
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
      data.selectedEpisode =
        data.selectedEpisode ?? getEpisodeById(data.episodes, episodeId);
      setPodcastInfo(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [podcastId, episodeId]);

  if (error) return <h1>Something went wrong</h1>;

  if (podcastInfo === undefined) return <></>;

  return (
    <div className="detail__container">
      <Summary
        image={podcastInfo.image}
        name={podcastInfo.name}
        author={podcastInfo.author}
        description={podcastInfo.description}
        id={podcastId}
        link="/podcast/"
      />

      <div className="episode__container">
        <h3 className="episode__title">{podcastInfo.selectedEpisode?.title}</h3>
        {podcastInfo.selectedEpisode.description && (
          <p
            className="episode__description"
            dangerouslySetInnerHTML={{
              __html: podcastInfo.selectedEpisode?.description,
            }}
          />
        )}
        <audio
          src={podcastInfo.selectedEpisode.audio}
          className="episode__player"
          controls
          type="audio"
        >
          Your browser does not support the audio tag.
        </audio>
      </div>
    </div>
  );
};

export default Episode;
