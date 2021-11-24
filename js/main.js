var gameOptions = {
    gameWidth:960,   // 1920/2
    gameHeight: 540, // 1080/2
    level1Width: 1280, //40 tiles x 32px
    level1Height: 800, //25 tiles x 32px
    heroGravity: 1000,
    heroSpeed: 105,
    heroJump: 345,
    isOnJump: false,
    onTriggerFloor: false,
    onCrouch: false,
    isAttacking: false,
    spearSpeed: 100

}

var zombie = {
    movingRight: false,
    zombieSpeed: 95,
    zombieGravity: 1000,
    currentTime: 0,
    maxTime: 60
}

var config = {
    type: Phaser.AUTO,
    width: gameOptions.gameWidth, 
    height: gameOptions.gameHeight, 
    scene: [level1], //Array con los niveles   
	render:{pixelArt:true}
    ,
	scale: {
        mode: Phaser.Scale.SHOW_ALL,
        width:gameOptions.gameWidth/2,
        height:gameOptions.gameHeight/2,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics:{
        default: 'arcade',
        arcade: {
            gravity: {y: gameOptions.heroGravity}
            //,debug: true
        }
    }
    

};

var juego = new Phaser.Game(config);