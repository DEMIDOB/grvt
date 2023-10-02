class LevelWorld extends World {
    constructor(G) {
        super(G);

        this.goal = createVector();
        this.goalRotationAngle = 0;
        this.followedPointId = 0;
        this.score = 0;
        this.massAvailable = 425;
        this.backgroundColor = color(255);

        this.createLevelPoint(createVector(width / 2, height / 2), 25);
        this.setRandomGoal(10);
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
            this.points[this.followedPointId].draw(color(0, 255, 0, 100));
        }

        // Draw the goal:
        if (this.isGameOn()) {
            fill(100, 0, 150);
            push();
            translate(
                max(-this.renderOffset.x, min(this.goal.x,  width - this.renderOffset.x)),
                max(-this.renderOffset.y, min(this.goal.y, height - this.renderOffset.y))
                );

            if (this.goal.x < -this.renderOffset.x || this.goal.x > width - this.renderOffset.x ||
                this.goal.y < -this.renderOffset.y || this.goal.y > height - this.renderOffset.y) {
                fill(255, 200);
                stroke(100, 0, 150);
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
        this.setRandomGoal();
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

    isGameOn() {
        return this.pointExists(this.followedPointId);
    }

    getMassAvailable() {
        return this.massAvailable;
    }

    setRandomGoal(scope = 3) {
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
                if (point.getDistanceSqTo(followedPoint) > ((point.getRadius() + followedPoint.getRadius()) * 2) ** 2) {
                    return;
                }
                point.destroy();
                let pointMassHalf = round(point.getMass() / 2);
                followedPoint.mass += pointMassHalf;
                this.massAvailable += pointMassHalf;
                this.points[point.getId()] = null;
            }
        });
    }
}
