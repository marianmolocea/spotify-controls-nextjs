import useSpotify from '../hooks/useSpotify';
import { useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';
import { useEffect, useState } from 'react';

function useSongInfo() {
  const sportifyApi = useSpotify();

  const [currentTrackId] = useRecoilState(currentTrackIdState);
  const [songInfo, setSongInfo] = useState(null);

  useEffect(() => {
    const fetchSongIngo = async () => {
      if (currentTrackId) {
        try {
          const trackInfo = await fetch(`https://api.spotify.com/v1/tracks/${currentTrackId}`, {
            headers: {
              Authorization: `Bearer ${sportifyApi.getAccessToken()}`,
            },
          }).then(res => res.json())
          setSongInfo(trackInfo);
        } catch (err) {
          console.log('Something went wrong!', err);
        }
      }
    };
    fetchSongIngo();
  }, [sportifyApi, currentTrackId]);

  return songInfo;
}

export default useSongInfo;
