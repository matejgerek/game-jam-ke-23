let gameOptions = {
    platformStartSpeed: 350,
    spawnRange: [300, 100],
    platformSizeRange: [100, 250],
    playerGravity: 900,
    jumpForce: 550,
    platformWidth: 200,
    jumps: 2
}

const BACKGROUND_SPEED = 1;

export default class GameCollectStarsScene extends Phaser.Scene {
    constructor(game) {
        super("GameCollectStarsScene");
        this.game = game;
    }

    preload() {
        this.load.image("background1", "src/assets/background_new.png");
        this.load.image("platformDirt", "src/assets/platformDirt.png");
        this.load.image("platformGrass", "src/assets/platformGrass.png");
        this.load.image("platformLowest", "src/assets/platformLow.png");
        this.load.image("player1run", "src/assets/run/Run__000.png");
        this.load.image("player2run", "src/assets/run/Run__001.png");
        this.load.image("player3run", "src/assets/run/Run__002.png");
        this.load.image("player4run", "src/assets/run/Run__003.png");
        this.load.image("player5run", "src/assets/run/Run__004.png");
        this.load.image("player6run", "src/assets/run/Run__005.png");
        this.load.image("player7run", "src/assets/run/Run__006.png");
        this.load.image("player8run", "src/assets/run/Run__007.png");
        this.load.image("player9run", "src/assets/run/Run__008.png");
        this.load.image("player10run", "src/assets/run/Run__009.png");
        this.load.image("player1jump", "src/assets/jump/Jump__000.png");
        this.load.image("player2jump", "src/assets/jump/Jump__001.png");
        this.load.image("player3jump", "src/assets/jump/Jump__002.png");
        this.load.image("player4jump", "src/assets/jump/Jump__003.png");
        this.load.image("player5jump", "src/assets/jump/Jump__004.png");
        this.load.image("player6jump", "src/assets/jump/Jump__005.png");
        this.load.image("player7jump", "src/assets/jump/Jump__006.png");
        this.load.image("player8jump", "src/assets/jump/Jump__007.png");
        this.load.image("player9jump", "src/assets/jump/Jump__008.png");
        this.load.image("player10jump", "src/assets/jump/Jump__009.png");
        this.load.image("star", "src/assets/star.png");
    }

    create() {
        // set background
        this.background = this.add.tileSprite(0, -400, this.sys.game.config.width, this.sys.game.config.height + 400,
            'background1').setOrigin(0,0);
        this.background.setScale(1.5);
        this.background.depth = -1;

        // cover ground with grass
        this.groundOverlay = this.add.tileSprite(this.game.config.width / 2, this.game.config.height * 1, this.sys.game.config.width, 100,
            'platformGrass');
        this.groundOverlay.depth = 2;

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

        //star group
        this.starGroup = this.add.group({

            // once a platform is removed, it's added to the pool
            removeCallback: function (star) {
                star.scene.starPool.add(star)
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
        this.starPool = this.add.group({

            // once a platform is removed from the pool, it's added to the active platforms group
            removeCallback: function (star) {
                star.scene.starGroup.add(star)
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
        this.player = this.physics.add.sprite(this.game.config.width / 2, this.game.config.height - 100, "player1run");
        this.player.setGravityY(gameOptions.playerGravity);

        // setting collisions between the player and the platform group
        this.physics.add.collider(this.player, platform);
        this.physics.add.collider(this.player, this.platformGroup1);
        this.physics.add.collider(this.player, this.platformGroup2);

        // add starting moving platform
        this.addPlatform(gameOptions.platformWidth, this.game.config.width/8, this.game.config.height-200, -0.8, this.platformGroup1);
        this.addPlatform(gameOptions.platformWidth, this.game.config.width/4, this.game.config.height-400, -0.8, this.platformGroup2);
        this.addStar(this.game.config.width, this.game.config.height-70, -0.8);

        // checking for input
        this.input.keyboard.on("keydown", this.jump, this);

        //score
        this.score = 0;
        this.scoreText = this.add.text(10, 10, 'Score: ' + this.score, {fontSize: '32px', fill: '#fff'});
        //time
        this.timer = 60;
        this.timerText = this.add.text(10, 42, 'Time: ' + this.timer + 's', {fontSize: '32px', fill: '#fff'});
        this.time.addEvent({
            delay: 1000, // in milliseconds
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });

        // Define player animation frames
        this.anims.create({
            key: 'run',
            frames: [
                { key: 'player1run' },
                { key: 'player2run' },
                { key: 'player3run' },
                { key: 'player4run' },
                { key: 'player5run' },
                { key: 'player6run' },
                { key: 'player7run' },
                { key: 'player8run' },
                { key: 'player9run' },
                { key: 'player10run' }
            ],
            frameRate: 10,
            repeat: -1
        });
        // Define player animation frames
        this.anims.create({
            key: 'jump',
            frames: [
                { key: 'player1jump' },
                { key: 'player2jump' },
                { key: 'player3jump' },
                { key: 'player4jump' },
                { key: 'player5jump' },
                { key: 'player6jump' },
                { key: 'player7jump' },
                { key: 'player8jump' },
                { key: 'player9jump' },
                { key: 'player10jump' }
            ],
            frameRate: 10
        });

        // Start player animation
        this.player.anims.play('run');

        this.physics.add.collider(this.player, this.starGroup.getChildren(), this.onCollision, null, this);
    }

    // exit button functionality
    exitButton() {
        this.scene.start('TitleScene');
    }

    onCollision(player, star) {
        // Code to be executed when player collides with star
        this.score += 10
        this.starGroup.killAndHide(star);
        this.starGroup.remove(star);
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
            platform = this.physics.add.sprite(posX, posY, "platformLowest");
            platform.setImmovable(true);
            platform.setVelocityX(gameOptions.platformStartSpeed * move);
            platform.displayWidth = platformWidth;
            platformGroup.add(platform);
        }
        this.nextPlatformDistance1 = Phaser.Math.Between(gameOptions.spawnRange[0], gameOptions.spawnRange[1]);
        this.nextPlatformDistance2 = Phaser.Math.Between(gameOptions.spawnRange[0], gameOptions.spawnRange[1]);
    }

    addStar(posX, posY, move) {
        let star;
        if(this.starPool.getLength()){
            star = this.starPool.getFirst();
            star.x = posX;
            star.active = true;
            star.visible = true;
            this.starPool.remove(star);
        }
        else {
            star = this.physics.add.sprite(posX, posY, "star");
            star.setScale(0.5)
            star.setImmovable(true);
            star.setVelocityX(gameOptions.platformStartSpeed * move);
            this.starGroup.add(star);
        }
        this.nextStarDistance = Phaser.Math.Between(gameOptions.spawnRange[0], gameOptions.spawnRange[1]);
    }

    // the player jumps when on the ground, or once in the air as long as there are jumps left and the first jump was on the ground
    jump() {
        if (this.player.body.touching.down || (this.playerJumps > 0 && this.playerJumps < gameOptions.jumps)) {
            if (this.player.body.touching.down) {
                this.playerJumps = 0;
            }
            this.player.setVelocityY(gameOptions.jumpForce * -1);
            this.playerJumps++;
            this.player.anims.play('jump').once('animationcomplete', () => {
                this.player.anims.play("run");
            });
        }
    }

    update(time, delta) {
        // move background
        this.background.tilePositionX += BACKGROUND_SPEED;
        // ground speed, find out how to calculate speed
        this.groundOverlay.tilePositionX += 4.2;
        // add score text
        this.scoreText.setText('Score: ' + this.score);
        // game over
        if( this.player.y > this.cameraYMin + this.game.height ) {
            this.scene.start("GameOverScene", {score: this.score, leaderboardPath: 'DODGE_HOLES'});
        }
        this.player.x = this.game.config.width / 2;

        // if (this.player.y < this.cameras.main.centerY) {
        //     this.cameras.main.scrollY -= (this.cameras.main.centerY - this.player.y);
        // }
        // this.cameras.main.setLerp(0.1, 0.1);

        //recycling platforms
        let minDistance = this.recyclingPlatforms(this.platformGroup1);

        // adding new platforms for 1 group
        if(minDistance > this.nextPlatformDistance1){
            this.addPlatform(gameOptions.platformWidth, this.game.config.width + gameOptions.platformWidth / 2,
                this.game.config.height - 230 , -0.8, this.platformGroup1);
        }

        minDistance = this.recyclingPlatforms(this.platformGroup2);
        // adding new platforms for 2 group
        if(minDistance > this.nextPlatformDistance2){
            this.addPlatform(gameOptions.platformWidth, this.game.config.width + gameOptions.platformWidth / 2,
                this.game.config.height - 460 , -0.8, this.platformGroup2);
        }

        //recycling stars
        minDistance = this.recyclingStars()
        // adding new stars
        if(minDistance > this.nextStarDistance){
            const myArray = ['100', '300', '500'];
            const randomValue = myArray[Math.floor(Math.random() * myArray.length)];
            this.addStar(this.game.config.width, this.game.config.height-randomValue, -0.8);
        }
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

    recyclingStars() {
        let minDistance = this.game.config.width;
        this.starGroup.getChildren().forEach(function (star) {
            let starDistance = this.game.config.width - star.x - star.displayWidth / 2;
            minDistance = Math.min(minDistance, starDistance);
            if (star.x < -star.displayWidth / 4) {
                this.starGroup.killAndHide(star);
                this.starGroup.remove(star);
            }
        }, this);
        return minDistance;
    }

    updateTimer(){
        this.timer -= 1;
        this.timerText.setText('Time: ' + this.timer + 's');
        if (this.timer === 0){
            this.scene.start("GameOverScene", {score: this.score, leaderboardPath: "COLLECT_STARS"});
        }
    }
};