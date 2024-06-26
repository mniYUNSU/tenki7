'use client';

import React, { useEffect, useState } from 'react';
import { FaLocationCrosshairs, FaLocationDot } from 'react-icons/fa6';
import { GiStripedSun } from 'react-icons/gi';
import SearchBox from './SearchBox';
import axios from 'axios';
import { currentLocale, loadingCityAtom, placeAtom } from '@/app/atom';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import SelectLocaleBox from './SelectLocaleBox';

type Props = { location?: string };

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_KEY;

export default function Navbar({ location }: Props) {
  const [city, setCity] = useState('');
  const [error, setError] = useState('');

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showSelectLocaleBox, setShowSelectLocaleBox] = useState(false);
  const [place, setPlace] = useAtom(placeAtom);
  const [_, setLoadingCity] = useAtom(loadingCityAtom);
  const [locale, setLocale] = useAtom(currentLocale);

  const router = useRouter();

  useEffect(() => {
    handleCurrentLocation();
  }, []);

  const switchLocale = (locale: string) => {
    setShowSelectLocaleBox(false);
    setLocale(locale);
    router.push(router.pathname, router.asPath, { locale });
  };

  async function handleInputChange(value: string) {
    setCity(value);
    if (value.length >= 3) {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/find?q=${value}&appid=${API_KEY}`
        );

        const suggestions = response.data.list.map((item: any) => item.name);
        setSuggestions(suggestions);
        setError('');
        setShowSuggestions(true);
      } catch (error) {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }

  function handleSuggestionClick(value: string) {
    setCity(value);
    setShowSelectLocaleBox(false);
    setShowSuggestions(false);
  }

  function handleSubmitSearch(e: React.FormEvent<HTMLFormElement>) {
    setLoadingCity(true);
    setShowSelectLocaleBox(false);
    e.preventDefault();
    if (suggestions.length === 0) {
      setError('Location not found');
      setLoadingCity(false);
    } else {
      setError('');
      setTimeout(() => {
        setLoadingCity(false);
        setPlace(city);
        setShowSuggestions(false);
        setCity('');
      }, 500);
    }
  }

  function handleCurrentLocation() {
    setShowSelectLocaleBox(false);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          setLoadingCity(true);
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
          );

          setTimeout(() => {
            setLoadingCity(false);
            setPlace(response.data.name);
          }, 500);
        } catch (error) {
          setLoadingCity(false);
        }
      });
    }
  }

  return (
    <>
      <nav className='shadow-sm sticky top-0 left-0 z-50 bg-indigo-800'>
        <div className='h-[80px] w-full flex justify-between items-center max-w-7xl px-3 mx-auto'>
          <p className='flex items-center justify-center gap-2'>
            <h2 className='text-lime-400 text-3xl font-mono font-semibold'>
              TENKI 7
            </h2>
            <GiStripedSun className='text-3xl text-rose-600' />
          </p>
          <section className='flex gap-3 items-center'>
            <p
              className='text-sm text-indigo-100 font-mono cursor-pointer select-none hover:bg-indigo-900 hover:text-indigo-200 px-2 py-3 rounded-lg relative hidden md:flex'
              onClick={() => setShowSelectLocaleBox(!showSelectLocaleBox)}
            >
              {locale === 'en'
                ? '🇺🇸 English'
                : locale === 'ko'
                ? '🇰🇷 한국어'
                : '🇯🇵 日本語'}
              <SelectLocaleBox {...{ showSelectLocaleBox, switchLocale }} />
            </p>
            <FaLocationCrosshairs
              title='Your Current Location'
              onClick={handleCurrentLocation}
              className='text-2xl text-rose-500 hover:opacity-80 cursor-pointer'
            />
            <FaLocationDot className='text-2xl text-indigo-100' />
            <p className='text-sm text-indigo-100 font-mono'> {location} </p>
            <div className='relative hidden md:flex'>
              <SearchBox
                value={city}
                onSubmit={handleSubmitSearch}
                onChange={(e) => handleInputChange(e.target.value)}
              />
              <SuggestionBox
                {...{
                  showSuggestions,
                  suggestions,
                  handleSuggestionClick,
                  error
                }}
              />
            </div>
          </section>
        </div>
      </nav>

      <section className='flex max-w-7xl px-3 md:hidden justify-between'>
        <div className='relative '>
          <SearchBox
            value={city}
            onSubmit={handleSubmitSearch}
            onChange={(e) => handleInputChange(e.target.value)}
          />
          <SuggestionBox
            {...{
              showSuggestions,
              suggestions,
              handleSuggestionClick,
              error
            }}
          />
        </div>
        <p
          className='text-sm text-indigo-100 font-mono cursor-pointer select-none hover:bg-indigo-900 hover:text-indigo-200 px-2 py-3 rounded-lg relative '
          onClick={() => setShowSelectLocaleBox(!showSelectLocaleBox)}
        >
          {locale === 'en'
            ? '🇺🇸 English'
            : locale === 'ko'
            ? '🇰🇷 한국어'
            : '🇯🇵 日本語'}
          <SelectLocaleBox {...{ showSelectLocaleBox, switchLocale }} />
        </p>
      </section>
    </>
  );
}

function SuggestionBox({
  showSuggestions,
  suggestions,
  handleSuggestionClick,
  error
}: {
  showSuggestions: boolean;
  suggestions: string[];
  handleSuggestionClick: (item: string) => void;
  error: string;
}) {
  return (
    <>
      {((showSuggestions && suggestions.length > 1) || error) && (
        <ul className='mb-4 bg-white absolute border top-[44px] left-0 border-gray-300 rounded-md min-w-[200px] flex flex-col gap-1 py-2 px-2'>
          {error && suggestions.length < 1 && (
            <li className='text-red-500 p-1'>{error}</li>
          )}
          {suggestions.map((item, i) => (
            <li
              key={i}
              onClick={() => handleSuggestionClick(item)}
              className='cursor-pointer p-1 rounded hover:bg-gray-200'
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
