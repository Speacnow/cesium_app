import * as Cesium from "cesium";
export default function (obj) {
    let { data, canvas, startX, startY, viewer } = obj

    let cw = canvas.width
    const t1 = new Date();
    data.forEach((e, i) => {
        if (e == 1) {
            let ew = i % cw + startX;
            let eh = Math.floor(i / cw) + startY
            let cor = new Cesium.Cartesian2(ew, eh)
            let position = viewer.scene.pickPosition(cor)
            viewer.entities.add({
                position: position,
                point: {
                    pixelSize: 5,
                    color: Cesium.Color.RED,
                    //heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                },
            });

        }

    });
    const t2 = new Date();
    console.log('3D drawing take time: ', (t2 - t1), 'ms');


}