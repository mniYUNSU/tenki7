import React from 'react';
import Container from './Container';
import WeathreIcon from './WeathreIcon';
import WeatherDetails, { WeathreDetailProps } from './WeatherDetails';
import { convertKelvinToCelsius } from '@/utils/convertKelvinToCelsius';
import { useTranslation } from 'next-i18next';

export interface ForecastWeatherDetailProps extends WeathreDetailProps {
  weatherIcon: string;
  date: string;
  day: string;
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  description: string;
}

export default function ForecastWeatherDetail(
  props: ForecastWeatherDetailProps
) {
  const { t } = useTranslation('common');

  const {
    weatherIcon = '02d',
    date = '19.09',
    day = 'Tuesday',
    temp,
    feels_like,
    temp_max,
    temp_min,
    description
  } = props;

  return (
    <Container className='gap-4'>
      {/* Left */}
      <section className='flex gap-4 items-center px-4'>
        <div className='flex flex-col gap-1 items-center text-indigo-50'>
          <p className='text-sm'>{t(`${day}`)}</p>
          <WeathreIcon iconName={weatherIcon} />
          <p>{date}</p>
        </div>
        <div className='flex flex-col gap-2 items-center px-4 text-indigo-50 '>
          <span className='text-5xl'>{convertKelvinToCelsius(temp ?? 0)}°</span>
          <p className='text-xs space-x-1 whitespace-nowrap'>
            <span>{t('feelsLike')}</span>
            <span>{convertKelvinToCelsius(feels_like ?? 0)}°</span>
          </p>
          <p className='text-sm capitalize text-center'>{description}</p>
        </div>
      </section>
      {/* Right */}
      <section className='overflow-x-auto flex justify-between gap-4 px-4 w-full pr-10'>
        <WeatherDetails {...props} />
      </section>
    </Container>
  );
}
