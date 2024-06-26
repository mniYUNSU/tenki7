import React from 'react';
import { FiDroplet } from 'react-icons/fi';
import { ImMeter } from 'react-icons/im';
import { LuEye, LuSunrise, LuSunset } from 'react-icons/lu';
import { MdAir } from 'react-icons/md';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export interface WeathreDetailProps {
  visibility: string;
  humidity: string;
  windSpeed: string;
  airPressure: string;
  sunrise: string;
  sunset: string;
}

export default function WeatherDetails(props: WeathreDetailProps) {
  const { t } = useTranslation('common');

  const {
    visibility = '25km',
    humidity = '61%',
    windSpeed = '7 km/h',
    airPressure = '1012 hPa',
    sunrise = '6.20',
    sunset = '18:48'
  } = props;

  return (
    <>
      <SingleWeatherDetail
        icon={<LuEye />}
        information={t('visibility')}
        value={visibility}
      />
      <SingleWeatherDetail
        icon={<FiDroplet />}
        information={t('humidity')}
        value={humidity}
      />
      <SingleWeatherDetail
        icon={<MdAir />}
        information={t('windSpeed')}
        value={windSpeed}
      />
      <SingleWeatherDetail
        icon={<ImMeter />}
        information={t('airPressure')}
        value={airPressure}
      />
      <SingleWeatherDetail
        icon={<LuSunrise />}
        information={t('sunrise')}
        value={sunrise}
      />
      <SingleWeatherDetail
        icon={<LuSunset />}
        information={t('sunset')}
        value={sunset}
      />
    </>
  );
}

export interface SingleWeatherDetailProps {
  information: string;
  icon: React.ReactNode;
  value: string;
}

function SingleWeatherDetail(props: SingleWeatherDetailProps) {
  return (
    <div className='flex flex-col justify-evenly gap-2 items-center text-xs font-semibold text-indigo-50/90'>
      <p className='whitespace-nowrap'>{props.information}</p>
      <div className='text-3xl'>{props.icon}</div>
      <p>{props.value}</p>
    </div>
  );
}
