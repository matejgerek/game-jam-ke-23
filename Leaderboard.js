const fs = require('fs');

const LEADERBOARD_PATHS = {
    DODGE_HOLES: __dirname + '/dodge-holes.json',
    COLLECT_STARS: __dirname + '/collect-stars.json',
}

class Leaderboard {
  constructor(path, maxScores = 5) {
    this.maxScores = maxScores;
    this.path = LEADERBOARD_PATHS[path];
    this.loadScores();
  }

  addScore(name, score, date) {
    this.scores.push({ name, score, date });
    this.scores.sort((a, b) => b.score - a.score);
    if (this.scores.length > this.maxScores) {
      this.scores.splice(this.maxScores);
    }
    this.saveScores();
  }

    removeScore(index) {
        this.scores.splice(index, 1);
        this.saveScores();
    }

    getTopScores() {
        return this.scores.slice(0, this.maxScores);
    }

  loadScores() {
      try {
        const data = fs.readFileSync(this.path);
        this.scores = JSON.parse(data);
      } catch (err) {
        if (err.code === 'ENOENT') {
          // Create new file if it does not exist
          fs.writeFileSync(this.path, '[]');
          this.scores = [];
        } else {
          throw err;
        }
      }
    }


  saveScores() {
    fs.writeFileSync(this.path, JSON.stringify(this.scores));
  }
}

module.exports = Leaderboard