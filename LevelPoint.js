class LevelPoint extends ConnectablePoint {
    // static TYPE should be inherited from ConnectablePoint because their behavior is identical

    modifyMovement(realVel) {
        if (borders) {
            if (this.pos.x + realVel.x < this.radius) {
                this.vel.x *= -friction;
            } else if (this.pos.x + realVel.x > width - this.radius) {
                this.vel.x *= -friction;
            }

            if (this.pos.y + realVel.y < this.radius) {
                this.vel.y *= -friction;
            } else if (this.pos.y + realVel.y > height - this.radius) {
                this.vel.y *= -friction;
            }

            realVel = this.vel.copy().div(TPS);
        }

        return realVel;
    }
}