import axios from "axios";

export const baseURL = "https://mudeem-be-production.up.railway.app";
// export const baseURL = "http://localhost:8001/";
// export const baseURL = "https://api.mudeem.ae/";
// axios instance for json data

const custAxios = axios.create({
  withCredentials: true,
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
// axios instance for json data
export const formAxios = axios.create({
  withCredentials: true,
  baseURL: baseURL,
  headers: {
    "Content-Type": "multipart/form-data",
    Accept: "multipart/form-data",
  },
});

export default custAxios;
