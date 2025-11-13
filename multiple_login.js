import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '2m', target: 4000 },
        { duration: '3m', target: 4200 },
        { duration: '3m', target: 4400 },
        { duration: '3m', target: 5000 },
    ],
    thresholds: {
        'http_req_duration': ['p(95)<500'],
        'checks': ['rate>0.99'],
    },
};

const URL = __ENV.URL || 'https://uat-endpoint.sgcarmart.com/api-ims/api/v1/login';
const USER = __ENV.USERNAME || 'sinh.dang@sgcarmart.com';
const PASS = __ENV.PASSWORD || 'Test1234';
const TOKEN = __ENV.TOKEN || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5NzQyOTk4MC0xYTMwLTRhZTctOGY3My0xYTA0MDU4OTRmMzQiLCJqdGkiOiI0M2E4OWI2YzY1MDMxMTRlYzIwZTQwNmQ1OTVmYjNkZjNlZjIwMzhhYzFhNDRkY2RkNTVhMDdhNmJmMTlmZWM5MWE4Mzg5YmY2ZGQxNWU2OCIsImlhdCI6MTc2MzA0MzAxMi4zNzgxNzEsIm5iZiI6MTc2MzA0MzAxMi4zNzgxNzUsImV4cCI6MTc2NDMzOTAxMi4zNDgwNDMsInN1YiI6IjM1NTYzOSIsInNjb3BlcyI6W119.QWyPOSD2QnBcHh5RVVFSrNy96fbKFNVovNq52hQbAtEjIncHE7TS9tV7ZQMkGdfVbze9PofEl6K8aS2kYMUMJOqRD3wFaU-dzfJMS6PDqdFKKy1YcJ4mLNNNavUKTfwoLgOZOiN9i3cQWgJ3R8QzW0UO17p12mU_fdWbEZqVMew901Ht1PQGD1T6dALCADrlLzQMFiG5BW3woS71l_evplQC5REI3KrL1U7ohg1cb06B9nQ8hvv2qVS9oE5dqLeO0cex1YDczHjS7KMHg-8CuaYh57BG6dmBytw6MljzDk-U9U7XHXsfzux-ZoxOkEEEz_LTseHgYglPpuP5MA1GRbXQebu3Rtf6_hAuLItZS9oaQ1MkQfCVhEbRVMouMvYAhyUsciGKh8WeCBC0zsgtilhL8lfCaEmTHqY3Nogt4PJxYHCXlwz6HeLPaL6sO3KahHOzwQmB8oimS-o9vOPUR-HGQoa7Nf3iWcirPZ2hXYYr6x9y3EN03XAP0NH-M__rh3T_69cZMeoKE_9IxJ87eXqOo2k-n8qaYiRDgmofquUc8URbTptO2l4hYIuV8rCS-fPm1_TD5WASlDU5ItpsmyYUGUniMqIqyhKIWgIEFPyaF4Q6go623a34H-OKSyGQMo3PNweduy5iLHMqrIvDB94cKGxIvDjbZSLz4iBGDqw';

export default function () {
    const payload = JSON.stringify({ email: USER, password: PASS });

    const headers = { 'Content-Type': 'application/json' };
    if (TOKEN) {
        headers['Authorization'] = `Bearer ${TOKEN}`;
    }

    const params = {
        headers: headers,
        timeout: '60s',
    };

    const res = http.post(URL, payload, params);

    const checks = check(res, {
        'status is 200': (r) => r.status === 200,
        'has token in body': (r) => {
            try {
                return !!r.json('access_token');
            } catch (e) {
                return false;
            }
        },
    });

    if (res.status === 200) {
        try {
            const body = res.json();
            console.log(`INFO: status=200, body=${JSON.stringify(body).slice(0, 2000)}`);
        } catch (e) {
            console.log(`INFO: status=200, but failed to parse JSON: ${e.message}`);
        }
    } else {
        console.error(`ERROR: status=${res.status}, body=${res.body ? res.body.slice(0,2000) : 'no body'}`);
    }

    sleep(1);
}
