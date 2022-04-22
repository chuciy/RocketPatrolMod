// Rocket prefab
class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);   // add to existing, displayList, updateList
        this.isFiring = false;      // track rocket's firing status
        this.moveSpeed = 2;         // pixels per frame
        this.sfxRocket = scene.sound.add('sfx_rocket');  // add rocket sfx
        this.sfx1 = scene.sound.add('random1');

        // more features

        this.skill_cd = 180;
    }

    update() {
        //


        if(!this.isFiring) {
            if(keyLEFT.isDown && this.x >= borderUISize + this.width) {
                this.x -= this.moveSpeed;
            } else if (keyRIGHT.isDown && this.x <= game.config.width - borderUISize - this.width) {
                this.x += this.moveSpeed;
            }
        }else{
            if(keyQ.isDown && this.x >= borderUISize + this.width && !keyE.isDown) {
                this.x -= 0.3 * this.moveSpeed;
                this.y -= 0.2 * this.moveSpeed;
            } else if (keyE.isDown && this.x <= game.config.width - borderUISize - this.width && !keyQ.isDown) {
                this.x += 0.3 * this.moveSpeed;
                this.y -= 0.2 * this.moveSpeed;
            }

        }

        // fire button
        if(Phaser.Input.Keyboard.JustDown(keyF) && !this.isFiring) {
            this.isFiring = true;
            this.sfxRocket.play();
        }
        // if fired, move up
        if(this.isFiring && this.y >= borderUISize * 3 + borderPadding) {
            this.y -= this.moveSpeed;
        }
        // reset on miss
        if(this.y <= borderUISize * 3 + borderPadding) {
            this.reset();
        }
    }

    // reset rocket to "ground"
    reset() {
        this.isFiring = false;
        this.y = game.config.height - borderUISize - borderPadding;
    }
}
