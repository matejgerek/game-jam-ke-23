const TEXT_COLOR = '#ffffff';

export default class LeaderboardScene extends Phaser.Scene {
    constructor() {
        super("LeaderboardScene")
    }

    preload() {
        this.load.image('background', 'src/assets/background.jpg');
    }

    async create() {
        this.background = this.add.image(0, 0, 'background');
        this.background.setOrigin(0, 0);
        this.background.alpha = 0.3;
        this.background.displayWidth = this.sys.game.config.width;
        this.background.displayHeight = this.sys.game.config.height;
        this.background.depth = -1;

         try {
          const response = await fetch('/scores');
          const data = await response.json();
          this.scores = data;
        } catch (err) {
          console.error(err);
          this.scores = [];
        }


        this.add.text(50, 50, 'Leaderboard', { fontSize: '32px', fill: TEXT_COLOR });
        for (let i = 0; i < this.scores.length; i++) {
            const score = this.scores[i];
            const date = new Date(score.date)
            const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
            const text = `${i + 1}. ${score.name} - ${score.score} (${formattedDate})`;
            this.add.text(50, 100 + 50 * i, text, { fontSize: '24px', fill: TEXT_COLOR });
        }

        this.add.text(50, 400, 'Press Space to Return to Main Menu', { fontSize: '24px', fill: TEXT_COLOR });
    }

    update() {
        if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).isDown) {
            this.scene.start('TitleScene');
        }
    }
}