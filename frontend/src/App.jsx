import 'bootstrap/dist/css/bootstrap.min.css';
import Main from './components/Main';
import AuthProvider from './contexts/AuthProvider';
import NetworkProvider from './contexts/NetworkProvider';
import ChatApiProvider from './contexts/ChatApiProvider';
import LangProvider from './contexts/LanguageProvider';

const App = ({ socket }) => (
  <ChatApiProvider socket={socket}>
    <NetworkProvider>
      <AuthProvider>
        <LangProvider>
          <Main />
        </LangProvider>
      </AuthProvider>
    </NetworkProvider>
  </ChatApiProvider>
);

export default App;
