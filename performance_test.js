import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 1000,       // Jumlah Virtual Users (VUs)
  duration: '30s', // Durasi pengujian
  iterations: 3500, // Jumlah iterasi
  thresholds: {
    // Batas toleransi response time
    http_req_duration: ['p(95)<2000'], // 95% dari respons harus di bawah 2000 ms (2 detik)
  },
};

export default function () {
  // Uji operasi insert (POST)
  let insertPayload = JSON.stringify({
    name: 'user_' + __VU,
    job: 'developer',
  });
  let insertResponse = http.post('http://localhost:3000/api/users', insertPayload, {
    headers: { 'Content-Type': 'application/json' },
  });

  check(insertResponse, {
    'Insert status is 201': (r) => r.status === 201,
  });

  sleep(1); // Tunggu 1 detik sebelum melakukan uji update

  // Ambil ID hasil insert untuk operasi update
  let userId = JSON.parse(insertResponse.body).id;

  // Uji operasi update (PUT)
  let updatePayload = JSON.stringify({
    name: 'rianti_update',
    job: 'developer',
  });
  let updateResponse = http.put(`http://localhost:3000/api/users/${userId}`, updatePayload, {
    headers: { 'Content-Type': 'application/json' },
  });

  check(updateResponse, {
    'Update status is 200': (r) => r.status === 200,
  });

  sleep(1); // Tunggu 1 detik sebelum melakukan uji berikutnya
}