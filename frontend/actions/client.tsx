import axios from "axios";
import store from "../store";
// const client = axios.create({baseURL: "http://127.0.0.1:8000/app"})

const client = axios.create({baseURL: "https://wodkafis.ch/app"})

client.interceptors.request.use(
    function(config) {
      const token = store.getState().auth.token;
      if (token) {
        config.headers["Authorization"] = 'Token ' + token;
      }
      return config;
    },
    function(error) {
      return Promise.reject(error);
    }
  );

export default client