class LevelPoint extends ConnectablePoint {
    // static TYPE should be inherited from ConnectablePoint because their behavior is identical

    modifyMovement(realVel) {
        if (borders.isActive()) {
            if (this.pos.x + realVel.x < borders.left + this.radius) {
                this.vel.x *= -friction;
            } else if (this.pos.x + realVel.x > borders.right - this.radius) {
                this.vel.x *= -friction;
            }

            if (this.pos.y + realVel.y < borders.top + this.radius) {
                this.vel.y *= -friction;
            } else if (this.pos.y + realVel.y > borders.bottom - this.radius) {
                this.vel.y *= -friction;
            }

            realVel = this.vel.copy().div(TPS);
        }

        return realVel;
    }
}