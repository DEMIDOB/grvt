class SpaceLevel extends LevelWorld {
    constructor(G) {
        super(G);
        this.backgroundColor = color(0);
        this.goalColor = color(150, 150, 0);
        this.playerColor = color(0, 0, 255, 100);

        this.pBackground = new ParallaxBackground(["https://dandemidov.com/spr_stars01.png", "https://dandemidov.com/spr_stars02.png"]);
    }

    drawBackground(offset) {
        // super.drawBackground();

        background(this.backgroundColor);
        this.pBackground.draw(this.renderOffset);
    }

    createSpaceship() {
        this.createLevelPoint(createVector(width / 2, height / 2), 75, "spaceship.png");
    }

    createRock(initialPosition, mass) {
        this.createLevelPoint(initialPosition, mass, "rock.png");
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
