import { sleep, group } from 'k6';
import { SharedArray } from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/2.4.0/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';
import { options } from './config/options.js';
import { makeLoginRequest } from './helpers/requests.js';
import { checkLoginResponse } from './checks/responses.js';

export { options };

export function handleSummary(data) {
  return {
    'docs/output/login-load-test-report.html': htmlReport(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}

const csvData = new SharedArray('users', function () {
  return papaparse.parse(open('./data/users.csv'), { header: true }).data;
});

export default function () {
  const user = csvData[Math.floor(Math.random() * csvData.length)];

  group('Login User', function () {
    const res = makeLoginRequest(user);
    checkLoginResponse(res);
  });

  sleep(1);
}
