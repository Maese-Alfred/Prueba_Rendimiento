import { check } from 'k6';

export function checkLoginResponse(res) {
  check(res, {
    'status es 201': (r) => r.status === 201,
    'respuesta contiene token': (r) => r.json('token') !== undefined,
  });
}
