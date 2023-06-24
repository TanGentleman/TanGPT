import { useState, useEffect } from 'react';
import useStore from '@store/store';

export const useChatCounter = () => {
  const getChats = useStore((state) => state.chats);
  const [chatCount, setChatCount] = useState<number>(0);

  useEffect(() => {
    setChatCount(getChats?.length || 0);
  }, [getChats]);

  return chatCount;
};
