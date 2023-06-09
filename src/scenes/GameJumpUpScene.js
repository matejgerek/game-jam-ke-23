// global game options
let gameOptions = {
    platformStartSpeed: 350,
    spawnRange: [300, 500],
    playerGravity: 900,
    jumpForce: 550,
    platformWidth: 200,
    jumps: 2,
    platform1height: 150,
    platform2height: 300
}

export default class GameJumpUpScene extends Phaser.Scene {
    constructor(game) {
        super("GameJumpUpScene");
        this.game = game;
    }

    preload() {
        this.load.image("background", "src/assets/hill.png");
        this.load.image("platformDirt", "src/assets/platformDirt.png");
        this.load.image("platformGrass", "src/assets/platformGrass.png");
        this.load.image("platformLowest", "src/assets/platformLow.png");
        this.load.image("player", "src/assets/run/run1n.png");
        this.load.image("player1run", "src/assets/playerForward.png");
        this.load.image("player2run", "src/assets/run/run2n.png");
        this.load.image("player3run", "src/assets/run/run3n.png");
        this.load.image("player4run", "src/assets/run/run4n.png");
        this.load.image("player5run", "src/assets/run/run5n.png");
        this.load.image("player6run", "src/assets/run/run6n.png");
        this.load.image("player7run", "src/assets/run/run7n.png");
        this.load.image("player8run", "src/assets/run/run8n.png");
        this.load.image("player1jump", "src/assets/jump/jump1.png");
        this.load.image("player2jump", "src/assets/jump/jump2.png");
        this.load.image("player3jump", "src/assets/jump/jump3.png");
    }

    create() {
        // cover ground with grass
        this.groundOverlay = this.add.tileSprite(this.game.config.width / 2, this.game.config.height * 1,
            this.sys.game.config.width, 100,
            'platformGrass');
        this.groundOverlay.depth = 2;

        gameOptions.platform1height = 150
        gameOptions.platform2height = 300
        // set background
        this.background = this.add.tileSprite(0, 0, 0, 0, 'background').setOrigin(0,0);
        this.background.displayWidth = this.sys.game.config.width;
        this.background.displayHeight = this.sys.game.config.height;
        this.background.depth = -1;

        // add exit button with styling
        const exitButton = this.add.text(this.game.config.width - 110, 20,
            'Exit', {
                fill: '#fff',
                backgroundColor: '#FF3A44',
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
            });
        // add functionality to the start game button
        exitButton.setInteractive({ useHandCursor: true })
            .on('pointerover', () => exitButton.setStyle({ backgroundColor: '#B20028' }))
            .on('pointerout', () => exitButton.setStyle({ backgroundColor: '#FF3A44' }))
            .on('pointerdown', () => {this.exitButton()});

        // group 1 with all active platforms.
        this.platformGroup1 = this.add.group({

            // once a platform is removed, it's added to the pool
            removeCallback: function (platform) {
                platform.scene.platformPool.add(platform)
            }
        });

        // group 2 with all active platforms.
        this.platformGroup2 = this.add.group({

            // once a platform is removed, it's added to the pool
            removeCallback: function (platform) {
                platform.scene.platformPool.add(platform)
            }
        });

        // pool
        this.platformPool = this.add.group({

            // once a platform is removed from the pool, it's added to the active platforms group
            removeCallback: function (platform) {
                platform.scene.platformGroup1.add(platform)
                platform.scene.platformGroup2.add(platform)
            }
        });

        // number of consecutive jumps made by the player
        this.playerJumps = 0;

        // adding a start platform to the game
        let platform;
        platform = this.physics.add.sprite(this.game.config.width / 2, this.game.config.height * 1, "platformDirt");
        platform.setImmovable(true);
        platform.displayWidth = this.game.config.width;

        // adding the player;
        this.player = this.physics.add.sprite(this.game.config.width / 2, this.game.config.height - 100, "player");
        this.player.setGravityY(gameOptions.playerGravity);

        // setting collisions between the player and the platform group
        this.physics.add.collider(this.player, platform);
        this.physics.world.setBounds(0, 0, this.game.config.width, this.game.config.height);

        // add starting moving platform
        this.addPlatform(gameOptions.platformWidth, this.game.config.width/8, this.game.config.height - gameOptions.platform1height, -1.2, this.platformGroup1);

        // checking for input
        this.input.keyboard.on("keydown", this.jump, this);

        //score
        this.score = 0;
        this.scoreText = this.add.text(this.game.config.width/2 - 60, this.player.y - 200, 'Score: ' + this.score, {fontSize: '32px', fill: '#fff'});

        // Set the camera to follow the player with an offset
        this.cameras.main.setBounds(0, 0, this.game.config.width, this.game.config.height);
        this.cameras.main.setZoom(1.3);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setFollowOffset(-100, 0);
        this.platformLevelCamera = 0

        this.physics.add.collider(this.player, this.platformGroup1.getChildren(), this.onCollision, null, this);
        this.physics.add.collider(this.player, this.platformGroup2.getChildren(), this.onCollision, null, this);

        this.time.addEvent({
            delay: 1000, // in milliseconds
            callback: this.addNewPlatform,
            callbackScope: this,
            loop: true
        });

        // Define player animation frames
        this.anims.create({
            key: 'run',
            frames: [
                { key: 'player1run' },
            ],
            frameRate: 1,
            repeat: -1
        });
        // Define player animation frames
        this.anims.create({
            key: 'jump',
            frames: [
                { key: 'player1jump' },
                { key: 'player2jump' },
                { key: 'player3jump' },
            ],
            frameRate: 4
        });

        this.player.anims.play('run');
        this.player.setScale(1.5, 1.5);
    }

    addNewPlatform(){
        let randomNumber = Math.random() * 0.6 + 1.5;
        this.addPlatform(gameOptions.platformWidth, this.game.config.width + gameOptions.platformWidth / 2,
            this.game.config.height - gameOptions.platform1height , -1.2, this.platformGroup1);
        this.addPlatform(gameOptions.platformWidth, this.game.config.width + gameOptions.platformWidth / 2 + gameOptions.platformWidth*randomNumber,
            this.game.config.height - gameOptions.platform2height , -1.2, this.platformGroup2);
    }
    onCollision(player, platform) {
        // Code to be executed when player collides with platform
        if (player.body.touching.down && platform.body.touching.up && platform.active) {
            this.score += 1
            if (this.score % 2 !== 0) {
                gameOptions.platform1height += 320
            } else if (this.score !== 0) {
                gameOptions.platform2height += 320
            }
            platform.active = false
        }
    }

    // exit button functionality
    exitButton() {
        this.scene.start('TitleScene');
    }

    // the core of the script: platform are added from the pool or created on the fly
    addPlatform(platformWidth, posX, posY, move, platformGroup) {
        let platform;
        if(this.platformPool.getLength()){
            platform = this.platformPool.getFirst();
            platform.x = posX;
            platform.active = true;
            platform.visible = true;
            this.platformPool.remove(platform);
        }
        else {
            platform = this.physics.add.sprite(posX, posY, "platformLowest").setOrigin(0.5, 0.5)
            platform.setImmovable(true);
            platform.setVelocityX(gameOptions.platformStartSpeed * move);
            platform.displayWidth = platformWidth;
            platformGroup.add(platform);
        }
    }

    // the player jumps when on the ground, or once in the air as long as there are jumps left and the first jump was on the ground
    jump() {
        if (this.player.body.touching.down || (this.playerJumps > 0 && this.playerJumps < gameOptions.jumps)) {
            if (this.player.body.touching.down) {
                this.playerJumps = 0;
            }
            this.player.setVelocityY(gameOptions.jumpForce * -1);
            this.playerJumps++;
            this.currentAnimation = 'jump';
            this.player.anims.play(this.currentAnimation).once('animationcomplete', () => {
                this.player.anims.play("run");
            });
        }
    }

    update(time, delta) {
        // ground speed, find out how to calculate speed
        this.groundOverlay.tilePositionX += 6;

        if (this.player.y > this.game.config.height-100 && this.score > 1) {
            this.scene.start("GameOverScene", {score: this.score, leaderboardPath: 'JUMP_UP'});
        }
        this.scoreText.setText('Score: ' + this.score);
        this.scoreText.y = this.player.y - 200
        // game over
        if( this.player.y > this.cameraYMin + this.game.height ) {
            this.scene.start("GameOverScene", {score: this.score, leaderboardPath: 'JUMP_UP'});
        }
        this.player.x = this.game.config.width / 2;

        if (this.player.y < this.cameras.main.centerY) {
            this.cameras.main.scrollY -= (this.cameras.main.centerY - this.player.y - 50);
        }
        this.cameras.main.setLerp(0.1, 0.1);

        //recycling platforms
        this.recyclingPlatforms(this.platformGroup1);

    }

    recyclingPlatforms(platformGroup) {
        let minDistance = this.game.config.width;
        platformGroup.getChildren().forEach(function (platform) {
            let platformDistance = this.game.config.width - platform.x - platform.displayWidth / 2;
            minDistance = Math.min(minDistance, platformDistance);
            if (platform.x < -platform.displayWidth / 4) {
                platformGroup.killAndHide(platform);
                platformGroup.remove(platform);
            }
        }, this);
        return minDistance;
    }
};