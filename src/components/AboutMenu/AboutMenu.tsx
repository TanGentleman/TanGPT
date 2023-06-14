import React, { useState } from 'react';
import PopupModal from '@components/PopupModal';
import AboutIcon from '@icon/AboutIcon';

const AboutMenu = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <>
      <a
        className='flex py-2 px-2 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm'
        onClick={() => setIsModalOpen(true)}
      >
        <div>
          <AboutIcon />
        </div>
        About
      </a>
      {isModalOpen && (
        <PopupModal
          title="About"
          setIsModalOpen={setIsModalOpen}
          cancelButton={false}
        >
          <div className='p-6 border-b border-gray-200 dark:border-gray-600'>
            <div className='min-w-fit text-gray-900 dark:text-gray-300 text-sm flex flex-col gap-3 leading-relaxed'>
              <p>
                Forked and maintained by Tan. Built off work by Jing Hua, Antonio Cheong, and many others in the community. Check out Better ChatGPT upstream: 
                <a href='https://github.com/ztjhz/BetterChatGPT' target='_blank'>https://github.com/ztjhz/BetterChatGPT</a>
              </p>
              <p>
                Source code for this project: <br />
                <a href='https://github.com/TanGentleman/TanGPT' target='_blank'>https://github.com/TanGentleman/TanGPT</a>
              </p>
              <h2 className='text-lg font-bold'>Go easy on the personal endpoint I host and provide as a proxy for testing.</h2>
            </div>
          </div>
        </PopupModal>
      )}
    </>
  );
};


export default AboutMenu;