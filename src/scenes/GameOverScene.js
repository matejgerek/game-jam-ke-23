const TEXT_COLOR = '#ffffff';

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super("GameOverScene")
    }

    preload() {
        this.load.image('background', 'src/assets/background.jpg');
    }

   create() {
      this.background = this.add.image(0, 0, 'background');
      this.background.setOrigin(0, 0);
      this.background.alpha = 0.3;
      this.background.displayWidth = this.sys.game.config.width;
      this.background.displayHeight = this.sys.game.config.height;
      this.background.depth = -1;

      const centerX = this.cameras.main.width / 2;
      const gameOverText = this.add.text(centerX, 50, 'Game Over', { fontSize: '32px', fill: TEXT_COLOR });
      gameOverText.setOrigin(0.5, 0);

      const returnText = this.add.text(centerX, 100, 'Press Space to Return to Main Menu', { fontSize: '24px', fill: TEXT_COLOR });
      returnText.setOrigin(0.5, 0);

      // Center the text vertically by setting the y position to half the height of the game screen
      gameOverText.y = this.cameras.main.height / 2 - gameOverText.displayHeight;
      returnText.y = this.cameras.main.height / 2;
    }


    update() {
        if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).isDown) {
            this.scene.start('TitleScene');
        }
    }
}