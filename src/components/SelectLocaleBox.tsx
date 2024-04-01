import React from 'react';

export default function SelectLocaleBox({
  showSelectLocaleBox,
  switchLocale
}: {
  showSelectLocaleBox: boolean;
  switchLocale: (locale: string) => void;
}) {
  const localeItems = ['en', 'ko', 'ja'];

  return (
    <>
      {showSelectLocaleBox && (
        <ul className=' text-sm mb-4 bg-indigo-100 absolute border top-[50px] right-0 border-gray-300 rounded-md min-w-[120px] flex flex-col gap-1 py-2 px-2 text-black'>
          {localeItems.map((item, i) => (
            <li
              key={i}
              onClick={() => switchLocale(item)}
              className='w-full cursor-pointer p-1 rounded hover:bg-indigo-200  text-center text-sm'
            >
              {i === 0 ? '🇺🇸 English' : i === 1 ? '🇰🇷 한국어' : '🇯🇵 日本語'}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
