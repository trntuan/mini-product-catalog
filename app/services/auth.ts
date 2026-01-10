import { post, routes } from './http';

export const login = (body: any) => {
  return post(`${routes.login}`, {body});
};
