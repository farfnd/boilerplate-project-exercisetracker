require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');

const {
  createUser,
  createExercise,
  getUsers,
  getUserLogs
} = require("./mongoose.js");

app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users', (req, res) => {
  createUser(req.body.username, (err, data) => {
    if (err) return console.log(err);
    res.json(data);
  })
});

app.get('/api/users', (req, res) => {
  getUsers((err, data) => {
    if (err) return console.log(err);
    res.json(data);
  })
})

app.post('/api/users/:_id/exercises', (req, res) => {
  createExercise(req.params._id, req.body, (err, data) => {
    if (err) return console.log(err);
    res.json(data);
  })
});

app.get('/api/users/:_id/logs?', (req, res) => {
  const { _id } = req.params;
  const { from, to, limit } = req.query;
  
  getUserLogs(_id, { from, to, limit }, (err, data) => {
    if (err) return console.log(err);
    res.json(data);
  })
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
