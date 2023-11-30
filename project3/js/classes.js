class Ship extends PIXI.Sprite {
    constructor(x = 0, y = 0) {
        super (app.loader.resources["images/spaceship.png"].texture);
        this.anchor.set(.5,.5); //  position, scaling, rotating etc are now from center of sprite
        this.scale.set(0.1);
        this.x = x;
        this.y = y;
    }
}
// Circle will turn into basic enemy class 
// Subtypes of enemies will be created using this framework
class Circle extends PIXI.Graphics{
    constructor(radius, color=0xFF0000, x=0, y=0){
        super();
        this.beginFill(color);
        this.drawCircle(0,0,radius);
        this.endFill();
        this.x = x;
        this.y = y; 
        this.radius = radius;
        // Variables
        this.fwd = getRandomUnitVector();
        this.speed = 50;
        this.isAlive = true;
    }

    move(dt=1/60){
        this.x += this.fwd.x * this.speed * dt;
        this.y += this.fwd.y * this.speed * dt;
    }

    reflectX(){
        this.fwd.x *= -1;
    }

    reflectY(){
        this.fwd.y *= -1;
    }
}

// Change styling on bullets to look like lasers
class Bullet extends PIXI.Graphics{
    constructor(color=0xFFFFFF, x=0, y=0){
        super();
        this.beginFill(color);
        this.drawRect(-2,-3,4,6);
        this.endFill();
        this.x = x;
        this.y = y;
        // Variables
        this.fwd = {x:0,y:-1};
        this.speed = 400;
        this.isAlive = true;
        Object.seal(this);
    }

    move(dt=1/60){
        this.x += this.fwd.x * this.speed * dt;
        this.y += this.fwd.y * this.speed * dt;
    }
}

// New weapon will be made here (maybe bomb or lasr beam like Samus final smash)