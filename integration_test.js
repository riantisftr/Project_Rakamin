import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 10,       // Jumlah Virtual Users (VUs)
  duration: '30s', // Durasi pengujian
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
    name: 'rianti_s',
    job: 'senior developer',
  });
  let updateResponse = http.put(`http://localhost:3000/api/users/${userId}`, updatePayload, {
    headers: { 'Content-Type': 'application/json' },
  });

  check(updateResponse, {
    'Update status is 200': (r) => r.status === 200,
  });

  sleep(1); // Tunggu 1 detik sebelum melakukan uji GET untuk memastikan data terupdate

  // Uji GET data untuk memastikan data terupdate setelah operasi update
  let getResponse = http.get(`http://localhost:3000/api/users/${userId}`);
  check(getResponse, {
    'Get status is 200': (r) => r.status === 200,
    'Updated name is reflected in response': (r) => JSON.parse(r.body).name === 'rianti_s',
  });

  sleep(1); // Tunggu 1 detik sebelum melakukan uji berikutnya
}