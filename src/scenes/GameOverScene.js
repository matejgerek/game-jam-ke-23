const TEXT_COLOR = '#ffffff';

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super("GameOverScene")
    }

    preload() {
        this.load.image('background', 'src/assets/background.jpg');
        this.load.image('game_over', 'src/assets/game_over.png');
    }

   create() {
      this.background = this.add.image(0, 0, 'background');
      this.background.setOrigin(0, 0);
      this.background.alpha = 0.3;
      this.background.displayWidth = this.sys.game.config.width;
      this.background.displayHeight = this.sys.game.config.height;
      this.background.depth = -1;

      const centerX = this.cameras.main.width / 2;
      this.add.image(centerX, 200, 'game_over').setOrigin(0.5, 0);

        const scoreText = this.add.text(centerX, 300, `Score: ${this.game.score}`, { fontSize: '32px', fill: TEXT_COLOR });
        scoreText.setOrigin(0.5, 0);
        scoreText.y = this.cameras.main.height / 2;

      const returnText = this.add.text(centerX, 100, 'Press Space to Return to Main Menu', { fontSize: '24px', fill: TEXT_COLOR });
      returnText.setOrigin(0.5, 0);
      returnText.y = this.cameras.main.height / 2 + 200;
    }


    update() {
        if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).isDown) {
            this.scene.start('TitleScene');
        }
    }
}