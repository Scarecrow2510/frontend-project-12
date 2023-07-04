import {
  Routes,
  Route,
  useLocation,
  Navigate,
} from 'react-router-dom';
import {
  Button, Nav,
} from 'react-bootstrap';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';
import ErrorPage from './ErrorPage';
import SignUpPage from './SignUpPage';
import ChatPage from './ChatPage';
import SignInPage from './SignInPage';
import useAuth from '../hooks/authHook';
import useNetwork from '../hooks/networkHook';
import NetworkError from '../public/NetworkError.png';
import UK from '../public/UK.png';
import RU from '../public/RU.png';
import routes from '../routes/routes';
import useLang from '../hooks/langHook';
import Modals from './Modals';

const PrivateRoute = ({ children }) => {
  const auth = useAuth();
  const userData = auth.getUserInfo();
  const location = useLocation();

  return userData ? (
    children
  ) : (
    <Navigate to={routes.loginPage()} state={{ from: location }} />
  );
};

const Main = () => {
  const { t } = useTranslation();
  const network = useNetwork();
  const auth = useAuth();
  const lang = useLang();
  const hasUserData = auth.getUserInfo();

  useEffect(() => {
    window.addEventListener('online', network.handleNetworkChange);
    window.addEventListener('offline', network.handleNetworkChange);
  }, [network]);

  const handleChangeLanguage = () => {
    lang.setNewLanguage();
  };

  return (
    <div className="h-100">
      <div className="h-100" id="chat">
        <div className="d-flex flex-column h-100">
          <Nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
            <div className="container">
              <a className="navbar-brand" href="/">
                {t('mainPage.hexlet')}
              </a>
              <div id="img-logout-lngs">
                <img
                  alt="Network error"
                  id="main-network-img"
                  src={NetworkError}
                  className={`d-inline-block img-fluid mr-3 ml-auto ${
                    !hasUserData ? 'invisible' : ''
                  }`}
                  style={{
                    opacity: network.isOnline ? 0 : 1,
                  }}
                />
                {hasUserData && (
                <Button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    auth.logOut();
                  }}
                >
                  {t('mainPage.signOut')}
                </Button>
                )}
                <Button
                  type="button"
                  variant="white"
                  id="language-button"
                  onClick={() => handleChangeLanguage()}
                >
                  <img alt="Change language" src={lang.activeLanguage === 'ru' ? UK : RU} id="change-lang-img" />
                </Button>
              </div>
            </div>
          </Nav>
          <Routes>
            <Route
              path="/"
              element={(
                <PrivateRoute>
                  <ChatPage />
                </PrivateRoute>
              )}
            />
            <Route path={routes.loginPage()} element={<SignInPage />} />
            <Route path={routes.signUpPage()} element={<SignUpPage />} />
            <Route path={routes.errorPage()} element={<ErrorPage />} />
          </Routes>
          <Modals />
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Main;
