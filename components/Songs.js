import { useRecoilValue } from 'recoil';
import { playlistState } from '../atoms/playlistAtom';
import Song from '../components/Song';

export default function Songs() {
  const playlist = useRecoilValue(playlistState);
  return (
    <div className="text-white px-8 flex-col space-y-1 pb-28">
      {playlist?.tracks?.items.map(({ track }, index) => (
        <Song key={track.id} track={track} order={index} />
      ))}
    </div>
  );
}
