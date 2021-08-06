import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import classes from './Footer.module.css';
import logo from '../../assets/img/logo-green.png';

function Footer() {
  return (
    <Fragment>
      <footer className={classes.footer}>
        <span className={classes.footer__logo}>
          <img src={logo} alt="footer_logo" />
        </span>
        <ul className={classes.footer__nav}>
          <li>
            <Link to="/">About Us</Link>
          </li>
          <li>
            <Link to="/">Download Apps</Link>
          </li>
          <li>
            <Link to="/">Become a Guide</Link>
          </li>
          <li>
            <Link to="/">Careers</Link>
          </li>
          <li>
            <Link to="/">Contact</Link>
          </li>
        </ul>
        <p className={classes.footer__copyright}>&copy; by Vasanth Kumar</p>
      </footer>
    </Fragment>
  );
}

export default Footer;
