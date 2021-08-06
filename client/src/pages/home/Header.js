import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useUserState, useUserDispatch } from '../../context/UserContext';
import * as actionType from '../../type';
import classes from './Header.module.css';
import logo from '../../assets/img/logo-white.png';

function Header() {
  const dispatch = useUserDispatch();
  const { userName, photo } = useUserState();

  const handleLogout = () => {
    sessionStorage.clear();
    dispatch({
      type: actionType.USER_INFO,
      payload: {
        userName: '',
        photo: '',
        role: '',
      },
    });
  };

  return (
    <Fragment>
      <header className={classes.header}>
        <nav className={`${classes.nav} ${classes.nav__tours}`}>
          <Link to="/" className={classes.nav__el}>
            All tours
          </Link>
        </nav>
        <span className={classes.header__logo}>
          <img src={logo} alt="natours_logo" />
        </span>
        <nav className={`${classes.nav} ${classes.nav__user}`}>
          {userName ? (
            <Fragment>
              <button
                type="button"
                onClick={handleLogout}
                className={`${classes.nav__el} ${classes.nav__el__cta}`}
              >
                Log Out
              </button>
              <Link to="/account" className={classes.nav__el}>
                <img
                  src={`${process.env.PUBLIC_URL}/users/${photo}`}
                  className={classes.nav__user__img}
                  alt="user"
                />
                <span>{userName}</span>
              </Link>
            </Fragment>
          ) : (
            <Fragment>
              <Link to="/login" className={classes.nav__el}>
                Log in
              </Link>
              <Link
                to="/signup"
                className={`${classes.nav__el} ${classes.nav__el__cta}`}
              >
                Sign up
              </Link>
            </Fragment>
          )}
        </nav>
      </header>
    </Fragment>
  );
}

export default Header;
