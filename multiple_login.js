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
const TOKEN = __ENV.TOKEN || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5NzQyOTk4MC0xYTMwLTRhZTctOGY3My0xYTA0MDU4OTRmMzQiLCJqdGkiOiJiY2EzZjJjODY3ZjllZWUxYWRhZjcwZWRmNDVkNmU0YjlmZWVmNDFmYjU3YTM1MGFkMGNlZDhhNWQ1ZTdiMmFmYTZiZTAyYzk4ODI3ZWQ5YiIsImlhdCI6MTc2Mjk0Mzg2MS44MzExMjUsIm5iZiI6MTc2Mjk0Mzg2MS44MzExMjgsImV4cCI6MTc2NDIzOTg2MS44MjIyOTcsInN1YiI6IjM1NTYzOSIsInNjb3BlcyI6W119.PHou1qpUjweGXizh8ad-6d8Zcw2RlbewLeAv6pMFvwTSkDS3kFQ0DdSXliNxSuGViKGm5spKO3iqRyEbuM9tTiZ36CextviBvmgW76MhQjjr_ZIR5QUIKL98D2YEA7WKbZmfMxY5tpnWMGkp9VFbpkg7Kb6s0s0X4V2MlFP5tZrtySNeCGpGaGCCiFuPkulYrjmZ00ZVS2X5qSGCsjPuzhYviV2s4ov0lGC2ZlgnS37Jqq08wup0hW4OCEEwqikj7sdN8CjBV-EWebxcNNf6eoJhbVOxFeFFcGWUKNkkxZCeDJmON9P4Tkgns6X-tzk2b0R5Y9U2M7J6YSuob4nF6Mc-mWgo_bupbXDyIYQ2eOeh4mMWBW4AJUGd2jGfPgsF3GgkdHpMB2GOxo_sxPFKou9mjQ2bj316IQSNWiEE88-lZIUo362PIhfhgbYp9w2zzXnkcW0dppX3DGgbRzrZ46kZ8LBukfdtJLNy_3K6yKZyMWtSAgRFgwRi4yzC3K6X7pHC4V_Pn5tlpt2j0kJpYkoSfq5J4E7tYwrNR_t1EyPxFVKgG7HUosN_grmHKVCrjWv3gkcr_Vu1qCF4q9bKiwGwycG2pi9u9AyK5wq82B9On_3xFa2R-OzpVaV5hJizAP_no3jVcI5m6MdNA33NdTbTaWQotnR7Fvpfdo8_1pU'; // để trống nếu lần gọi này là login

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
