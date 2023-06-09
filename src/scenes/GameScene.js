let gameOptions = {
    platformStartSpeed: 350,
    spawnRange: [100, 350],
    platformSizeRange: [50, 250],
    playerGravity: 900,
    jumpForce: 400,
    playerStartPosition: 200,
    jumps: 2
}

const BACKGROUND_SPEED = 1;

export default class GameScene extends Phaser.Scene{
    constructor(game){
        super("GameScene");
        this.game = game;
    }
    preload(){
        this.load.image("background1", "src/assets/background_new.png");
        this.load.image("platformGrass", "src/assets/platformGrass.png");
        this.load.image("player1run", "src/assets/run/run1n.png");
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
    create(){
        // setup background
        this.background = this.add.tileSprite(0, -400, this.sys.game.config.width, this.sys.game.config.height + 400,
            'background1').setOrigin(0,0);
        this.background.setScale(1.5);
        this.background.depth = -1;

        // group with all active platforms.
        this.platformGroup = this.add.group({

            // once a platform is removed, it's added to the pool
            removeCallback: function(platform){
                platform.scene.platformPool.add(platform)
            }
        });

        // pool
        this.platformPool = this.add.group({

            // once a platform is removed from the pool, it's added to the active platforms group
            removeCallback: function(platform){
                platform.scene.platformGroup.add(platform)
            }
        });
        // number of consecutive jumps made by the player
        this.playerJumps = 0;

        // adding a platform to the game, the arguments are platform width and x position
        this.addPlatform(this.game.config.width, this.game.config.width / 2);

        // adding the player;
        this.player = this.physics.add.sprite(gameOptions.playerStartPosition, this.game.config.height / 2, "player1run");
        this.player.setGravityY(gameOptions.playerGravity);

        // setting collisions between the player and the platform group
        this.physics.add.collider(this.player, this.platformGroup);

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
                // { key: 'player9run' },
                // { key: 'player10run' }
            ],
            frameRate: 8,
            repeat: -1
        });
        // Define player animation frames
        this.anims.create({
            key: 'jump',
            frames: [
                { key: 'player1jump' },
                { key: 'player2jump' },
                { key: 'player3jump' },
                // { key: 'player4jump' },
                // { key: 'player5jump' },
                // { key: 'player6jump' },
                // { key: 'player7jump' },
                // { key: 'player8jump' },
                // { key: 'player9jump' },
                // { key: 'player10jump' }
            ],
            frameRate: 4
        });

        // Start player animation
        this.player.anims.play('run');
        this.player.setScale(1.5, 1.5);
        // checking for input
        this.input.keyboard.on("keydown", this.jump, this);

        this.score = 0;
        this.scoreText = this.add.text(10, 10, 'Score: ' + this.score, { fontSize: '32px', fill: '#fff' });

    }

    // the core of the script: platform are added from the pool or created on the fly
    addPlatform(platformWidth, posX){
        let platform;
        if(this.platformPool.getLength()){
            platform = this.platformPool.getFirst();
            platform.x = posX;
            platform.active = true;
            platform.visible = true;
            this.platformPool.remove(platform);
        }
        else{
            platform = this.physics.add.sprite(posX, this.game.config.height * 1, "platformGrass");
            platform.setImmovable(true);
            platform.setVelocityX(gameOptions.platformStartSpeed * -1);
            this.platformGroup.add(platform);
        }
        platform.displayWidth = platformWidth;
        this.nextPlatformDistance = Phaser.Math.Between(gameOptions.spawnRange[0], gameOptions.spawnRange[1]);
    }

    // the player jumps when on the ground, or once in the air as long as there are jumps left and the first jump was on the ground
    jump(){
        if(this.player.body.touching.down || (this.playerJumps > 0 && this.playerJumps < gameOptions.jumps)){
            if(this.player.body.touching.down){
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

    update(){
        // move background
        this.background.tilePositionX += BACKGROUND_SPEED;
        // add score
        this.score += 0.01;
        this.scoreText.setText('Score: ' +  Math.trunc(this.score));
        // game over
        if(this.player.y > this.game.config.height){
            this.scene.start("GameOverScene", {score: this.score, leaderboardPath: 'DODGE_HOLES'});
        }
        this.player.x = gameOptions.playerStartPosition;

        // recycling platforms
        let minDistance = this.game.config.width;
        this.platformGroup.getChildren().forEach(function(platform){
            let platformDistance = this.game.config.width - platform.x - platform.displayWidth / 2;
            minDistance = Math.min(minDistance, platformDistance);
            if(platform.x < - platform.displayWidth / 2){
                this.platformGroup.killAndHide(platform);
                this.platformGroup.remove(platform);
            }
        }, this);

        // adding new platforms
        if(minDistance > this.nextPlatformDistance){
            var nextPlatformWidth = Phaser.Math.Between(gameOptions.platformSizeRange[0], gameOptions.platformSizeRange[1]);
            this.addPlatform(nextPlatformWidth, this.game.config.width + nextPlatformWidth / 2);
        }

        this.player.x += 1;

    }
};