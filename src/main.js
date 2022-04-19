
/*
   #--------------------POINTS BREAKDOWN -----------------------------
    High score
    New explosion animation 
    Timer showing remaining
    Super fancy skill to slow down the enemy speed with a smooth curve



*/
let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config);

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

let highscore = 0;

// reserve keyboard variables
let keyF, keyR, keyLEFT, keyRIGHT;
// # new features
let keyW, keyQ;



console.log(game.config.width);

