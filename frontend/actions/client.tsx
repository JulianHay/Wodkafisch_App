import axios from "axios";

const client = axios.create({baseURL: "http://127.0.0.1:8000/app"})
client.interceptors.request.use(
    function(config) {
      const token = localStorage.getItem("token"); 
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