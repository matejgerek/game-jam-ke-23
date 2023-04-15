const express = require('express');
const Leaderboard = require("./Leaderboard");

const app = express();

app.use(express.static(__dirname));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/scores/:leaderboardPath', function (req, res) {
  const { leaderboardPath } = req.params;
  const leaderboard = new Leaderboard(leaderboardPath);
  res.send(leaderboard.getTopScores());
})

app.get('/add-score/:leaderboardPath/:score/:name', function (req, res) {
  const { leaderboardPath, score, name } = req.params;
  const leaderboard = new Leaderboard(leaderboardPath);
  leaderboard.addScore(name, score, new Date());
  res.status(200).send();
});

app.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});