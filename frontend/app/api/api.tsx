import axios from 'axios'

const IP = process.env.IP

let base =  `http://${IP}:3000`

const api = axios.create({
    baseURL: base
})

export default api