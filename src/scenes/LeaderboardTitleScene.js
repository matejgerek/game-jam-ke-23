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


export default class LeaderboardTitleScene extends Phaser.Scene {
    constructor() {
        super("LeaderboardTitleScene")
    }

    preload() {
        this.load.image("background1", "src/assets/background_new.png");
    }

    async create() {
        // set background
        this.background = this.add.tileSprite(0, -400, this.sys.game.config.width, this.sys.game.config.height + 400,
            'background1').setOrigin(0, 0);
        this.background.setScale(1.5);
        this.background.alpha = 0.6;
        this.background.depth = -1;

        // add leaderboard button with styling
        const dodgeHolesLeaderboard = this.add.text(this.game.config.width / 2 - 230, this.game.config.height / 2 - 50,
            'Dodge holes leaderboard', BUTTON_STYLING);
        // add functionality to the leaderboard button
        dodgeHolesLeaderboard.setInteractive({useHandCursor: true})
            .on('pointerover', () => dodgeHolesLeaderboard.setStyle({backgroundColor: '#BB5BFF'}))
            .on('pointerout', () => dodgeHolesLeaderboard.setStyle({backgroundColor: '#7D58BE'}))
            .on('pointerdown', () => {
                this.leaderboardButton('DODGE_HOLES')
            });

        const collectStarsLeaderboard = this.add.text(this.game.config.width / 2 - 250, this.game.config.height / 2 + 50,
            'Collect stars leaderboard', BUTTON_STYLING);
        collectStarsLeaderboard.setInteractive({useHandCursor: true})
            .on('pointerover', () => collectStarsLeaderboard.setStyle({backgroundColor: '#BB5BFF'}))
            .on('pointerout', () => collectStarsLeaderboard.setStyle({backgroundColor: '#7D58BE'}))
            .on('pointerdown', () => {
                this.leaderboardButton('COLLECT_STARS')
            })

        const returnText = this.add.text(this.game.config.width / 2, 100, 'Press Space to Return to Main Menu', { fontSize: '24px', fill: 'white' });
        returnText.setOrigin(0.5, 0);
        returnText.y = this.cameras.main.height / 2 + 200;
    }

    leaderboardButton(leaderboardPath){
        this.scene.start('LeaderboardScene', {leaderboardPath});
    }

        update() {
        if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).isDown) {
            this.scene.start('TitleScene');
        }
    }

}