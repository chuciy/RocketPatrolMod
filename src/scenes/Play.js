class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
        this.load.image('particle', './assets/particle.png');
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        this.load.spritesheet('explosion_decay', './assets/explosion_decay.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 8});
        this.load.spritesheet('explosion_1', './assets/explosion_1.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 7});

        this.anime_list = ['explode', 'explode_decay','explode_1'];
    }

    create() {
        //particle
        this.particles = this.add.particles('particle');
        //

        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);

        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        // orange UI
        this.add.rectangle(20 * borderPadding, borderUISize + 2 * borderPadding, 
            game.config.width / 5, borderUISize * 1.5, 0xEEEE00).setOrigin(0, 0);
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);
        // add Rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);

        // add Spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4                  , 'spaceship', 0, 30, 1).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20, 1.1).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width                 , borderUISize*6 + borderPadding*4, 'spaceship', 0, 10, 1.2).setOrigin(0,0);

        this.ship04 = new Spaceship(this, game.config.width                 , borderUISize*7 + borderPadding*6, 'spaceship', 0, 51, 1.75).setOrigin(0,0);


        // # particle
        this.particles = this.add.particles('particle');
        this.emitter = this.particles.createEmitter();
        this.emitter.setSpeed(100);
        this.emitter.setBlendMode(Phaser.BlendModes.ADD);
        this.emitter.setLifespan(800);
        //
        


        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        // more keys
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });
        this.anims.create({
            key: 'explode_decay',
            frames: this.anims.generateFrameNumbers('explosion_decay', { start: 0, end: 8, first: 0}),
            frameRate: 30
        });
        this.anims.create({
            key: 'explode_1',
            frames: this.anims.generateFrameNumbers('explosion_1', { start: 0, end: 7, first: 0}),
            frameRate: 30
        });


        

        // initialize score
        this.p1Score = 0;

        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        // #text
        this.scoreRight = this.add.text(game.config.width - scoreConfig.fixedWidth - borderUISize - borderPadding, 
            borderUISize + borderPadding*2, highscore, scoreConfig);
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);
        this.timer_text = this.add.text(32, 32);
        this.debugging_text = this.add.text(32, 400);
        this.debugging_text.setText("Enemy speed: 1.0");




        // GAME OVER flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← to Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
            // # update high score
            highscore = Math.max(highscore, this.p1Score);
            this.scoreRight = highscore;

        }, null, this);

        // more features
        this.skill_cd = false;

    }


    update() {
        // check key input for restart / menu
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        this.starfield.tilePositionX -= 4;  // update tile sprite

        if(!this.gameOver) {
            //timer
            this.timer_text.setText('Time remaining: ' + this.clock.getRemainingSeconds().toString().substr(0, 4));

            // # Super fancy Time freeze skill
            if(!this.skill_cd && Phaser.Input.Keyboard.JustDown(keyW)) {


                this.sound.play('random1');
                this.skill_cd = true;
                this.skill_timer = this.time.delayedCall(3000, () => {
                    this.skill_cd = false;
                    this.ship01.moveSpeed = game.settings.spaceshipSpeed;
                    this.ship02.moveSpeed = game.settings.spaceshipSpeed;
                    this.ship03.moveSpeed = game.settings.spaceshipSpeed;
                    this.ship04.moveSpeed = game.settings.spaceshipSpeed;

                    this.debugging_text.setText("Enemy speed: 1.0");
                }, null, this);
            }

            if(this.skill_cd){
                let acc_ratio = Math.sin(this.skill_timer.getProgress() * Math.PI + Math.PI) + 1;
                this.debugging_text.setText("Enemy speed: " + acc_ratio.toString().substr(0, 4));
                this.ship01.moveSpeed = this.ship01.origin_speed * acc_ratio;
                this.ship02.moveSpeed = this.ship02.origin_speed * acc_ratio;
                this.ship03.moveSpeed = this.ship03.origin_speed * acc_ratio;
                this.ship04.moveSpeed = this.ship04.origin_speed * acc_ratio;

            }
            // ----------------------




            this.p1Rocket.update();             // update p1
            this.ship01.update();               // update spaceship (x3)
            this.ship02.update();
            this.ship03.update();
            this.ship04.update();
        }

        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.shipExplode(this.ship03);
            this.p1Rocket.reset();
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.shipExplode(this.ship02);
            this.p1Rocket.reset();
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.shipExplode(this.ship01);
            this.p1Rocket.reset();
        }

        if (this.checkCollision(this.p1Rocket, this.ship04)) {
            this.shipExplode(this.ship04);
            this.p1Rocket.reset();
        }



    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {

        // particle
        this.emitter.explode(100, this.p1Rocket.x, this.p1Rocket.y);
        // temporarily hide ship
        ship.alpha = 0;                         
        // create explosion sprite at ship's position
        // random choice
        let idx = Math.floor(Math.random() * 3);
        let boom = this.add.sprite(ship.x, ship.y, this.anime_list[idx]).setOrigin(0, 0);
        boom.anims.play(this.anime_list[idx]);             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
            ship.reset();                         // reset ship position
            ship.alpha = 1;                       // make ship visible again
            boom.destroy();                       // remove explosion sprite
        });
        // score add and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        this.clock.delay += 2000;
        
        this.sound.play('sfx_explosion');
      }
}