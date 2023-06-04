import { ConflictError, UnauthorizedError } from '../utils/http_errors';

export const fetchData = async (input: RequestInfo, init?: RequestInit) => {
  console.log('check', `${process.env.REACT_APP_API_URL}${input}`);
  const response = await fetch(`${process.env.REACT_APP_API_URL}${input}`, {
    method: 'GET',
    credentials: 'include',
    ...init,
  });
  if (response.ok) {
    return response;
  } else {
    const errorBody = await response.json();
    const errorMessage = errorBody.message;
    if (response.status === 401) {
      throw new UnauthorizedError(errorMessage);
    } else if (response.status === 409) {
      throw new ConflictError(errorMessage);
    } else {
      throw Error(
        `Request failed with status: ${response.status}, message: ${errorMessage}`
      );
    }
  }
};
