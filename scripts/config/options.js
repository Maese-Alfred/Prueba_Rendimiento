export const options = {
  scenarios: {
    login_load: {
      executor: 'ramping-arrival-rate', 
      startRate: 20,                    
      timeUnit: '1s',
      preAllocatedVUs: 40,              
      maxVUs: 50,                      
      stages: [
        { duration: '1m',  target: 20 }, 
        { duration: '3m',  target: 20 }, 
        { duration: '30s', target: 20 }, 
      ],
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<1500'],
    http_req_failed: ['rate<0.03'],
    http_reqs: ['rate>=20'],
  },
};