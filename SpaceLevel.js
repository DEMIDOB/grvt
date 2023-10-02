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
}
