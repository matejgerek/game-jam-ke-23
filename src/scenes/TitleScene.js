const TEXT_COLOR = '#ffffff';

export default class TitleScene extends Phaser.Scene {
    constructor() {
        super("TitleScene")
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

        // add start game button with styling
        const startGameButton = this.add.text(this.game.config.width/2 - 110, this.game.config.height/2,
                'Start Game', {
            fill: '#fff',
            backgroundColor: '#7D58BE',
            padding: {
                x: 10,
                y: 5
            },
            borderRadius: 10,
            fontSize: '32px'
        });
        // add functionality to the start game button
        startGameButton.setInteractive({ useHandCursor: true })
            .on('pointerover', () => startGameButton.setStyle({ backgroundColor: '#BB5BFF' }))
            .on('pointerout', () => startGameButton.setStyle({ backgroundColor: '#7D58BE' }))
            .on('pointerdown', () => {this.startButton()});

        // add leaderboard button with styling
        const leaderboardButton = this.add.text(this.game.config.width/2 - 120, this.game.config.height/2 + 100,
                'Leaderboard', {
            fill: '#fff',
            backgroundColor: '#7D58BE',
            padding: {
                x: 10,
                y: 5
            },
            borderRadius: 10,
            fontSize: '32px'
        });
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
        this.scene.start('LeaderboardScene');
    }
}