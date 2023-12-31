class LevelWorld extends World {
    static PLAYER_STARTING_MASS = 25;
    static MASS_ABSORPTION_RATIO = 1/64;

    constructor(G) {
        super(G);

        this.goal = createVector();
        this.goalRotationAngle = 0;
        this.followedPointId = 0;
        this.score = 0;
        this.massAvailable = 425;

        this.backgroundColor = color(255);
        this.goalColor = color(100, 0, 150);
        this.playerColor = color(0, 255, 0, 100);

        this.massAbsorptionRatio = LevelWorld.MASS_ABSORPTION_RATIO;

        this.createLevelPoint(createVector(width / 2, height / 2), LevelWorld.PLAYER_STARTING_MASS);
        this.setRandomGoal();
    }

    getScore() {
        return this.score;
    }

    drawBackground() {
        background(this.backgroundColor);
        const step = 100;
        for (let x = step * (int) ((-this.renderOffset.x - (width / 2)) / step); x <= step * (int) ((-this.renderOffset.x + (width / 2)) / step); x += step) {
            for (let y = step * (int) ((-this.renderOffset.y - (height / 2)) / step); y <= step * (int) ((-this.renderOffset.y + (height / 2)) / step); y += step) {
                cross(x, y, step / 5);
            }
        }

        cross(0, 0, step);
    }

    draw() {
        super.draw();

        push();
        translate(this.renderOffset.x, this.renderOffset.y);

        if (this.isGameOn()) {
            this.points[this.followedPointId].displayForce();
            this.points[this.followedPointId].draw(this.playerColor);

            noFill();
            strokeWeight(3);
            stroke(200, 50);
            circle(this.points[this.followedPointId].pos.x, this.points[this.followedPointId].pos.y, this.points[this.followedPointId].getRadius() * 6);
        }

        // Draw the goal:
        if (this.isGameOn()) {
            fill(this.goalColor);
            noStroke();

            push();
            translate(
                max(-this.renderOffset.x, min(this.goal.x,  width - this.renderOffset.x)),
                max(-this.renderOffset.y, min(this.goal.y, height - this.renderOffset.y))
                );

            if (this.goal.x < -this.renderOffset.x || this.goal.x > width - this.renderOffset.x ||
                this.goal.y < -this.renderOffset.y || this.goal.y > height - this.renderOffset.y) {
                fill(this.backgroundColor, 200);
                stroke(this.goalColor);
            }

            rotate(this.goalRotationAngle);
            this.goalRotationAngle += 0.01;
            rect(-25, -25, 50, 50);
            pop();

            let player = this.points[0];
            if (player.getPos().sub(this.goal).magSq() < (25 + player.getRadius()) * (25 + player.getRadius())) {
                this.reachedTheGoal();
            }
        }

        if (this.isGameOn()) {
            let fp = this.points[this.followedPointId];
            this.renderOffset = fp.getPos();
            this.renderOffset.mult(-1);
            this.renderOffset.add(width / 2, height / 2);
        }

        if (borders.isActive()) {
            borders.draw();
        }

        pop();
    }

    reachedTheGoal() {
        this.massAvailable += 1000 * (++this.score);
        this.setRandomGoal(-1);
    }

    createLevelPoint(initialPosition, mass) {
        if (this.massAvailable < mass && !isGodMode) {
            return -1;
        }

        const newId = this.getNextPointId();
        const newPoint = new LevelPoint(initialPosition, mass, newId, this.G);
        this.points[newId] = newPoint;

        this.massAvailable -= mass;

        return newId;
    }

    getPlayerPoint() {
        if (!this.isGameOn()) {
            return null;
        }

        return this.points[this.followedPointId];
    }

    requestMassWithdrawal(mass) {
        let massDelta = -mass * this.massAbsorptionRatio;

        let player = this.getPlayerPoint();
        if (!player || player.getMass() + massDelta <= 0) {
            return false;
        }

        player.mass += massDelta;

        return true;
    }

    createEnemy(initialPosition, mass) {
        if (!this.requestMassWithdrawal(mass)) {
            return;
        }

        return this.createLevelPoint(initialPosition, mass);
    }

    isGameOn() {
        return this.pointExists(this.followedPointId);
    }

    getMassAvailable() {
        return this.massAvailable;
    }

    setRandomGoal(scope = 3) {
        if (borders && scope === -1) {
            console.log("YEE!");
            this.goal = createVector(random(borders.right - borders.left),
                                    random(borders.bottom - borders.top));
            this.goal = this.goal.add(borders.left, borders.top);
            return;
        }

        this.goal = createVector(random(width), random(height));
        if (this.isGameOn()) {
            this.goal = this.goal.sub(width / 2, height / 2);
            this.goal = this.goal.div(scope);
            this.goal = this.goal.add(width / 2, height / 2);
            // this.goal.add(this.points[this.followedPointId].getPos());
        }
    }

    followId(id) {
        if (this.pointExists(id)) {
            this.followedPointId = id;
        }
    }

    suckAll() {
        if (!this.isGameOn()) { return; }

        let followedPoint = this.points[this.followedPointId];

        this.points.forEach(point => {
            if (point && point.getId() !== this.followedPointId) {
                if (point.getDistanceSqTo(followedPoint) > (followedPoint.getRadius() * 3 + point.getRadius()) ** 2) {
                    return;
                }
                point.destroy();
                let playerMassDelta = round(point.getMass() * this.massAbsorptionRatio);
                followedPoint.mass += playerMassDelta;
                this.massAvailable += point.getMass() - playerMassDelta;
                this.points[point.getId()] = null;
            }
        });
    }
}
