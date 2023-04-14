const express = require('express');
const Leaderboard = require("./Leaderboard");

const app = express();

app.use(express.static(__dirname));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/scores', function (req, res) {
  const leaderboard = new Leaderboard();
  res.send(leaderboard.getTopScores());
})

app.get('/add-score/:score/:name', function (req, res) {
  const { score, name } = req.params;
  const leaderboard = new Leaderboard();
  leaderboard.addScore(name, score, new Date());
  res.status(200).send();
});

app.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});