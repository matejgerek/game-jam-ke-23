import GameScene from './scenes/GameScene.js'
import GameJumpingUpScene from './scenes/GameJumpingUpScene.js'
import LeaderboardScene from "./scenes/LeaderboardScene.js";
import TitleScene from "./scenes/TitleScene.js";
import GameOverScene from "./scenes/GameOverScene.js";
import GameMenuScene from "./scenes/GameMenuScene.js";

// object containing configuration options
let gameConfig = {
    type: Phaser.AUTO,
    width: 1334,
    height: 750,
    backgroundColor: '0x444444',

    // physics settings
    physics: {
        default: "arcade"
    }
}
const game = new Phaser.Game(gameConfig);
window.focus();
resize();
window.addEventListener("resize", resize, false);

let gameScene = new GameScene(game);
const leaderboardScene = new LeaderboardScene();
const titleScene = new TitleScene();
const gameMenuScene = new GameMenuScene();
const gameOverScene = new GameOverScene();
const gameJumpingUpScene = new GameJumpingUpScene();

// load scenes
game.scene.add('TitleScene', titleScene);
game.scene.add('LeaderboardScene', leaderboardScene);
game.scene.add('GameMenuScene', gameMenuScene);
game.scene.add('GameScene', gameScene);
game.scene.add('GameOverScene', gameOverScene);
game.scene.add('GameJumpingUpScene', gameJumpingUpScene);

// start title
game.scene.start('TitleScene');

function resize(){
    let canvas = document.querySelector("canvas");
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    let windowRatio = windowWidth / windowHeight;
    let gameRatio = game.config.width / game.config.height;
    if(windowRatio < gameRatio){
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    }
    else{
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
}