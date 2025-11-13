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

const URL = __ENV.URL || 'https://uat-endpoint.sgcarmart.com/api-ims/api/v1/vehicle-list?status=all&limit=20';
const TOKEN = __ENV.TOKEN || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5ZTJmMzM5MS1iNjBmLTRmYjMtOWZmZi0zZTdjY2ZjODJmZDQiLCJqdGkiOiI5ZWFlYzFiOTVmOTIxOTg3MTIwYmUwZTk4M2ExNmY1ZGM5ZjczOThjNjA5NWQ5ZDRmY2U1NjBlYzIzNGQ5MGNjNTk1ZDVlMDE5MDM3ZTBkZSIsImlhdCI6MTc2MzA0MzE0NC42ODEwNywibmJmIjoxNzYzMDQzMTQ0LjY4MTA3MywiZXhwIjoxNzYzMDUwMzQ0LjY0ODk5NCwic3ViIjoiMTA1MjgiLCJzY29wZXMiOltdfQ.eac-iJMYBmQcDXxxFfs3pghIwA8UaLUM6iiMQTI8rerDM92p1SpHylsJEWm_VIKrkTz6IaL9X5NjqjLV0US40CHNSpLKMwzhuov7ZzHd5m6sTL1xkBFCLklJRXlpOPoRf2uWD8g_6FTLPUIURaxtu6kvwUxtQww7VX51hpCL4I4A8lBjpUQNVmILjcE5xymK4WxMQfM0qovngWETgRmxrR0BoRgXn6gdkCa1603ZvZbW0HwRyI4zPkRoRx22mKPO8mYWWMD_-XhW1gBrIhsj3l1r6TXHD5WB-A10eeKsq0uLbdh9GuC5P0ovEAcRBL_0e58XAu1V_1rOQ2vCt39cu6g42HarjQGPN5BPZuX4rPJrSCmvBuBYnp6XirC5dLp6ASRj2rOGOjhFDGlBH76h50xhvRwtA5ZrUYhsDKm2RfoOsxnIYUy1NsLMFbSr9a0dxBo4N0mnzVHHr8O4WOFTgLgbbiDjoljOHG3owUtyr5_RWllT3W01wLCxlRDc9Y3D58JmLg1uH6DGvoY5YnP-JqNC6gsAaUurV0-a46SWjJ9tvo5MRJxmVgh4ukmGtj_ocT4iALRzX4UIW3bl-380tV1alyDV3ZAFEJSNNP8wzOZItIqL8tP7SPCrKCEEiiEXd1pSo_f6zXfx9MG_XZjHKKK2f6BRp9CkSpVHNNhvz2g';

export default function () {
    const params = {
        headers: {
            'Authorization': `Bearer ${TOKEN}`,
            // 'Accept': 'application/json',
            // 'User-Agent': 'k6/0.40.0',
        },
        timeout: '60s',
    };

    const res = http.get(URL, params);

    const checks = check(res, {
        'status is 200': (r) => r.status === 200,
    });

    if (res.status === 200) {
        try {
            const body = res.json();
            const count = Array.isArray(body.data)
                ? body.data.length
                : (body.data && body.data.items ? body.data.items.length : 'n/a');

            console.log(`INFO: status=200, items=${count}`);
            console.log(`INFO: body=${JSON.stringify(body).slice(0, 2000)}`);
        } catch (e) {
            console.log(`INFO: status=200, but failed to parse JSON: ${e.message}`);
        }
    } else {
        console.error(`ERROR: status=${res.status}, body=${res.body ? res.body.slice(0,2000) : 'no body'}`);
    }

    sleep(1);
}
