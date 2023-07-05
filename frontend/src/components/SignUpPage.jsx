import {
  Row, Col, Card, Form, Button, Container,
} from 'react-bootstrap';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SignUp from '../public/SignUp.jpg';
import routes from '../routes/routes';
import useNetwork from '../hooks/networkHook';
import useAuth from '../hooks/authHook';

const SignUpPage = () => {
  const [authError, setAuthError] = useState(false);
  const [serverError, setServerError] = useState(false);
  const usernameFocus = useRef();
  const passwordFocus = useRef();
  const confirmPasswordFocus = useRef();
  const submitFocus = useRef();
  const network = useNetwork();
  const navigate = useNavigate();
  const auth = useAuth();
  const { t } = useTranslation();

  const signUpSchema = yup.object().shape({
    username: yup
      .string()
      .min(3, 'errors.symbolsLength')
      .max(20, 'errors.symbolsLength')
      .required('errors.requiredField'),
    password: yup
      .string()
      .min(6, 'errors.tooShortPassword')
      .required('errors.requiredField'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], 'errors.passwordsDontMatch')
      .required('errors.requiredField'),
  });

  useEffect(() => {
    usernameFocus.current.focus();
  }, []);

  const handleKeyDown = (event, inputRef) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      inputRef.current.focus();
    }
  };

  const f = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: signUpSchema,
    validateOnChange: false,
    onSubmit: async () => {
      setAuthError(false);
      setServerError(false);
      await axios
        .post(routes.usersPath(), {
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

  const handleButtonText = (authorizationError, serverConnectionError, connection) => {
    switch (true) {
      case serverConnectionError:
        return t('errors.server');
      case !connection.isOnline:
        return t('errors.network');
      case authorizationError:
        return t('errors.authorizationError');
      default:
        return t('signUpPage.registerButton');
    }
  };

  return (
    <Container fluid className="h-100">
      <Row className="row justify-content-center align-content-center h-100">
        <Col className="col-12 col-md-8 col-xxl-6">
          <Card className="card shadow-sm">
            <Card.Body className="card-body d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
              <div>
                <img
                  src={SignUp}
                  className="rounded-circle mb-3"
                  alt={t('signUpPage.h1Text')}
                  id="signUp-image"
                />
              </div>
              <Form id="signUp-form" onSubmit={f.handleSubmit}>
                <h1 className="text-center mb-4" id="signUp-reg">
                  {t('signUpPage.h1Text')}
                </h1>
                <Form.Group className="form-floating mb-2">
                  <Form.Control
                    name="username"
                    autoComplete="username"
                    required=""
                    placeholder={t('signUpPage.username')}
                    id="username"
                    ref={usernameFocus}
                    onKeyDown={(e) => handleKeyDown(e, passwordFocus)}
                    className={`form-control ${f.errors.username && 'is-invalid'}`}
                    value={f.values.username}
                    onChange={f.handleChange}
                  />
                  <Form.Label className="form-label" htmlFor="username">
                    {t('signUpPage.username')}
                  </Form.Label>
                  <div className="invalid-tooltip" id="signUp-errors">
                    {t(f.errors.username)}
                  </div>
                </Form.Group>
                <br />
                <Form.Group className="form-floating mb-2 mt-1">
                  <Form.Control
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required=""
                    placeholder={t('signUpPage.password')}
                    id="password"
                    ref={passwordFocus}
                    onKeyDown={(e) => handleKeyDown(e, confirmPasswordFocus)}
                    className={`form-control ${f.errors.password && 'is-invalid'}`}
                    value={f.values.password}
                    onChange={f.handleChange}
                  />
                  <div className="invalid-tooltip" id="signUp-errors">
                    {t(f.errors.password)}
                  </div>
                  <Form.Label className="form-label" htmlFor="password">
                    {t('signUpPage.password')}
                  </Form.Label>
                </Form.Group>
                <br />
                <Form.Group className="form-floating mb-2 mt-1">
                  <input
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required=""
                    placeholder={t('signUpPage.confirmPassword')}
                    id="confirmPassword"
                    ref={confirmPasswordFocus}
                    onKeyDown={(e) => handleKeyDown(e, submitFocus)}
                    className={`form-control ${f.errors.confirmPassword && 'is-invalid'}`}
                    value={f.values.confirmPassword}
                    onChange={f.handleChange}
                  />
                  <div className="invalid-tooltip" id="signUp-errors">
                    {t(f.errors.confirmPassword)}
                  </div>
                  <Form.Label className="form-label" htmlFor="confirmPassword">
                    {t('signUpPage.confirmPassword')}
                  </Form.Label>
                </Form.Group>
                <br />
                <Button
                  type="submit"
                  ref={submitFocus}
                  onClick={() => usernameFocus.current.focus()}
                  className={`w-100 mb-3 mt-1 ${!network.isOnline || authError || serverError ? 'btn-danger' : 'btn-primary'}`}
                  disabled={f.isSubmitting || !network.isOnline}
                  id="signUp-button"
                >
                  {handleButtonText(authError, serverError, network)}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SignUpPage;
