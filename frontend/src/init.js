/* eslint-disable react/destructuring-assignment */
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import React from 'react';
import { Provider as RollbalProvider, ErrorBoundary } from '@rollbar/react';
import filter from 'leo-profanity';
import i18next from 'i18next';
import App from './App';
import './index.css';
import { addMessage } from './slices/messagesSlice';
import {
  addChannel, removeChannel, renameChannel,
} from './slices/channelsSlice';
import store from './slices/index';
import resources from './locales/index';

const rollbarConfig = {
  accessToken: process.env.REACT_APP_ROLLBAR_TOKEN,
  payload: {
    environment: 'production',
  },
  captureUncaught: true,
  captureUnhandledRejections: true,
};

const Init = (socket) => {
  const defaultLanguage = JSON.parse(localStorage.getItem('currentLanguage')) ?? 'ru';

  i18next
    .use(initReactI18next)
    .init({
      debug: false,
      lng: defaultLanguage,
      fallbackLng: 'ru',
      resources,
    });

  filter.add(filter.getDictionary('en'));
  filter.add(filter.getDictionary('ru'));

  socket.on('newMessage', (data) => {
    store.dispatch(addMessage(data));
  });
  socket.on('newChannel', (data) => {
    store.dispatch(addChannel(data));
  });
  socket.on('removeChannel', (data) => {
    store.dispatch(removeChannel(data));
  });
  socket.on('renameChannel', (data) => {
    store.dispatch(renameChannel(data));
  });

  return (
    <React.StrictMode>
      <BrowserRouter>
        <RollbalProvider config={rollbarConfig}>
          <ErrorBoundary>
            <Provider store={store}>
              <I18nextProvider i18n={i18next}>
                <App socket={socket} />
              </I18nextProvider>
            </Provider>
          </ErrorBoundary>
        </RollbalProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default Init;
