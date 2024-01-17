// Player sprites
import * as PIXI from "pixi.js";
import { GameSettings } from "../../../utils/settings";

const playerDown = PIXI.Texture.from('playerDown.png');
const playerUp = PIXI.Texture.from('playerUp.png');
const playerLeft = PIXI.Texture.from('playerLeft.png');
const playerRight = PIXI.Texture.from('playerRight.png');

// Player object
export class Player {
    constructor(sprite, speed) {
        this.sprite = sprite;
        this.speed = speed;
        this.velocity = {x:0, y:0};
    }

    update() {
        // going right
        if (this.velocity.x > 0) {
            this.sprite.texture = playerRight;
        }
        // going left
        else if (this.velocity.x < 0) {
            this.sprite.texture = playerLeft;
        }
        // going down
        else if (this.velocity.y > 0) {
            this.sprite.texture = playerDown;
        }
        // going up
        else if (this.velocity.y < 0) {
            this.sprite.texture = playerUp;
        }

        let x = this.sprite.x + this.velocity.x;
        let y = this.sprite.y + this.velocity.y;

        this.sprite.x = Math.min(Math.max(x, 0), GameSettings.gameWidth-64);
        this.sprite.y = Math.min(Math.max(y, 0), GameSettings.gameHeight-64);
    }

    freeze() {
        this.speed = 0;
    }

    unfreeze() {
        this.speed = GameSettings.playerDefaultSpeed;
    }
}