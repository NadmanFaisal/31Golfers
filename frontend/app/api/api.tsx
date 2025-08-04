import axios from "axios";
import { IP } from "./.constants";

let base = `http://${IP}:3000`;

const api = axios.create({
  baseURL: base,
});

export default api;
