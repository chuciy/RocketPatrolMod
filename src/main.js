
/*
   #--------------------POINTS BREAKDOWN -----------------------------
    5 High score
    5 Press Q/E to slightly redirect to left/right while firing, and get speedup
    10 New explosion animation 
    10 Timer showing remaining
    10 new explosion SFX and randomize which one plays on impact

    //weapon 1
    20 Super fancy skill to slow down the enemy speed with a smooth curve (press W)
    20 add 2s for each hit
    

    20 particle effect for hit

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

