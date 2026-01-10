import apiClient from './api-client';
const BASE_URL = 'https://dummyjson.com';

const contentTypes: any = {
  json: 'application/json',
  mfd: 'multipart/form-data',
};

// Base function for GET requests
export const get = (route: string) => {
  return apiClient(`${BASE_URL}/${route}`);
};

// Base function for POST requests
export const post = async (
  route: string,
  {body, type = '', user = {}}: {body: any; type?: string; user?: any},
) => {
  let headers: any = {Accept: 'application/json'};
  if (user.token) {
    headers.Authorization = `Bearer ${user.token}`;
  }
  if (type !== '') {
    headers['Content-Type'] = contentTypes[type];
  }
  return apiClient({
    method: 'post',
    url: `${BASE_URL}/${route}`,
    headers,
    data: body,
  });
};

// Routes
export const routes = {
  login: 'user/login',
  getNews: 'news',
};
