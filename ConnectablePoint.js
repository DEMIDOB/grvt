const NO_CONNECTION = 0, STRONG_CONNECTION = 1, WEAK_CONNECTION = 2;

class ConnectablePoint extends Point {
     static TYPE = 1;

    // let connectedTo;
    // private float[] connectionRestDistances;

    constructor(initialPosition, mass, id, G) {
        super(initialPosition, mass, id, G);

        this.connectedTo = Array.apply(0, Array(MAX_POINTS_AMOUNT)).map(function () { return 0; });
        this.connectionRestDistances = Array.apply(0, Array(MAX_POINTS_AMOUNT)).map(function () { return 0; });
        this.type = ConnectablePoint.TYPE;

        this.am = new FixedAccelerationModifier(this, G);
    }

    interactWith(target, world) {
        super.interactWith(target, world);
        if (target.type == this.type && !this.isConnectedTo(target) && this.getDistanceSqTo(target) < (this.getRadius() + target.getRadius()) * (this.getRadius() + target.getRadius())) {
            this.connectTo(target, WEAK_CONNECTION);
        }
    }

    isConnectedTo(target) {
        return this.connectedTo[target.getId()] != NO_CONNECTION;
    }

    getConnectionDeltaDistance(target) {
        if (!this.isConnectedTo(target)) {
            return -1;
        }

        let dist = this.getDistanceTo(target);
        let delta = dist - this.connectionRestDistances[target.getId()];

        return delta;
    }

    connectTo(target, connectionType) {
        if (this.isConnectedTo(target)) {
            return;
        }

        this.connectedTo[target.getId()] = connectionType;
        this.connectionRestDistances[target.getId()] = this.getDistanceTo(target);

        if (!target.isConnectedTo(this)) {
            target.connectTo(this, connectionType);
        }
    }

    removeConnectionTo(target) {
        this.connectedTo[target.getId()] = NO_CONNECTION;

        if (target.isConnectedTo(this)) {
            target.removeConnectionTo(this);
        }
    }
}
