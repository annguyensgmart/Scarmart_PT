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

const URL = __ENV.URL || 'https://uat-endpoint.sgcarmart.com/api-ims/api/v1/vehicle-add';
const TOKEN = __ENV.TOKEN || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5ZTJmMzM5MS1iNjBmLTRmYjMtOWZmZi0zZTdjY2ZjODJmZDQiLCJqdGkiOiI5ZWFlYzFiOTVmOTIxOTg3MTIwYmUwZTk4M2ExNmY1ZGM5ZjczOThjNjA5NWQ5ZDRmY2U1NjBlYzIzNGQ5MGNjNTk1ZDVlMDE5MDM3ZTBkZSIsImlhdCI6MTc2MzA0MzE0NC42ODEwNywibmJmIjoxNzYzMDQzMTQ0LjY4MTA3MywiZXhwIjoxNzYzMDUwMzQ0LjY0ODk5NCwic3ViIjoiMTA1MjgiLCJzY29wZXMiOltdfQ.eac-iJMYBmQcDXxxFfs3pghIwA8UaLUM6iiMQTI8rerDM92p1SpHylsJEWm_VIKrkTz6IaL9X5NjqjLV0US40CHNSpLKMwzhuov7ZzHd5m6sTL1xkBFCLklJRXlpOPoRf2uWD8g_6FTLPUIURaxtu6kvwUxtQww7VX51hpCL4I4A8lBjpUQNVmILjcE5xymK4WxMQfM0qovngWETgRmxrR0BoRgXn6gdkCa1603ZvZbW0HwRyI4zPkRoRx22mKPO8mYWWMD_-XhW1gBrIhsj3l1r6TXHD5WB-A10eeKsq0uLbdh9GuC5P0ovEAcRBL_0e58XAu1V_1rOQ2vCt39cu6g42HarjQGPN5BPZuX4rPJrSCmvBuBYnp6XirC5dLp6ASRj2rOGOjhFDGlBH76h50xhvRwtA5ZrUYhsDKm2RfoOsxnIYUy1NsLMFbSr9a0dxBo4N0mnzVHHr8O4WOFTgLgbbiDjoljOHG3owUtyr5_RWllT3W01wLCxlRDc9Y3D58JmLg1uH6DGvoY5YnP-JqNC6gsAaUurV0-a46SWjJ9tvo5MRJxmVgh4ukmGtj_ocT4iALRzX4UIW3bl-380tV1alyDV3ZAFEJSNNP8wzOZItIqL8tP7SPCrKCEEiiEXd1pSo_f6zXfx9MG_XZjHKKK2f6BRp9CkSpVHNNhvz2g';


export default function () {
    const payloadObj = {
        adtype: 'p',
        starad: '0',
        spotlight: '0',
        carplate: 'SMU' + randNatural(),
        first_regDate: '2022-09-09',
        regDate: '2024-09-09',
        engCap: '233',
        omv: '123',
        arf: '333',
        coe: '123',
        coeDate: '2024-09-09',
        owners: '2',
        type: 'Sports',
        carmodel: 'toyota sienta testing',
        opc: '0',
        price: '20000',
        trans: 'Auto',
        fuel: '',
        dieselType: '',
        mileage: '',
        features: '',
        accessories: '',
        description: '',
        inspection: '0',
        inspection_tnc: '1',
        'person[0]': 'teckennn',
        'telno[0]': '88879891',
        'person[1]': 'yong',
        'telno[1]': '81234567',
        ip_address: '192.168.1.1',
        access_code: '123456',
        easy_mode: '0',
    };

    const body = Object.keys(payloadObj)
        .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(payloadObj[k])}`)
        .join('&');

    const params = {
        headers: {
            'Authorization': TOKEN ? `Bearer ${TOKEN}` : '',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            'User-Agent': 'k6/0.40.0',
        },
        timeout: '60s',
    };

    const res = http.post(URL, body, params);

    check(res, {
        'status is 200': (r) => r.status === 200,
    });

    if (res.status === 200) {
        try {
            const respBody = res.json();
            console.log(`INFO: status=200, body=${JSON.stringify(respBody).slice(0, 2000)}`);
        } catch (e) {
            console.log(`INFO: status=200, but failed to parse JSON: ${e.message}`);
        }
    } else {
        console.error(`ERROR: status=${res.status}, body=${res.body ? res.body.slice(0,2000) : 'no body'}`);
    }

    sleep(1);
}

export function randNatural() {
    return Math.floor(Math.random() * 999999) + 1;
}
