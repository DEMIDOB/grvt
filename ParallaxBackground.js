class ParallaxBackground {
    constructor(layersTexturePaths, layersDistance = 2) {
        this.layersDistance = layersDistance;
        this.layers = [];

        layersTexturePaths.forEach(texturePath => {
            let texture = loadImage(texturePath);

            if (!texture) {
                console.log("Failed to load the texture", texturePath);
                return;
            }

            this.layers.push(texture);
        });
    }

    draw(offset) {
        if (!offset) {
            offset = createVector();
        }

        push();
        translate(-offset.x, -offset.y);

        console.log("=")
        for (let l = 0; l < this.layers.length; l++) {
            const texture = this.layers[l];
            let factor = (this.layers.length - l) * this.layersDistance;

            let layerOffset = createVector(offset.x, offset.y);
            layerOffset = layerOffset.div(factor);

            layerOffset.x += texture.width  * (Math.floor(-layerOffset.x / texture.width));
            layerOffset.y += texture.height * (Math.floor(-layerOffset.y / texture.height));
            // console.log(l, (Math.floor(-layerOffset.x / texture.width)))

            for (let xo = 0; xo < 2; ++xo) {
                for (let yo = 0; yo < 2; ++yo) {
                    image(texture, layerOffset.x + texture.width * xo, layerOffset.y + texture.height * yo);
                }
            }
        }
        console.log("=")

        pop();
    }
}