import { useContext } from 'react';

import chatApiContext from '../contexts/ChatApiContext.jsx';

const useSocket = () => useContext(chatApiContext);

export default useSocket;
