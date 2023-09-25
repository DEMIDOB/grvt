function requestNewPointMass() {
    try {
        let newPointMassParsed = parseInt(prompt("New points' mass will be..."));
        if (isNaN(newPointMassParsed) || newPointMassParsed < 1) {
            console.log("Wrong number format!");
            return;
        }
        newPointMass = newPointMassParsed;
    } catch (exc) {
        alert("Wrong number format!");
    }
}

function requestNew_g() {
    try {
        g = parseInt(prompt("New g:"));
    } catch (exc) {
        alert("Wrong number format!");
        requestNew_g();
    }
}

function requestNewConnectionsUI() {
    let newConnectionsStr = prompt("New connections:");

    let p_i, p_j;

    newConnectionsStr.split(";").forEach(newConnectionStr => {
        let toConnect = newConnectionStr.split(" ");
        for (let i = 0; i < toConnect.length; ++i) {

            let idStr_i = toConnect[i];
            try {
                let id_i = parseInt(idStr_i);

                if (!w.pointExists(id_i) || w.points[id_i].type != ConnectablePoint.TYPE)
                    continue;

                p_i = w.points[id_i];
            } catch (exc) {
                println("Wrong number format: " + idStr_i);
                continue;
            }

            for (let j = i; j < toConnect.length; ++j) {
                let idStr_j = toConnect[j];
                try {
                    let id_j = parseInt(idStr_j);

                    if (!w.pointExists(id_j) || w.points[id_j].type != ConnectablePoint.TYPE)
                        continue;

                    p_j = w.points[id_j];
                } catch (exc) {
                    println("Wrong number format: " + idStr_j);
                    continue;
                }

                p_i.connectTo(p_j, STRONG_CONNECTION);
            }
        }
    });
}

function cross(x, y, boxSize) {
    let halfBoxSize = boxSize / 2;

    stroke(100, 100, 255, 50);
    strokeWeight(3);
    line(x + width / 2 - halfBoxSize, y + height / 2, x + width / 2 + halfBoxSize, y + height / 2);
    line(x + width / 2, y + height / 2 - halfBoxSize, x + width / 2, y + height / 2 + halfBoxSize);
}

function massToRadius(mass) {
    return log(mass * mass) + 10;
}
