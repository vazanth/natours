/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Fragment } from 'react';
import { useUserState } from '../../context/UserContext';
import classes from './Account.module.css';
import '../../App.css';
import icons from '../../assets/img/icons.svg';

const SideNav = () => {
  const { role } = useUserState();
  return (
    <Fragment>
      <nav className={classes.user__view__menu}>
        <ul className={classes.side__nav}>
          <li className={classes.side__nav__active}>
            <a href="#">
              <svg>
                <use xlinkHref={`${icons}#icon-settings`} />
              </svg>
              Settings
            </a>
          </li>
          <li>
            <a href="#">
              <svg>
                <use xlinkHref={`${icons}#icon-briefcase`} />
              </svg>
              My bookings
            </a>
          </li>
          <li>
            <a href="#">
              <svg>
                <use xlinkHref={`${icons}#icon-star`} />
              </svg>
              My reviews
            </a>
          </li>
          <li>
            <a href="#">
              <svg>
                <use xlinkHref={`${icons}#icon-credit-card`} />
              </svg>
              Billing
            </a>
          </li>
        </ul>
        {role === 'admin' ? (
          <div className={classes.admin__nav}>
            <h5 className={classes.admin__nav__heading}>Admin</h5>
            <ul className={classes.side__nav}>
              <li>
                <a href="#">
                  <svg>
                    <use xlinkHref={`${icons}#icon-map`} />
                  </svg>
                  Manage tours
                </a>
              </li>
              <li>
                <a href="#">
                  <svg>
                    <use xlinkHref={`${icons}#icon-users`} />
                  </svg>
                  Manage users
                </a>
              </li>
              <li>
                <a href="#">
                  <svg>
                    <use xlinkHref={`${icons}#icon-star`} />
                  </svg>
                  Manage reviews
                </a>
              </li>
              <li>
                <a href="#">
                  <svg>
                    <use xlinkHref={`${icons}#icon-briefcase`} />
                  </svg>
                  Manage Bookings
                </a>
              </li>
            </ul>
          </div>
        ) : null}
      </nav>
    </Fragment>
  );
};

export default SideNav;
