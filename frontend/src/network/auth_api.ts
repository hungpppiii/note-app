import { fetchData } from './fetchData';
import { User } from '../models/users';

export interface signUpCredentials {
  username: string;
  email: string;
  password: string;
}

export interface signInCredentials {
  username: string;
  password: string;
}

export const getAuthenticatedUser = async (): Promise<User> => {
  const response = await fetchData('/api/auth');
  const responseData = await response.json();
  return responseData.data;
};

export const signIn = async (data: signInCredentials): Promise<User> => {
  const response = await fetchData('/api/auth/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const responseData = await response.json();
  return responseData.data;
};

export const signUp = async (data: signUpCredentials): Promise<User> => {
  const response = await fetchData('/api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const responseData = await response.json();
  return responseData.data;
};

export const logout = async () => {
  await fetchData('/api/auth/logout', { method: 'POST' });
};
