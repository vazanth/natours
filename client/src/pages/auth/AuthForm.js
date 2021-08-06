/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-nested-ternary */
import React, { Fragment, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { showAlert } from '../../utils/Alert';
import classes from './Auth.module.css';
import '../../App.css';
import * as actionType from '../../type';
import { useUserDispatch } from '../../context/UserContext';
import api from '../../config/api';
import apiConfig from '../../config/apiConfig';

const AuthForm = () => {
  const history = useHistory();
  //dispatch hook
  const dispatch = useUserDispatch();
  const [fields, setFields] = useState({
    name: '',
    email: '',
    password: '',
    confirmpassword: '',
    token: '',
  });

  const successHandler = (data, message) => {
    showAlert('success', message);
    dispatch({
      type: actionType.USER_INFO,
      payload: {
        userName: data.data.user.name,
        photo: data.data.user.photo,
        role: data.data.user.role,
        userEmail: data.data.user.email,
      },
    });
    sessionStorage.setItem('accessToken', data.token);
    history.push('/tour');
  };

  const authHandler = async () => {
    const signupConfig = {
      name: fields.name,
      email: fields.email,
      password: fields.password,
      confirmPassword: fields.confirmpassword,
    };
    const loginConfig = {
      email: fields.email,
      password: fields.password,
    };
    const verifyConfig = {
      token: fields.token,
    };
    try {
      if (history.location.pathname === '/login') {
        const { data } = await api.post(apiConfig.login, loginConfig, {
          handlerEnabled: false,
        });
        successHandler(data, 'Logged in successfully!');
      } else if (history.location.pathname === '/signup') {
        const { data } = await api.post(apiConfig.signup, signupConfig, {
          handlerEnabled: false,
        });
        showAlert('success', data.message);
        history.push('/verify');
      } else if (history.location.pathname === '/verify') {
        const { data } = await api.post(apiConfig.confirmUser, verifyConfig, {
          handlerEnabled: false,
        });
        successHandler(data, 'Sucessfully Verified the account');
      }
    } catch (err) {
      showAlert('error', err.response.data.message);
    }
  };

  const resendToken = async () => {
    try {
      const { data } = await api.post(
        apiConfig.resendConfirmation,
        { email: fields.email },
        {
          handlerEnabled: false,
        },
      );
      showAlert('success', data.message);
    } catch (err) {
      showAlert('error', err.response.data.message);
    }
  };

  const textFieldHandler = (e, field) => {
    const { value } = e.target;
    setFields((prevState) => ({ ...prevState, [field]: value }));
  };

  const renderForm = () => {
    if (history.location.pathname === '/login') {
      return (
        <Fragment>
          <div className={classes.form__group}>
            <label className={classes.form__label} htmlFor="email">
              Email address
            </label>
            <input
              className={classes.form__input}
              id="email"
              placeholder="you@example.com"
              required="required"
              type="email"
              onChange={(e) => textFieldHandler(e, 'email')}
            />
          </div>
          <div className="form__group ma-bt-md">
            <label className={classes.form__label} htmlFor="password">
              Password
            </label>
            <input
              className={classes.form__input}
              id="password"
              placeholder="••••••••"
              required="required"
              type="password"
              onChange={(e) => textFieldHandler(e, 'password')}
            />
          </div>
        </Fragment>
      );
    }
    if (history.location.pathname === '/verify') {
      return (
        <div className={classes.form__group}>
          <label className={classes.form__label} htmlFor="token">
            Verification Token
          </label>
          <input
            className={classes.form__input}
            id="token"
            placeholder=""
            required="required"
            type="password"
            onChange={(e) => textFieldHandler(e, 'token')}
          />
          <span style={{ fontSize: '1.2rem' }}>
            If Token not received click
            <span
              style={{
                textDecoration: 'underline',
                cursor: 'pointer',
                color: 'blue',
              }}
              onClick={resendToken}
            >
              here
            </span>
          </span>
        </div>
      );
    }
    return (
      <Fragment>
        <div className={classes.form__group}>
          <label className={classes.form__label} htmlFor="name">
            Your Name
          </label>
          <input
            className={classes.form__input}
            id="name"
            placeholder=""
            required="required"
            type="text"
            onChange={(e) => textFieldHandler(e, 'name')}
          />
        </div>
        <div className={classes.form__group}>
          <label className={classes.form__label} htmlFor="email">
            Email address
          </label>
          <input
            className={classes.form__input}
            id="email"
            placeholder="you@example.com"
            required="required"
            type="email"
            onChange={(e) => textFieldHandler(e, 'email')}
          />
        </div>
        <div className="form__group ma-bt-md">
          <label className={classes.form__label} htmlFor="password">
            Password
          </label>
          <input
            className={classes.form__input}
            id="password"
            placeholder="••••••••"
            required="required"
            type="password"
            onChange={(e) => textFieldHandler(e, 'password')}
          />
        </div>
        <div className="form__group ma-bt-md">
          <label className={classes.form__label} htmlFor="confirmpassword">
            Confirm Password
          </label>
          <input
            className={classes.form__input}
            id="confirmpassword"
            placeholder="••••••••"
            required="required"
            type="password"
            onChange={(e) => textFieldHandler(e, 'confirmpassword')}
          />
        </div>
      </Fragment>
    );
  };
  return (
    <Fragment>
      <main className={classes.main}>
        <div className={classes.login__form}>
          <h2 className={`${classes.heading__secondary} ma-bt-lg`}>
            {history.location.pathname === '/login'
              ? `Log into your account`
              : history.location.pathname === '/verify'
              ? `Verify Your Account!`
              : `Create Your Account!`}
          </h2>
          <form className={classes.form}>
            {renderForm()}
            <div className={classes.form__group}>
              <button
                type="button"
                className="btn btn--green"
                onClick={authHandler}
              >
                {history.location.pathname === '/login'
                  ? `Login`
                  : history.location.pathname === '/verify'
                  ? `Verify`
                  : `Sign Up`}
              </button>
            </div>
          </form>
        </div>
      </main>
    </Fragment>
  );
};

export default AuthForm;
