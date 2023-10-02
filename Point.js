class Point {
    static TYPE = 0;

    constructor(initialPosition, mass, id, G) {
        this.type = 0; // this parameter is overwritten by class extensions

        this.pos = initialPosition;
        this.vel = createVector();
        this.acc = createVector();

        this.mass = mass;
        // this.radius = massToRadius(mass);
        this.id = id;
        this.color = color(0, 100);

        this.am = new AccelerationModifier(this, G);
    }

    getId() {
        return this.id;
    }

    getPos() {
        return this.pos.copy();
    }

    getMass() {
        return this.mass;
    }

    getRadius() {
        return massToRadius(this.mass);
    }

    getResForce() {
        let rfc = this.acc.copy();
        rfc.mult(this.mass);
        return rfc;
    }

    interactWith(target, world) {
        this.am.modifyInteractionWith(target);
    }

    move() {
        this.vel.add(this.acc);
        let realVel = this.vel.copy().div(TPS);

        realVel = this.modifyMovement(realVel);

        this.pos.add(realVel);
    }

    modifyMovement(realVel) {
        // no changes by default
        return realVel;
    }

    getDistanceTo(target) {
        return target.pos.copy().sub(this.pos).mag();
    }

    getDistanceSqTo(target) {
        return (target.pos.x - this.pos.x) * (target.pos.x - this.pos.x) + (target.pos.y - this.pos.y) * (target.pos.y - this.pos.y);
    }

    draw(c) {
        if (!c) {
            c = this.color;
        }

        noStroke();
        fill(c);
        circle(this.pos.x, this.pos.y + 3.25, this.getRadius() * 2);
    }

    displayForce() {
        if (!displayForces)
            return;

        let f = this.getResForce().mult(100);
        stroke(255, 0, 0);
        strokeWeight(5);
        line(this.pos.x, this.pos.y, this.pos.x + f.x, this.pos.y + f.y);
        noStroke();
    }

    destroy() {

    }
}
