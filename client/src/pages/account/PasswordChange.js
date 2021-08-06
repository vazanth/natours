import React, { Fragment, useState } from 'react';
import { showAlert } from '../../utils/Alert';
import api from '../../config/api';
import apiConfig from '../../config/apiConfig';
import classes from './Account.module.css';
import '../../App.css';

const PasswordChange = () => {
  const [fields, setFields] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const saveHandler = async () => {
    const { currentPassword, newPassword, confirmPassword } = fields;
    const updateDataConfig = {
      currentPassword,
      newPassword,
      confirmPassword,
    };
    try {
      await api.patch(apiConfig.changePassword, updateDataConfig, {
        handlerEnabled: true,
      });
      showAlert('success', 'Passwword updated succesfully');
    } catch (err) {
      showAlert('error', err.response.data.message);
    }
  };

  const textFieldHandler = (e, field) => {
    const { value } = e.target;
    setFields((prevState) => ({ ...prevState, [field]: value }));
  };
  return (
    <Fragment>
      <div className={classes.user__view__form__container}>
        <h2 className="heading-secondary ma-bt-md">Password change</h2>
        <form className="form form-user-settings">
          <div className="form__group">
            <label className="form__label" htmlFor="password-current">
              Current password
            </label>
            <input
              className="form__input"
              id="password-current"
              minLength="8"
              placeholder="••••••••"
              required="required"
              type="password"
              value={fields.currentPassword}
              onChange={(e) => textFieldHandler(e, 'currentPassword')}
            />
          </div>
          <div className="form__group">
            <label className="form__label" htmlFor="password">
              New password
            </label>
            <input
              className="form__input"
              id="password"
              minLength="8"
              placeholder="••••••••"
              required="required"
              type="password"
              value={fields.newPassword}
              onChange={(e) => textFieldHandler(e, 'newPassword')}
            />
          </div>
          <div className="form__group ma-bt-lg">
            <label className="form__label" htmlFor="password-confirm">
              Confirm password
            </label>
            <input
              className="form__input"
              id="password-confirm"
              minLength="8"
              placeholder="••••••••"
              required="required"
              type="password"
              value={fields.confirmPassword}
              onChange={(e) => textFieldHandler(e, 'confirmPassword')}
            />
          </div>
          <div className="form__group right">
            <button
              className="btn btn--small btn--green"
              type="button"
              onClick={saveHandler}
            >
              Save password
            </button>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default PasswordChange;
