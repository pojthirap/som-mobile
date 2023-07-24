export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_ERROR = 'LOGIN_ERROR';
export const LOGIN_REQUEST = 'LOGIN_REQUEST';

export const VERIFY_REQUEST = 'VERIFY_REQUEST';
export const VERIFY_SUCCESS = 'VERIFY_SUCCESS';
export const FORGET_SUCCESS = 'FORGET_SUCCESS';
export const FORGET_FAILED = 'FORGET_FAILED';

const LOGOUT_SUCCESS = 'LOGIN_REQUEST';
const LOGOUT_ERROR = 'LOGOUT_ERROR';
const LOGIN_LOADING = 'LOGIN_LOADING';
const LOGIN_RESET = 'LOGIN_RESET';
const SET_USER = 'SET_USER';

const initialState = {
  isLoading: false,
  loginError: false,
  loginErrorMSG: null,
  loginSuccess: false,
  isVerifying: false,
  isLoggingIn: false,
  isLoggingOut: false,
  logutError: false,
  isForgetSuccess: false,
  isForgetCallback: false,
  forgetErrorMSG: null,
  token: '',
  restoreTokenSuccess: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        loginSuccess: true,
        isLoggingIn: true,
        loginError: false,
        token: action.payload.token,
        userProfile: action.payload.userProfileForBackEndCustom
      };
    case 'RESTORE_TOKEN': 
      return {
        ...state,
        isLoading: false,
        loginSuccess: true,
        isLoggingIn: true,
        loginError: false,
        token: action.payload,
        restoreTokenSuccess: true
      };
    case LOGIN_ERROR:
      return {
        ...state,
        isLoading: false,
        loginSuccess: false,
        isLoggingIn: false,
        loginError: true,
        loginErrorMSG: action.payload,
      };
    case LOGIN_RESET:
      return {
        ...state,
        isLoading: false,
        loginSuccess: false,
        isLoggingIn: false,
        loginError: false,
        token: '',
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        isLoggingOut: true,
        logutError: false,
      };
    case LOGOUT_ERROR:
      return {
        ...state,
        isLoggingOut: false,
      };
    case FORGET_SUCCESS:
      return {
        ...state,
        isForgetSuccess: true,
        isForgetCallback: true,
        isLoading: false,
      };
    case FORGET_FAILED:
      return {
        ...state,
        isLoading: false,
        isForgetCallback: true,
        isForgetSuccess: false,
        forgetErrorMSG: action.payload,
      };
    case SET_USER:
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};
