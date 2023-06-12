import ReactDOM from 'react-dom/client';
import { io } from 'socket.io-client';
import './index.css';
import './customStyles.css';
import Init from './init.js';

const socket = io();
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  Init(socket),
);
