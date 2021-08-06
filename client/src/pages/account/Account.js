import React, { Fragment } from 'react';
import SideNav from './SideNav';
import AccountSettings from './AccountSettings';
import PasswordChange from './PasswordChange';
import classes from './Account.module.css';
import '../../App.css';

const Account = () => (
  <Fragment>
    <main className={classes.main}>
      <div className={classes.user__view}>
        <SideNav />
        <div className={classes.user__view__content}>
          <AccountSettings />
          <div className={classes.line}>&nbsp;</div>
          <PasswordChange />
        </div>
      </div>
    </main>
  </Fragment>
);

export default Account;
