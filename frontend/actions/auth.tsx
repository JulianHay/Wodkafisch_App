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
  CHANGE_PASSWORD_TOKEN_SUCCESS,
} from "./types";
import client from "./client";
import { toast } from "react-toastify";
import { useNavigation } from "@react-navigation/native";
import { deleteFromLocal, saveToLocal } from "../components/localStorage";

export const checkAuthenticated = () => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await client.get("authenticated", config);

    if (res.data.error || res.data.isAuthenticated === "error") {
      dispatch({
        type: AUTHENTICATED_FAIL,
        payload: false,
      });
    } else if (res.data.isAuthenticated === "success") {
      dispatch({
        type: AUTHENTICATED_SUCCESS,
        payload: true,
      });
    } else {
      dispatch({
        type: AUTHENTICATED_FAIL,
        payload: false,
      });
    }
  } catch (err) {
    dispatch({
      type: AUTHENTICATED_FAIL,
      payload: false,
    });
  }
};

export const register = (success: boolean) => async (dispatch) => {
  if (success) {
    dispatch({
      type: REGISTER_FAIL,
    });
  } else {
    dispatch({
      type: REGISTER_SUCCESS,
    });
  }
};

export const logout = () => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await client.post("/logout", config);

    if (res.data.success) {
      dispatch({
        type: LOGOUT_SUCCESS,
      });
      localStorage.removeItem("token");
      deleteFromLocal("username");
    } else {
      dispatch({
        type: LOGOUT_FAIL,
      });
    }
  } catch (err) {
    dispatch({
      type: LOGOUT_FAIL,
    });
  }
};

export const delete_account = () => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({
    withCredentials: true,
  });

  try {
    const res = await client.delete("/delete", config, body);

    if (res.data.success) {
      dispatch({
        type: DELETE_USER_SUCCESS,
      });
    } else {
      dispatch({
        type: DELETE_USER_FAIL,
      });
    }
  } catch (err) {
    dispatch({
      type: DELETE_USER_FAIL,
    });
  }
};

export const login = (token) => async (dispatch) => {
  dispatch({
    type: LOGIN_SUCCESS,
    payload: token,
  });
};

export const fetchData = (url) => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await client.get(url, config);
    return res.data;
  } catch (err) {
    return {};
  }
};

export const setPasswordResetToken = (token) => async (dispatch) => {
  dispatch({
    type: CHANGE_PASSWORD_TOKEN_SUCCESS,
    payload: token,
  });
};

export const passwordReset = () => async (dispatch) => {
  dispatch({
    type: CHANGE_PASSWORD_SUCCESS,
  });
};
