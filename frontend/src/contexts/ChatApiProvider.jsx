import { useMemo, useCallback } from 'react';
import ChatApiContext from './ChatApiContext';

const ChatApiProvider = ({ socket, children }) => {
  const sendMessage = useCallback((payload) => new Promise((resolve, reject) => {
    socket.emit('newMessage', payload, (response) => {
      // { body: "message text", channelId: 1, username: 'admin' }
      if (response.status === 'ok') {
        resolve(response.data);
      } else {
        reject(response.error);
      }
    });
  }), [socket]);

  const sendChannel = useCallback((payload) => new Promise((resolve, reject) => {
    socket.emit('newChannel', payload, (response) => {
      // { name: "new channel" }
      if (response.status === 'ok') {
        resolve(response.data);
      } else {
        reject(response.error);
      }
    });
  }), [socket]);

  const sendRemovedChannel = useCallback((payload) => new Promise((resolve, reject) => {
    socket.emit('removeChannel', payload, (response) => {
      // { id: 6 }
      if (response.status === 'ok') {
        resolve(response.data);
      } else {
        reject(response.error);
      }
    });
  }), [socket]);

  const sendRenamedChannel = useCallback((payload) => new Promise((resolve, reject) => {
    socket.emit('renameChannel', payload, (response) => {
      // { id: 7, name: "new name channel", removable: true }
      if (response.status === 'ok') {
        resolve(response.data);
      } else {
        reject(response.error);
      }
    });
  }), [socket]);

  const providedData = useMemo(() => ({
    sendMessage,
    sendChannel,
    sendRemovedChannel,
    sendRenamedChannel,
  }), [
    sendMessage,
    sendChannel,
    sendRemovedChannel,
    sendRenamedChannel]);

  return (
    <ChatApiContext.Provider value={providedData}>
      {children}
    </ChatApiContext.Provider>
  );
};

export default ChatApiProvider;
