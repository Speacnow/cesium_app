import * as Cesium from "cesium";
export default function (obj) {
    let { data, W, H, startX, startY, viewer } = obj


    const t1 = new Date();
    //先横着绘制
    let count = 0;
    //初始化
    let is_connecting = false;
    let array = []
    for (let i = 0; i < H; i++) {
        for (let j = 0; j < W; j++) {
            if (data[count] == 1) {
                if (is_connecting == false) {
                    //绘制之前的
                    drawline(array)
                    array = []
                    is_connecting = true;
                }
                let cor = new Cesium.Cartesian2(j + startX + 1, i + startY + 1)
                let position = viewer.scene.pickPosition(cor)
                array.push(position)
            }
            else {
                is_connecting = false;
            }
            count++
        }
        drawline(array)
        array = []
        is_connecting = false;
    }
    //竖着绘制

    //初始化
    let is_connecting2 = false;
    let array2 = []
    for (let i = 0; i < W; i++) {
        for (let j = 0; j < H; j++) {
            if (data[j * W + i] == 1) {
                if (is_connecting2 == false) {
                    //绘制之前的
                    drawline(array2)
                    array2 = []
                    is_connecting2 = true;
                }
                let cor = new Cesium.Cartesian2(i + startX + 1, j + startY + 1)
                let position = viewer.scene.pickPosition(cor)
                array2.push(position)
            }
            else {
                is_connecting2 = false;
            }

        }
        drawline(array2)
        array2 = []
        is_connecting2 = false;
    }


    const t2 = new Date();
    console.log('mesh drawing take time: ', (t2 - t1), 'ms');
    function drawline(array) {
        viewer.entities.add({
            polyline: {
                positions: array,
                width: 2,
                arcType: Cesium.ArcType.NONE,
                material: Cesium.Color.RED,
            },
        });
        // polylines.add({
        //     positions: array,
        //     width: 3,
        //     color: Cesium.Color.RED,
        // });
    }
}

