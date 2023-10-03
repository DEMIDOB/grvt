class SpaceLevel extends LevelWorld {
    constructor(G) {
        super(G);
        this.backgroundColor = color(0);
        this.goalColor = color(150, 150, 0);
        this.playerColor = color(0, 0, 255, 100);

        this.createSpaceship();
        this.massAvailable = 400;

        this.pBackground = new ParallaxBackground(["https://dandemidov.com/spr_stars01.png", "https://dandemidov.com/spr_stars02.png"]);
    }

    drawBackground(offset) {
        // super.drawBackground();

        background(this.backgroundColor);
        this.pBackground.draw(this.renderOffset);
    }

    createSpaceship() {
        if (this.pointExists(0)) {
            this.removePoint(this.points[0]);
        }
        return this.createLevelPoint(createVector(width / 2, height / 2), 150, "spaceship.png");
    }

    createRock(initialPosition, mass) {
        return this.createLevelPoint(initialPosition, mass, "rock.png");
    }

    createEnemy(initialPosition, mass) {
        if (!this.requestMassWithdrawal(mass)) {
            return;
        }

        return this.createRock(initialPosition, mass);
    }

    createLevelPoint(initialPosition, mass, texturePath = null) {
        let newPointId = super.createLevelPoint(initialPosition, mass);

        if (newPointId + 1) {
            this.points[newPointId].color = color(183, 135);
            if (texturePath) {
                this.points[newPointId].applyTexture(texturePath);
            }
        }
    }
}
