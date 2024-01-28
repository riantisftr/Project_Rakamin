const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const moment = require('moment');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const dataFilePath = 'data.json';
let currentId = 1;

// Endpoint untuk mendapatkan semua data
app.get('/api/users', (req, res) => {
  const data = getDataFromFile();
  res.json(data);
});

// Endpoint untuk mendapatkan data berdasarkan ID
app.get('/api/users/:id', (req, res) => {
  const data = getDataFromFile();
  const id = req.params.id;
  const result = data.find(item => item.id === id);

  if (result) {
    res.json(result);
  } else {
    res.status(404).json({ error: 'Data not found' });
  }
});

// Endpoint untuk menambahkan data baru
app.post('/api/users', (req, res) => {
  const data = getDataFromFile();
  const newData = req.body;
  newData.id = currentId.toString();
  newData.createdAt = moment().toISOString();
  currentId++;
  data.push(newData);
  saveDataToFile(data);
  res.json(newData);
});

// Endpoint untuk memperbarui data berdasarkan ID
app.put('/api/users/:id', (req, res) => {
  const data = getDataFromFile();
  const id = req.params.id;
  const index = data.findIndex(item => item.id === id);

  if (index !== -1) {
    // Update data jika ID ditemukan
    const updatedData = req.body;
    updatedData.id = id;
    updatedData.createdAt = moment().toISOString();
    data[index] = updatedData;
    saveDataToFile(data);
    res.json(updatedData);
  } else {
    res.status(404).json({ error: 'Data not found' });
  }
});

// Fungsi untuk membaca data dari file
function getDataFromFile() {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Fungsi untuk menyimpan data ke file
function saveDataToFile(data) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});