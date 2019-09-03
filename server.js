const express = require('express');
const path = require('path');
const db = require('./db');
const moment = require('moment');
const app = express();
app.use(express.json());

const genValidator = (item, items) => {
  const {startDate, endDate} = item;
  if (moment(startDate).isAfter(endDate)) return 'vacation cannot end before it starts';
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/vacations', async (req, res, next) => {
  try {
    res.send(await db('vacations.json', genValidator).findAll());
  }
  catch (ex) {
    next(ex);
  }
});

app.post('/api/vacations', async (req, res, next) => {
  try {
    res.status(200).send(await db('vacations.json', genValidator).create(req.body));
  }
  catch (ex) {
    next(ex);
  }
});

app.delete('/api/vacations/:id', async (req, res, next) => {
  try {
    res.status(204).send(await db('vacations.json', genValidator).destroy(req.params.id));
  }
  catch (ex) {
    next(ex);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message});
});

app.listen(3000, () => console.log('listening on 3000'));