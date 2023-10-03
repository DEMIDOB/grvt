class LevelPoint extends ConnectablePoint {
    // static TYPE should be inherited from ConnectablePoint because their behavior is identical
    constructor(initialPosition, mass, id, G, texturePath = null) {
        super(initialPosition, mass, id, G);
        this.texture = null;
        this.texturePath = texturePath;
        this.applyTexture(texturePath);
    }

    applyTexture(texturePath) {
        if (texturePath && !texturePath.startsWith("http")) {
            texturePath = "https://dandemidov.com/" + texturePath;
        }
        this.texturePath = texturePath;
        this.loadTexture();
    }

    loadTexture() {
        if (this.texturePath) {
            this.texture = loadImage(this.texturePath);
        }
    }

    modifyMovement(realVel) {
        if (borders.isActive()) {
            if (this.pos.x + realVel.x < borders.left +this.getRadius()) {
                this.vel.x *= -friction;
            } else if (this.pos.x + realVel.x > borders.right -this.getRadius()) {
                this.vel.x *= -friction;
            }

            if (this.pos.y + realVel.y < borders.top +this.getRadius()) {
                this.vel.y *= -friction;
            } else if (this.pos.y + realVel.y > borders.bottom -this.getRadius()) {
                this.vel.y *= -friction;
            }

            realVel = this.vel.copy().div(TPS);
        }

        return realVel;
    }

    draw() {
        if (!this.texture) {
            super.draw();
            return;
        }

        // calculate the rotation angle based on the point's velocity vector
        let angle = Math.atan2(this.vel.y, this.vel.x);
        let size = this.getRadius() * 2;

        push();

        translate(this.pos.x, this.pos.y);
        rotate(Math.PI / 2 + angle);
        imageMode(CENTER);
        image(this.texture, 0, 0, size, size);

        pop();
    }

    destroy() {
        super.destroy()

        this.connectedTo.forEach(point => {
            if (point) {
                this.removeConnectionTo(point);
            }
        });
    }
}