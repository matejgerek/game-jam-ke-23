const TEXT_COLOR = '#ffffff';

export default class GameMenuScene extends Phaser.Scene {
    constructor() {
        super("GameMenuScene")
    }

    preload() {
        this.load.image('background', 'src/assets/background.jpg');
    }

    async create() {
        this.background = this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.background.alpha = 0.3;
        this.background.displayWidth = this.sys.game.config.width;
        this.background.displayHeight = this.sys.game.config.height;
        this.background.depth = -1;

        const startText = this.add.text(this.game.config.width/2 - 115, this.game.config.height/2, 'Dodge Holes',
            { fontSize: '32px', fill: TEXT_COLOR });
        startText.setInteractive({ useHandCursor: true });
        startText.on('pointerdown', () => this.game1Button());

        const jumpingUpGame = this.add.text(this.game.config.width/2 - 110, this.game.config.height/2 + 100,
            'Jumping Up', { fontSize: '32px', fill: TEXT_COLOR });
        jumpingUpGame.setInteractive({ useHandCursor: true });
        jumpingUpGame.on('pointerdown', () => this.game2JumpingUp());
    }

    game1Button() {
        this.scene.start('GameScene');
    }

    game2JumpingUp(){
        this.scene.start('GameJumpingUpScene');
    }
}