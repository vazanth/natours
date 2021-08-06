/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Fragment, useState } from 'react';
import { showAlert } from '../../utils/Alert';
import { useUserState, useUserDispatch } from '../../context/UserContext';
import * as actionType from '../../type';
import api from '../../config/api';
import apiConfig from '../../config/apiConfig';
import classes from './Account.module.css';
import '../../App.css';

const AccountSettings = () => {
  const { userName, photo, userEmail } = useUserState();
  const dispatch = useUserDispatch();
  const [fields, setFields] = useState({
    name: userName,
    email: userEmail,
    userPhoto: photo,
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
  };

  const saveHandler = async () => {
    const updateDataConfig = {
      name: fields.name,
      email: fields.email,
    };
    try {
      const { data } = await api.patch(apiConfig.updateUser, updateDataConfig, {
        handlerEnabled: true,
      });
      successHandler(data, 'Updated successfully!');
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
        <h2 className="heading-secondary ma-bt-md">Your account settings</h2>
        <form className="form form-user-data">
          <div className="form__group">
            <label className="form__label" htmlFor="name">
              Name
            </label>
            <input
              className="form__input"
              id="name"
              required="required"
              type="text"
              value={fields.name}
              onChange={(e) => textFieldHandler(e, 'name')}
            />
          </div>
          <div className="form__group ma-bt-md">
            <label className="form__label" htmlFor="email">
              Email address
            </label>
            <input
              className="form__input"
              id="email"
              required="required"
              type="email"
              value={fields.email}
              onChange={(e) => textFieldHandler(e, 'email')}
            />
          </div>
          <div className="form__group form__photo-upload">
            <img
              alt="User"
              className="form__user-photo"
              src={`${process.env.PUBLIC_URL}/users/${fields.userPhoto}`}
            />
            <a className="btn-text" href="">
              Choose new photo
            </a>
          </div>
          <div className="form__group right">
            <button
              className="btn btn--small btn--green"
              type="button"
              onClick={saveHandler}
            >
              Save settings
            </button>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default AccountSettings;
