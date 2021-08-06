import React, { useContext, createContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import UserReducer from '../reducer/UserReducer';

const initialState = { userName: '', photo: '', role: '', userEmail: '' };

const UserStateContext = createContext({ ...initialState });
const UserDispatchContext = createContext(undefined);

const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(UserReducer, initialState);
  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
};

function useUserState() {
  const context = useContext(UserStateContext);
  if (context === undefined) {
    throw new Error('useUserState must be used within a UserProvider');
  }
  return context;
}

function useUserDispatch() {
  const context = useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error('useUserState must be used within a UserProvider');
  }
  return context;
}

UserProvider.propTypes = {
  children: PropTypes.node,
};

UserProvider.defaultProps = {
  children: '',
};

export { UserProvider, useUserState, useUserDispatch };
