import axios from "axios";
import { IP_LINK } from "./.constants";

let base = `${IP_LINK}`;

const api = axios.create({
  baseURL: base,
});

export default api;
