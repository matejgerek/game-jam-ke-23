const fs = require('fs');

const FILE_NAME = 'scores.json';

class Leaderboard {
  constructor() {
    this.maxScores = 5;
    this.loadScores();
  }

  addScore(name, score, date) {
    this.scores.push({ name, score, date });
    this.scores.sort((a, b) => b.score - a.score); // sort descending
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
        const data = fs.readFileSync(FILE_NAME);
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
    fs.writeFileSync(FILE_NAME, JSON.stringify(this.scores));
  }
}

module.exports = Leaderboard;