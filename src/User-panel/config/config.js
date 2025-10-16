import axios from 'axios';

const Axios = axios.create({
  baseURL: 'https://development.culsight.com/api/learner/',
  withCredentials: true,
});

export default Axios;
