import Axios from 'axios';

export const getFruitList = async () => {
  const { data } = await Axios.get('/justTest/getFruitList');
  if (data.code === 0) {
    return data.data;
  }
  return [];
};
