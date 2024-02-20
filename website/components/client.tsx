import axios from "axios";
// export const client = axios.create({ baseURL: "https://www.wodkafis.ch/app" });
export const client = axios.create({ baseURL: "http://127.0.0.1:8000/app" });

let store;
export const injectStore = (_store) => {
  store = _store;
};

client.interceptors.request.use(
  function (config) {
    const accessToken = store.getState().user.accessToken;
    if (accessToken) {
      config.headers["Authorization"] = "Token " + accessToken;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
