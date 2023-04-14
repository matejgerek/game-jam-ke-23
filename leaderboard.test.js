const Leaderboard = require('./Leaderboard');

const leaderboard = new Leaderboard();

leaderboard.addScore('Player 1', 100, new Date());
leaderboard.addScore('Player 2', 200, new Date());
leaderboard.addScore('Player 3', 300, new Date());
leaderboard.addScore('Player 4', 400, new Date());
leaderboard.addScore('Player 5', 500, new Date());
console.log(leaderboard.getTopScores())
leaderboard.addScore('Player 6', 600, new Date());
console.log(leaderboard.getTopScores())
