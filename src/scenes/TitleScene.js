const BUTTON_STYLING = {
    fill: '#fff',
    backgroundColor: '#7D58BE',
    padding: {
        x: 10,
        y: 5
    },
    borderRadius: 10,
    fontSize: '32px',
    shadow: {
        offsetX: 1,
        offsetY: 1,
        color: '#000000',
        blur: 2,
        stroke: true,
        fill: true
    }
};

export default class TitleScene extends Phaser.Scene {
    constructor() {
        super("TitleScene")
    }

    preload() {
        this.load.image("background1", "src/assets/background_new.png");
    }

    async create() {
        // set background
        this.background = this.add.tileSprite(0, -400, this.sys.game.config.width, this.sys.game.config.height + 400,
            'background1').setOrigin(0,0);
        this.background.setScale(1.5);
        this.background.alpha = 0.6;
        this.background.depth = -1;

        // add start game button with styling
        const startGameButton = this.add.text(this.game.config.width/2 - 110, this.game.config.height/2 - 100,
                'Start Game', BUTTON_STYLING);
        // add functionality to the start game button
        startGameButton.setInteractive({ useHandCursor: true })
            .on('pointerover', () => startGameButton.setStyle({ backgroundColor: '#BB5BFF' }))
            .on('pointerout', () => startGameButton.setStyle({ backgroundColor: '#7D58BE' }))
            .on('pointerdown', () => {this.startButton()});

        // add leaderboard button with styling
        const leaderboardButton = this.add.text(this.game.config.width/2 - 120, this.game.config.height/2,
                'Leaderboard', BUTTON_STYLING);
        // add functionality to the leaderboard button
        leaderboardButton.setInteractive({ useHandCursor: true })
            .on('pointerover', () => leaderboardButton.setStyle({ backgroundColor: '#BB5BFF' }))
            .on('pointerout', () => leaderboardButton.setStyle({ backgroundColor: '#7D58BE' }))
            .on('pointerdown', () => {this.leaderboardButton()});


        const username = localStorage.getItem('phaser_username');
        if (!username) {
            const name = prompt('Please enter your name:');
            localStorage.setItem('phaser_username', name);
        }
    }

    startButton() {
        this.scene.start('GameMenuScene');
    }


    leaderboardButton(){
        this.scene.start('LeaderboardTitleScene');
    }
}