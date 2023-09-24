import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    LOGOUT_FAIL,
    AUTHENTICATED_SUCCESS,
    AUTHENTICATED_FAIL,
    DELETE_USER_SUCCESS,
    DELETE_USER_FAIL,
    CHANGE_PASSWORD_FAIL,
    CHANGE_PASSWORD_SUCCESS,
    CHANGE_PASSWORD_TOKEN_FAIL,
    CHANGE_PASSWORD_TOKEN_SUCCESS
} from '../actions/types';

const initialState = {
    isAuthenticated: null,
    token: null,
    passwordResetToken: null
};

export default function(state = initialState, action) {
    const { type, payload } = action;

    switch(type) {
        case AUTHENTICATED_SUCCESS:
        case AUTHENTICATED_FAIL:
            return {
                ...state,
                isAuthenticated: payload
            }
        case REGISTER_SUCCESS:
            return {
                ...state,
                isAuthenticated: false
            }
        case LOGIN_SUCCESS:
            return {
                ...state,
                isAuthenticated: true,
                token: payload
            }
        case LOGOUT_SUCCESS:
        case DELETE_USER_SUCCESS:
            return {
                ...state,
                isAuthenticated: false,
                token: null
            }
        case CHANGE_PASSWORD_TOKEN_SUCCESS:
            return {
                ...state,
                passwordResetToken: payload
            }
        case CHANGE_PASSWORD_SUCCESS:
            return {
                ...state,
                passwordResetToken: null
            }
        case REGISTER_FAIL:
        case CHANGE_PASSWORD_TOKEN_FAIL:
        case CHANGE_PASSWORD_FAIL:
        case LOGIN_FAIL:
        case LOGOUT_FAIL:
        case DELETE_USER_FAIL:
            return state
        default:
            return state
    };
};
