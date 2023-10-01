class Borders {
    constructor(left, top, right, bottom, bordersColor = color(255, 0, 0)) {
        this.left = left
        this.top = top
        this.right = right
        this.bottom = bottom

        this.bordersWidth = right - left
        this.bordersHeight = bottom - top

        this.active = true

        this.bordersColor = bordersColor
    }

    toggleActive() {
        this.active = !this.active;
    }

    isActive() {
        return this.active;
    }

    draw() {
        stroke(255, 0, 0);
        strokeWeight(3);
        fill(0, 0);
        rect(this.left, this.top, this.bordersWidth, this.bordersHeight);
    }
}
