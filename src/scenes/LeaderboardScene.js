const TEXT_COLOR = '#ffffff';

export default class LeaderboardScene extends Phaser.Scene {
    constructor() {
        super("LeaderboardScene")
    }

    preload() {
        this.load.image("background1", "src/assets/background_new.png");
    }

    async create() {
        // set background
        this.background = this.add.tileSprite(0, -400, this.sys.game.config.width, this.sys.game.config.height + 400,
            'background1').setOrigin(0,0);
        this.background.setScale(1.5);
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