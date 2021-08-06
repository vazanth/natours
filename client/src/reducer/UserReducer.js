import * as actionType from '../type';

const UserReducer = (state, action) => {
  switch (action.type) {
    case actionType.USER_INFO: {
      return {
        ...state,
        ...action.payload,
      };
    }
    default: {
      return state;
    }
  }
};

export default UserReducer;
