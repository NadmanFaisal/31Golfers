import axios from "axios";
import { ngrok_IP_LINK, IP_LINK } from "./.constants";

let base = `${ngrok_IP_LINK}`;

const api = axios.create({
  baseURL: base,
});

export default api;
