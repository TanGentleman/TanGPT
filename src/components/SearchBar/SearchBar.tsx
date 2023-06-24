//Searchbar.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useChatCounter } from '../Menu/ChatCounter';  // import the useChatCounter hook

const SearchBar = ({
  value,
  handleChange,
  className,
  disabled,
}: {
  value: string;
  handleChange: React.ChangeEventHandler<HTMLInputElement>;
  className?: React.HTMLAttributes<HTMLDivElement>['className'];
  disabled?: boolean;
}) => {
  const { t } = useTranslation();
  const chatCount = useChatCounter();  // use the hook

  return (
    <div className={className}>
      <input
        disabled={disabled}
        type='text'
        className='text-gray-800 dark:text-white p-3 text-sm bg-transparent disabled:opacity-40  disabled:cursor-not-allowed transition-opacity m-0 w-full h-full focus:outline-none rounded border border-white/20'
        placeholder={`${t('search')} (${chatCount} chats)`}  // modify the placeholder text
        value={value}
        onChange={(e) => {
          handleChange(e);
        }}
      />
    </div>
  );
};

export default SearchBar;
