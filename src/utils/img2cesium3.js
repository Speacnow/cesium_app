import * as Cesium from "cesium";
export default function (obj) {
    let { lines, W, H, startX, startY, viewer } = obj



    lines.forEach(ele => {
        let array = []
        tense_array(ele, 0).forEach(e => {
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
    // function tense_array(array, n) {
    //     let new_array = [];
    //     for (let i = 0; i < array.length - 1; i++) {
    //         let interval = (array[i + 1] - array[i]) / (n + 1)
    //         new_array.push(array[i])
    //         for (let j = 0; j < n; j++) {
    //             new_array.push(array[i] + interval * (j + 1))
    //         }
    //     }
    //     new_array.push(array[array.length - 1])
    //     return new_array
    // }
    function tense_array(ele, n) {
        let new_array = [];
        for (let i = 0; i < ele.length - 1; i++) {
            let interval_w = (ele[i + 1].w - ele[i].w) / (n + 1)
            let interval_h = (ele[i + 1].h - ele[i].h) / (n + 1)
            new_array.push(ele[i])
            for (let j = 0; j < n; j++) {
                let obj = {
                    w: ele[i].w + interval_w * (j + 1),
                    h: ele[i].h + interval_h * (j + 1)
                }
                new_array.push(obj)
            }
        }
        new_array.push(ele[ele.length - 1])
        return new_array
    }
}

