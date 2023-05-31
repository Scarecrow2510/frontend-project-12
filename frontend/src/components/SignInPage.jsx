import { Link, useNavigate } from 'react-router-dom';
import {
  React, useState, useRef, useEffect,
} from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import cn from 'classnames';
import axios from 'axios';
import {
  Form, Button, Row, Col, Card, Container,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Login from '../images/Login.jpg';
import routes from '../routes/routes.js';
import useAuth from '../hooks/authHook';
import useNetwork from '../hooks/networkHook';

const SignInPage = () => {
  const [authError, setAuthError] = useState(false);
  const [serverError, setServerError] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();
  const network = useNetwork();
  const loginElement = useRef();
  const passwordElement = useRef();
  const submitElement = useRef();
  const { t } = useTranslation();

  useEffect(() => {
    loginElement.current.focus();
  }, []);

  const handleKeyDown = (event, inputRef) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      inputRef.current.focus();
    }
  };

  const signInSchema = yup.object().shape({
    username: yup
      .string()
      .required(),
    password: yup
      .string()
      .required(),
  });

  const f = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: signInSchema,
    validateOnChange: false,
    onSubmit: async () => {
      setAuthError(false);
      setServerError(false);
      axios
        .post(routes.loginPath(), {
          username: f.values.username,
          password: f.values.password,
        })
        .then((response) => {
          auth.logIn(response);
          navigate(routes.mainPage());
        })
        .catch((error) => {
          const { code } = error;
          switch (code) {
            case 'ERR_BAD_RESPONSE':
              return setServerError(true);
            default:
              return setAuthError(true);
          }
        });
    },
  });

  const inputClassNames = cn('form-control', {
    'is-invalid': f.errors.username || f.errors.password || authError || serverError,
  });

  return (
    <Container fluid className="h-100">
      <Row className="row justify-content-center align-content-center h-100">
        <Col className="col-12 col-md-8 col-xxl-6">
          <Card className="card shadow-sm">
            <Card.Body className="card-body row p-5">
              <Col className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <img src={Login} className="rounded-circle" alt={t('signInPage.h1Text')} />
              </Col>
              <Form
                onSubmit={f.handleSubmit}
                className="col-12 col-md-6 mt-3 mt-mb-0"
              >
                <h1 className="text-center mb-4">{t('signInPage.h1Text')}</h1>
                <Form.Group className="form-floating mb-3">
                  <Form.Control
                    name="username"
                    autoComplete="username"
                    required=""
                    placeholder={t('signInPage.placeholders.username')}
                    id="username"
                    ref={loginElement}
                    onKeyDown={(e) => handleKeyDown(e, passwordElement)}
                    className={inputClassNames}
                    value={f.values.username}
                    onChange={f.handleChange}
                  />
                  <Form.Label className="form-label" htmlFor="username">
                    {t('signInPage.placeholders.username')}
                  </Form.Label>
                </Form.Group>
                <Form.Group className="form-floating mb-1">
                  <Form.Control
                    name="password"
                    autoComplete="current-password"
                    required=""
                    placeholder={t('signInPage.placeholders.password')}
                    type="password"
                    id="password"
                    ref={passwordElement}
                    onKeyDown={(e) => handleKeyDown(e, submitElement)}
                    className={inputClassNames}
                    value={f.values.password}
                    onChange={f.handleChange}
                  />
                  <Form.Label className="form-label" htmlFor="password">
                    {t('signInPage.placeholders.password')}
                  </Form.Label>
                  <div
                    className={`invalid-tooltip ${
                      f.errors || authError || serverError || !network.isOnline
                        ? ''
                        : 'invisible'
                    }`}
                    id="signIn-error"
                  >
                    {serverError ? t('errors.server') : t('errors.loginValidation')}
                  </div>
                </Form.Group>
                <br />
                <Button
                  type="submit"
                  ref={submitElement}
                  onClick={() => loginElement.current.focus()}
                  className={`w-100 mb-3 ${network.isOnline ? 'btn-primary' : 'btn-danger'}`}
                  disabled={f.isSubmitting || !network.isOnline}
                  id="signIn-login-button"
                >
                  {network.isOnline ? t('signInPage.loginButton') : t('errors.network')}
                </Button>
              </Form>
            </Card.Body>
            <Card.Footer className="card-footer p-4">
              <div className="text-center">
                <span>{t('signInPage.footerMessage')}</span>
                <Link to={routes.signUpPage()}>{t('signInPage.registrationLink')}</Link>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SignInPage;
