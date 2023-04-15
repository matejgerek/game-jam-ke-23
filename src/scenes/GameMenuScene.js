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
        const dodgeHolesButton = this.add.text(this.game.config.width/2 - 115, this.game.config.height/2 - 100,
            'Dodge Holes', BUTTON_STYLING);
        // add functionality to the start game button
        dodgeHolesButton.setInteractive({ useHandCursor: true })
            .on('pointerover', () => dodgeHolesButton.setStyle({ backgroundColor: '#BB5BFF' }))
            .on('pointerout', () => dodgeHolesButton.setStyle({ backgroundColor: '#7D58BE' }))
            .on('pointerdown', () => {this.game1Button()});


        // add jumping up game button with styling
        const jumpingUpButton = this.add.text(this.game.config.width/2 - 130, this.game.config.height/2,
            'Collect Stars', BUTTON_STYLING);
        // add functionality to the leaderboard button
        jumpingUpButton.setInteractive({ useHandCursor: true })
            .on('pointerover', () => jumpingUpButton.setStyle({ backgroundColor: '#BB5BFF' }))
            .on('pointerout', () => jumpingUpButton.setStyle({ backgroundColor: '#7D58BE' }))
            .on('pointerdown', () => {this.game2JumpingUp()});

        // add main menu button with styling
        const mainMenuButton = this.add.text(this.game.config.width/2 - 100, this.game.config.height - 60,
            'Main Menu', BUTTON_STYLING);
        // add functionality to the main menu button
        mainMenuButton.setInteractive({ useHandCursor: true })
            .on('pointerover', () => mainMenuButton.setStyle({ backgroundColor: '#BB5BFF' }))
            .on('pointerout', () => mainMenuButton.setStyle({ backgroundColor: '#7D58BE' }))
            .on('pointerdown', () => {this.mainMenuButton()});
    }

    game1Button() {
        this.scene.start('GameScene');
    }

    game2JumpingUp(){
        this.scene.start('GameJumpingUpScene');
    }

    mainMenuButton(){
        this.scene.start('TitleScene');
    }
}