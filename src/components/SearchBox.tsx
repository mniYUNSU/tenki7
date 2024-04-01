import { cn } from '@/utils/cn';
import React from 'react';
import { TbWorldSearch } from 'react-icons/tb';

type Props = {
  className?: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
  onSubmit: React.FormEventHandler<HTMLFormElement> | undefined;
};

export default function SearchBox(props: Props) {
  return (
    <form
      className={cn(
        'flex relative items-center justify-center h-10',
        props.className
      )}
      onSubmit={props.onSubmit}
    >
      <input
        type='text'
        value={props.value}
        onChange={props.onChange}
        placeholder='Search location...'
        className='px-4 py-2 w-[180px] border border-indigo-400 rounded-l-md focus:outline-none focus:border-lime-400 h-full bg-transparent text-indigo-100'
      />
      <button className='px-4 py-[9px] bg-indigo-100 rounded-r-md focus:outline-none hover:bg-indigo-200 h-full text-indigo-900'>
        <TbWorldSearch className='text-xl' />
      </button>
    </form>
  );
}
