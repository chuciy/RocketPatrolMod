
/*
   #--------------------POINTS BREAKDOWN -----------------------------
    5 High score
    10 New explosion animation 
    10 Timer showing remaining

    //weapon 1
    20 Super fancy skill to slow down the enemy speed with a smooth curve (press W)
    //weapon 2
    Press Q/E to slightly redirect to left/right while firing, and get speedup


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
let keyW, keyQ, keyE;



console.log(game.config.width);

