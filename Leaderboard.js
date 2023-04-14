const fs = require('fs');

const PATH = __dirname + '/scores.json';

class Leaderboard {
  constructor(maxScores = 5) {
    this.maxScores = maxScores;
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
        const data = fs.readFileSync(PATH);
        this.scores = JSON.parse(data);
      } catch (err) {
        if (err.code === 'ENOENT') {
          // Create new file if it does not exist
          fs.writeFileSync(this.filePath, '[]');
          this.scores = [];
        } else {
          throw err;
        }
      }
    }


  saveScores() {
    fs.writeFileSync(PATH, JSON.stringify(this.scores));
  }
}

module.exports = Leaderboard;
