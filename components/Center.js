import { ChevronDownIcon } from '@heroicons/react/outline';
import { useState, useEffect } from 'react';
import { shuffle } from 'lodash';
import { useRecoilState, useRecoilValue } from 'recoil';
import { playlistIdState, playlistState } from '../atoms/playlistAtom';
import useSpotify from '../hooks/useSpotify';
import Songs from '../components/Songs';
import { signOut, useSession } from 'next-auth/react';

const colors = [
  'from-indigo-500',
  'from-blue-500',
  'from-green-500',
  'from-red-500',
  'from-yellow-500',
  'from-pink-500',
  'from-purple-500',
];

export default function Center() {
  const { data: session } = useSession();
  const sportifyApi = useSpotify();
  const [color, setColor] = useState(null);
  const playlistId = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [playlistId]);

  useEffect(() => {
    sportifyApi
      .getPlaylist(playlistId)
      .then((data) => {
        setPlaylist(data.body);
      })
      .catch((err) => console.log('Something went wrong!', err));
  }, [sportifyApi, playlistId]);

  return (
    <div className="flex-grow text-white h-screen overflow-y-scroll scrollbar-hide">
      <header className="absolute top-5 right-8">
        <div
          onClick={signOut}
          className="flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2"
        >
          <img className="rounderd-full w-10 h-10" src={session?.user.image} alt="profile photo" />
          <h2>{session?.user?.name}</h2>
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </header>
      <section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} text-white h-80 p-8`}>
        <img className="h-44 w-44 shadow-2xl" src={playlist?.images?.[0]?.url} alt="album cover image" />
        <div>
          <p>Playlist</p>
          <h2 className="text-2xl md:text-3xl xl:text-5xl font-bold">{playlist?.name}</h2>
        </div>
      </section>
      <div>
        <Songs />
      </div>
    </div>
  );
}
