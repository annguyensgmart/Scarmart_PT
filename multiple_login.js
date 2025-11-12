import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '1m', target: 4000 },
        { duration: '1m', target: 4200 },
        { duration: '1m', target: 4400 },
        { duration: '1m', target: 4600 },
        { duration: '1m', target: 4800 },
        { duration: '3m', target: 5000 },
        { duration: '3m', target: 5500 },
    ],
};

export default function () {
    const url = 'http://sgcm-uat-api-ims-v3.azurewebsites.net/api/v1/remote-login';

    const payload = JSON.stringify({
        username: 'kaushalya.perera@sgcarmart.com',
        login_from: 'web',
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const res = http.post(url, payload, params);

    check(res, {
        'status is 200': (r) => r.status === 200
    });
    sleep(1);
}
