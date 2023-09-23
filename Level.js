class LevelWorld extends World {

    // private PVector goal;
    // private float goalRotationAngle = 0;

    // private int followedPointId = 0;

    // private int score;

    constructor(G) {
        super(G);

        this.goal = createVector();
        this.goalRotationAngle = 0;
        this.followedPointId = 0;
        this.score = 0;

        this.setRandomGoal();
        this.createConnectablePoint(createVector(width / 2, height / 2), 25);
    }

    getScore() {
        return this.score;
    }

    draw() {
        super.draw();

        push();
        translate(this.renderOffset.x, this.renderOffset.y);

        if (this.pointExists(this.followedPointId)) {
            this.points[this.followedPointId].displayForce();
            this.points[this.followedPointId].draw(color(0, 255, 0, 100));
        }

        // Draw the goal:
        if (this.pointExists(0)) {
            fill(100, 0, 150);
            push();
            translate(this.goal.x, this.goal.y);
            rotate(this.goalRotationAngle);
            this.goalRotationAngle += 0.01;
            rect(-25, -25, 50, 50);
            pop();

            let player = this.points[0];
            if (player.getPos().sub(this.goal).magSq() < (25 + player.getRadius()) * (25 + player.getRadius())) {
                ++this.score;
                this.setRandomGoal();
            }
        }

        if (this.pointExists(this.followedPointId)) {
            let fp = this.points[this.followedPointId];
            this.renderOffset = fp.getPos();
            this.renderOffset.mult(-1);
            this.renderOffset.add(width / 2, height / 2);
        }

        pop();
    }

    setRandomGoal() {
        this.goal = createVector(random(width), random(height));
        if (this.pointExists(this.followedPointId)) {
            this.goal.sub(width / 2, height / 2);
            this.goal.add(this.points[this.followedPointId].getPos());
        }
    }

    followId(id) {
        if (this.pointExists(id)) {
            this.followedPointId = id;
        }
    }
}
