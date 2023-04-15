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


        // add dodge holes button with styling
        const dodgeHolesButton = this.add.text(this.game.config.width/2 - 115, this.game.config.height/2,
            'Dodge Holes', {
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
        dodgeHolesButton.setInteractive({ useHandCursor: true })
            .on('pointerover', () => dodgeHolesButton.setStyle({ backgroundColor: '#BB5BFF' }))
            .on('pointerout', () => dodgeHolesButton.setStyle({ backgroundColor: '#7D58BE' }))
            .on('pointerdown', () => {this.game1Button()});


        // add jumping up game button with styling
        const jumpingUpButton = this.add.text(this.game.config.width/2 - 110, this.game.config.height/2 + 100,
            'Jumping Up', {
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
        jumpingUpButton.setInteractive({ useHandCursor: true })
            .on('pointerover', () => jumpingUpButton.setStyle({ backgroundColor: '#BB5BFF' }))
            .on('pointerout', () => jumpingUpButton.setStyle({ backgroundColor: '#7D58BE' }))
            .on('pointerdown', () => {this.game2JumpingUp()});
    }

    game1Button() {
        this.scene.start('GameScene');
    }

    game2JumpingUp(){
        this.scene.start('GameJumpingUpScene');
    }
}