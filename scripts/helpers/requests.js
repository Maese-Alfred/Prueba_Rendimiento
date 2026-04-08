import http from 'k6/http';

const BASE_URL = __ENV.BASE_URL || 'https://fakestoreapi.com';

export function makeLoginRequest(user) {
  const payload = JSON.stringify({
    username: user.user,
    password: user.passwd,
  });
  const params = {
    headers: { 'Content-Type': 'application/json' },
  };
  return http.post(`${BASE_URL}/auth/login`, payload, params);
}
