import api from '../api';

type AuthUserProps = {
  email: string;
  password: string;
};

type LoginResponse = {
  token: string;
};

type RegisterResponse = {
  message: string;
};

export const authUser = async (data: AuthUserProps): Promise<LoginResponse> => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

export const registerUser = async (
  data: AuthUserProps,
): Promise<RegisterResponse> => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const getCurrentUser = async (token: string) => {
  const response = await api.get('/users/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
