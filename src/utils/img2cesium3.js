import * as Cesium from "cesium";
export default function (obj) {
    let { lines, W, H, startX, startY, viewer } = obj



    lines.forEach(ele => {
        let array = []
        ele.forEach(e => {
            let cor = new Cesium.Cartesian2(e.w + startX, e.h + startY)
            let position = viewer.scene.pickPosition(cor)
            array.push(position)
        })
        drawline(array)

    });






    function drawline(array) {
        viewer.entities.add({
            polyline: {
                positions: array,
                width: 5,
                arcType: Cesium.ArcType.NONE,
                material: Cesium.Color.RED,
            },
        });

    }
}

