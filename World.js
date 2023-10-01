const MAX_POINTS_AMOUNT = 1024;
let g = 0;

class World {
    // private float G;
    // protected Point[] points;

    // protected PVector renderOffset;
    //private ArrayList<Connection> connections;

    constructor(G) {
        this.G = G;
        this.points = Array.apply(null, Array(MAX_POINTS_AMOUNT)).map(function () {});
        this.renderOffset = createVector();

        // for (let i = 0; i < MAX_POINTS_AMOUNT; ++i) {
        //     points[i] = null;
        // }
    }

    pointExists(id) {
        return id >= 0 && id < MAX_POINTS_AMOUNT && this.points[id] != null;
    }

    getNextPointId() {
        for (let i = 0; i < MAX_POINTS_AMOUNT; ++i) {
            if (this.points[i] == null) {
                return i;
            }
        }

        return 0;
    }

    getPointsAmount() {
        let ans = 0;
        this.points.forEach(el => {
            if (el != null) {
                ++ans;
            }
        });
        return ans;
    }

    createPoint(initialPosition, mass) {
        const newId = this.getNextPointId();
        const newPoint = new Point(initialPosition, mass, newId, this.G);
        this.points[newId] = newPoint;
        return newId;
    }

    createConnectablePoint(initialPosition, mass) {
        const newId = this.getNextPointId();
        const newPoint = new ConnectablePoint(initialPosition, mass, newId, this.G);
        this.points[newId] = newPoint;
        return newId;
    }

    removePoint(point) {
        if (!point || !point.id || !this.pointExists(point.id)) return;

        if (this.points[point.id].type == ConnectablePoint.TYPE) {
            
        }
    }

    tick() {
        this.points.forEach(p => {
            if (p == null) return;
            p.acc = createVector();
        });

        for (let i = 0; i < MAX_POINTS_AMOUNT; ++i) {
            for (let j = i + 1; j < MAX_POINTS_AMOUNT; ++j) {
                if (!this.pointExists(i) || !this.pointExists(j)) continue;
                this.points[i].interactWith(this.points[j], this);
            }
        }

        this.points.forEach(p => {
            if (p == null) return;
            p.acc.add(0, g);
        });

        this.points.forEach(p => {
            if (p == null) return;
            p.move();
        });
    }

    draw() {
        push();

        translate(this.renderOffset.x, this.renderOffset.y);

        const step = 100;
        for (let x = step * (int) ((-this.renderOffset.x - (width / 2)) / step); x <= step * (int) ((-this.renderOffset.x + (width / 2)) / step); x += step) {
            for (let y = step * (int) ((-this.renderOffset.y - (height / 2)) / step); y <= step * (int) ((-this.renderOffset.y + (height / 2)) / step); y += step) {
                cross(x, y, step / 5);
            }
        }

        cross(0, 0, step);

        this.points.forEach(p => {
            if (p == null) return;
            p.draw();
        });

        pop();
    }

    requestConnection(id1, id2, connectionType) {
        try {
            let p1 = this.points[id1];
            let p2 = this.points[id2];

            if (p1 == null || p2 == null || !(p1.type === ConnectablePoint.TYPE && p1.type === p2.type))
                return false;

            p1.connectTo(p2, connectionType);
        } catch (exc) {
            println("Failed to establish connection:", exc);
            return false;
        }

        return true;
    }

    offsetRenderBy(x, y) {
        this.renderOffset.add(x, y);
    }

    getRenderOffset() {
        return this.renderOffset.copy();
    }

    setRenderOffset(to) {
        this.renderOffset.set(to);
    }
}
