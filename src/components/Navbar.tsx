import React from 'react';
import { FaLocationCrosshairs, FaLocationDot } from 'react-icons/fa6';
import { GiStripedSun } from 'react-icons/gi';
import SearchBox from './SearchBox';

type Props = {};

export default function Navbar({}: Props) {
  return (
    <nav className='shadow-sm sticky top-0 left-0 z-50 bg-indigo-800'>
      <div className='h-[80px] w-full flex justify-between items-center max-w-7xl px-3 mx-auto'>
        <p className='flex items-center justify-center gap-2'>
          <h2 className='text-lime-400 text-3xl font-mono font-semibold'>
            TENKI 7
          </h2>
          <GiStripedSun className='text-3xl text-rose-600' />
        </p>
        <section className='flex gap-3 items-center'>
          <FaLocationCrosshairs className='text-2xl text-rose-500 hover:opacity-80 cursor-pointer' />
          <FaLocationDot className='text-2xl text-indigo-100' />
          <p className='text-sm text-indigo-100 font-mono'> Seoul </p>
          <div>
            <SearchBox />
          </div>
        </section>
      </div>
    </nav>
  );
}
