const TEXT_COLOR = '#ffffff';

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super("GameOverScene")
    }

    preload() {
        this.load.image("background1", "src/assets/background_new.png");
        this.load.image('game_over', 'src/assets/game_over.png');
    }

    async create(data) {
        // setup background
        this.background = this.add.tileSprite(0, -400, this.sys.game.config.width, this.sys.game.config.height + 400,
            'background1').setOrigin(0,0);
        this.background.setScale(1.5);
        this.background.alpha = 0.6;
        this.background.depth = -1;

        const score = Math.floor(data.score);

        const username = localStorage.getItem('phaser_username');
        await fetch(`/add-score/${data.leaderboardPath}/${score}/${username ? username : 'noname'}`)
        const centerX = this.cameras.main.width / 2;
        this.add.image(centerX, 200, 'game_over').setOrigin(0.5, 0);

        const scoreText = this.add.text(centerX, 300, `Score: ${score}`, { fontSize: '32px', fill: TEXT_COLOR });
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