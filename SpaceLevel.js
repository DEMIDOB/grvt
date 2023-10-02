class SpaceLevel extends LevelWorld {
    constructor(G) {
        super(G);
        this.backgroundColor = color(0);

        this.pBackground = new ParallaxBackground(["spr_stars01.png", "spr_stars02.png"]);
    }

    drawBackground(offset) {
        // super.drawBackground();

        background(this.backgroundColor);
        this.pBackground.draw(this.renderOffset);
    }

    createLevelPoint(initialPosition, mass) {
        let newPointId = super.createLevelPoint(initialPosition, mass);

        if (newPointId + 1) {
            this.points[newPointId].color = color(255, 135);
        }
    }
}
