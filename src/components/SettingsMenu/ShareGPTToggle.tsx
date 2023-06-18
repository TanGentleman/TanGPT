import React, { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
import useStore from '@store/store';
import Toggle from '@components/Toggle';

// legacy function
// const ShareGPTToggleOld = () => {
//   const { t } = useTranslation();

//   const setShareGPT = useStore((state) => state.setShareGPT);

//   const [isChecked, setIsChecked] = useState<boolean>(
//     useStore.getState().shareGPT
//   );

//   useEffect(() => {
//     setShareGPT(isChecked);
//   }, [isChecked]);

//   return (
//     <Toggle
//       label={t('postOnShareGPT.title') as string}
//       isChecked={isChecked}
//       setIsChecked={setIsChecked}
//     />
//   );
// };

const ShareGPTToggle = () => {

  const setShareGPT = useStore((state) => state.setShareGPT);

  const [isChecked, setIsChecked] = useState<boolean>(false);

  useEffect(() => {
    const initialShareGPT = useStore.getState().shareGPT;
    setIsChecked(initialShareGPT);
    setShareGPT(initialShareGPT);
  }, []);

  useEffect(() => {
    setShareGPT(isChecked);
  }, [isChecked]);

  const label = 'postOnShareGPT.title';
  if (typeof label !== 'string') {
    throw new Error('Translation for postOnShareGPT.title is not a string');
  }

  return (
    <Toggle
      label={label}
      isChecked={isChecked}
      setIsChecked={setIsChecked}
    />
  );
};

export default ShareGPTToggle;