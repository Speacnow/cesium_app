import * as Cesium from "cesium";
export default function (obj) {
    let { data, width, startX, startY, viewer } = obj

    let cw = width
    const t1 = new Date();
    let points = viewer.scene.primitives.add(
        new Cesium.PointPrimitiveCollection({
            modelMatrix: Cesium.Matrix4.IDENTITY,
            //debugShowBoundingVolume: false,
            // OPAQUE 完全不透明；TRANSLUCENT 完全透明；OPAQUE_AND_TRANSLUCENT 不透明和半透明
            blendOption: Cesium.BlendOption.TRANSLUCENT,
        })
    );
    data.forEach((e, i) => {
        if (e == 1) {
            let ew = (i + 1) % cw + startX;
            let eh = Math.ceil((i+1) / cw) + startY
            let cor = new Cesium.Cartesian2(ew, eh)
            let position = viewer.scene.pickPosition(cor)
            points.add({
                position: position,
                pixelSize: 3,
                color: Cesium.Color.RED,
            });

        }

    });
    const t2 = new Date();
    console.log('3D drawing take time: ', (t2 - t1), 'ms');


}