import axios from 'axios';
import { BASE__URL } from '../constants';

type authUserProps = {
  email: string;
  password: string;
};

type LoginResponse = {
  token: string;
};

type RegisterResponse = {
  message: string;
};

export const authUser = (data: authUserProps): Promise<LoginResponse> => {
  return axios
    .post(BASE__URL + '/auth/login', data, {
      headers: {
        'Content-Type': false,
      },
    })
    .then((res) => res.data);
};

export const registerUser = (
  data: authUserProps,
): Promise<RegisterResponse> => {
  return axios
    .post(BASE__URL + '/auth/register', data, {
      headers: {
        'Content-Type': false,
      },
    })
    .then((res) => res.data);
};

export const getCurrentUser = (token: string) => {
  return axios(BASE__URL + '/users/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.data);
};
