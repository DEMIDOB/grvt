class AccelerationModifier {
    constructor(parent, G) {
        this.parent = parent;
        this.G = G;
    }

    modifyInteractionWith(target) {
        let p_i = this.parent;
        let p_j = target;

        let i_to_j = p_j.pos.copy().sub(p_i.pos);
        let d = max(i_to_j.mag(), p_i.getRadius() + p_j.getRadius());
        let GOverDCubed = this.G / (d * d * d);

        let acc_i = i_to_j.copy().mult( GOverDCubed * p_j.mass);
        let acc_j = i_to_j.copy().mult(-GOverDCubed * p_i.mass);

        p_i.acc.add(acc_i);
        p_j.acc.add(acc_j);

        return [acc_i, acc_j];
    }
}

class FixedAccelerationModifier extends AccelerationModifier {
    constructor(parent, G) {
        super(parent, G);
    }

    modifyInteractionWith(target) {
        let deltas = super.modifyInteractionWith(target);

        let nullVector = createVector();
        let nullReturn = [nullVector, nullVector];

        let p_i = this.parent;
        let p_j = target;

        if (!p_i.isConnectedTo(p_j)) {
            return nullReturn;
        }

        let i_to_j = p_j.pos.copy().sub(p_i.pos);
        i_to_j.normalize();

        const connectionDeltaDistance = p_i.getConnectionDeltaDistance(p_j);
        if (connectionDeltaDistance > 1 && p_i.connectedTo[p_j.getId()] == WEAK_CONNECTION) {
            p_i.removeConnectionTo(p_j);
            return nullReturn;
        }

        let forceMag = K * connectionDeltaDistance;

        let force_i = i_to_j.mult(forceMag);
        let force_j = force_i.copy().mult(-1);

        p_i.acc.add(force_i.div(p_i.getMass()));
        p_j.acc.add(force_j.div(p_j.getMass()));
        return nullReturn;
    }
}
