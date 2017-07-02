import axios from 'axios';

export default {
  async get(url, params) {
    const response = await axios.get(url, { params });

    return response.data;
  },
};
