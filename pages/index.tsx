'use client';

import Container from '@/components/Container';
import ForecastWeatherDetail from '@/components/ForecastWeathreDetail';
import Navbar from '@/components/Navbar';
import WeatherDetails from '@/components/WeatherDetails';
import WeathreIcon from '@/components/WeathreIcon';
import { convertKelvinToCelsius } from '@/utils/convertKelvinToCelsius';
import { convertWindSpeed } from '@/utils/converWindSpeed';
import { getDayOrNightIcon } from '@/utils/getDayOrNightIcon';
import { metersToKilometers } from '@/utils/metersToKilometers';
import axios from 'axios';
import { format, fromUnixTime, parseISO } from 'date-fns';
import { useAtom } from 'jotai';
import { useQuery } from 'react-query';
import { currentLocale, loadingCityAtom, placeAtom } from '@/app/atom';
import { useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';

interface WeatherDetail {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  visibility: number;
  pop: number;
  sys: {
    pod: string;
  };
  dt_txt: string;
}

interface WeatherData {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherDetail[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common']))
    }
  };
}

export default function Home() {
  const { t } = useTranslation('common');

  const [place, setPlace] = useAtom(placeAtom);
  const [loadingCity, setLoadingCity] = useAtom(loadingCityAtom);
  const [locale, setLocale] = useAtom(currentLocale);

  const router = useRouter();

  const { isLoading, error, data, refetch } = useQuery<WeatherData>(
    'repoData',
    async () => {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`
      );
      return data;
    }
  );

  useEffect(() => {
    setLocale(router.locale ?? 'en');
  }, [router.locale, setLocale]);

  useEffect(() => {
    refetch();
  }, [place, refetch]);

  const firstData = data?.list[0];

  const uniqueDates = [
    ...new Set(
      data?.list.map(
        (entry) => new Date(entry.dt * 1000).toISOString().split('T')[0]
      )
    )
  ];

  const firstDataForEachDate = uniqueDates.map((date) => {
    return data?.list.find((entry) => {
      const entryDate = new Date(entry.dt * 1000).toISOString().split('T')[0];
      const entryTime = new Date(entry.dt * 1000).getHours();
      return entryDate === date && entryTime >= 6;
    });
  });

  if (isLoading)
    return (
      <div className='flex items-center min-h-screen justify-center bg-slate-900 '>
        <p className='animate-pulse text-indigo-50 text-3xl font-mono font-bold'>
          {t('loading')}
        </p>
      </div>
    );

  return (
    <div className='flex flex-col gap-4 bg-slate-900 min-h-screen'>
      <Navbar location={data?.city.name} />
      <main className='px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4'>
        {loadingCity ? (
          <WeatherSkeleton />
        ) : (
          <>
            {/* Today Data */}
            <section className='space-y-4'>
              <div className='space-y-2'>
                <h2 className='flex gap-1 text-2xl items-end text-indigo-50'>
                  <p>
                    {t(`${format(parseISO(firstData?.dt_txt ?? ''), 'EEEE')}`)}
                  </p>
                  <p className='text-lg text-indigo-50/70'>
                    ({format(parseISO(firstData?.dt_txt ?? ''), 'yyyy.MM.dd')})
                  </p>
                </h2>
                <Container className=' gap-10 px-6 items-center border-lime-400'>
                  {/* Temperature */}
                  <div className='flex flex-col items-center px-4'>
                    <span className='text-5xl text-indigo-50'>
                      {convertKelvinToCelsius(firstData?.main.temp ?? 296.37)}°
                    </span>
                    <p className='text-xs space-x-1 whitespace-nowrap text-indigo-50'>
                      <span>{t('feelsLike')}</span>
                      <span>
                        {convertKelvinToCelsius(
                          firstData?.main.feels_like ?? 296.37
                        )}
                        °
                      </span>
                    </p>
                    <p className='text-xs space-x-2 text-indigo-50'>
                      <span className='text-blue-500'>
                        {convertKelvinToCelsius(firstData?.main.temp_min ?? 0)}
                        °↓{' '}
                      </span>
                      <span className='text-rose-600'>
                        {' '}
                        {convertKelvinToCelsius(firstData?.main.temp_max ?? 0)}
                        °↑
                      </span>
                    </p>
                  </div>
                  {/* Time & Weather icon */}
                  <div className='flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3 text-indigo-50'>
                    {data?.list.map((data, index) => (
                      <div
                        key={index}
                        className='flex flex-col justify-between gap-2 items-center text-xs font-semibold'
                      >
                        <p className='whitespace-nowrap'>
                          {t(`${format(parseISO(data.dt_txt), 'a')}`)}
                          {'  '}
                          {format(parseISO(data.dt_txt), 'h:mm')}
                        </p>
                        <WeathreIcon
                          iconName={getDayOrNightIcon(
                            data.weather[0].icon,
                            data.dt_txt
                          )}
                        />
                        <p>{convertKelvinToCelsius(data.main.temp ?? 0)}°</p>
                      </div>
                    ))}
                  </div>
                </Container>
              </div>
              <div className='flex gap-4 text-indigo-50'>
                {/* Left */}
                <Container className='w-fit justify-center flex-col px-4 items-center border-lime-400'>
                  <p className=' capitalize text-center'>
                    {t(`${firstData?.weather[0].description}`)}
                  </p>
                  <WeathreIcon
                    iconName={getDayOrNightIcon(
                      firstData?.weather[0].icon ?? '',
                      firstData?.dt_txt ?? ''
                    )}
                  />
                </Container>
                {/* Right */}
                <Container className='bg-indigo-900/30 px-6 gap-4 justify-between overflow-x-auto border-lime-400 '>
                  <WeatherDetails
                    visibility={metersToKilometers(
                      firstData?.visibility ?? 10000
                    )}
                    airPressure={`${firstData?.main.pressure} hPa`}
                    humidity={`${firstData?.main.humidity}%`}
                    windSpeed={`${convertWindSpeed(
                      firstData?.wind.speed ?? 1.64
                    )}`}
                    sunrise={format(
                      fromUnixTime(data?.city.sunrise ?? 1702949452),
                      'H:mm'
                    )}
                    sunset={format(
                      fromUnixTime(data?.city.sunset ?? 1702517657),
                      'H:mm'
                    )}
                  />
                </Container>
              </div>
            </section>
            {/* 7 Day Forecast */}
            <section className='flex w-full flex-col gap-4'>
              <p className='text-2xl text-indigo-50'>{t('7days')}</p>
              {firstDataForEachDate.map((d, index) => (
                <ForecastWeatherDetail
                  key={index}
                  description={d?.weather[0].description ?? ''}
                  weatherIcon={d?.weather[0].icon ?? '01d'}
                  date={format(parseISO(d?.dt_txt ?? ''), 'MM.dd')}
                  day={format(parseISO(d?.dt_txt ?? ''), 'EEEE')}
                  feels_like={d?.main.feels_like ?? 0}
                  temp={d?.main.temp ?? 0}
                  temp_max={d?.main.temp_max ?? 0}
                  temp_min={d?.main.temp_min ?? 0}
                  airPressure={`${d?.main.pressure} hPa`}
                  humidity={`${d?.main.humidity}%`}
                  sunrise={format(
                    fromUnixTime(data?.city.sunrise ?? 1702517657),
                    'H:mm'
                  )}
                  sunset={format(
                    fromUnixTime(data?.city.sunset ?? 1702517657),
                    'H:mm'
                  )}
                  visibility={`${metersToKilometers(d?.visibility ?? 10000)} `}
                  windSpeed={`${convertWindSpeed(d?.wind.speed ?? 1.64)}`}
                />
              ))}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function WeatherSkeleton() {
  return (
    <section className='space-y-8 '>
      {/* Today's data skeleton */}
      <div className='space-y-2 animate-pulse'>
        {/* Date skeleton */}
        <div className='flex gap-1 text-2xl items-end '>
          <div className='h-6 w-24 bg-gray-300 rounded'></div>
          <div className='h-6 w-24 bg-gray-300 rounded'></div>
        </div>

        {/* Time wise temperature skeleton */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className='flex flex-col items-center space-y-2'>
              <div className='h-6 w-16 bg-gray-300 rounded'></div>
              <div className='h-6 w-6 bg-gray-300 rounded-full'></div>
              <div className='h-6 w-16 bg-gray-300 rounded'></div>
            </div>
          ))}
        </div>
      </div>

      {/* 7 days forecast skeleton */}
      <div className='flex flex-col gap-4 animate-pulse'>
        <p className='text-2xl h-8 w-36 bg-gray-300 rounded'></p>

        {[1, 2, 3, 4, 5, 6, 7].map((index) => (
          <div key={index} className='grid grid-cols-2 md:grid-cols-4 gap-4 '>
            <div className='h-8 w-28 bg-gray-300 rounded'></div>
            <div className='h-10 w-10 bg-gray-300 rounded-full'></div>
            <div className='h-8 w-28 bg-gray-300 rounded'></div>
            <div className='h-8 w-28 bg-gray-300 rounded'></div>
          </div>
        ))}
      </div>
    </section>
  );
}
