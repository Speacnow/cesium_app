
<template>
    <button id="btn1">截图</button>
    <button id="btn2">退出</button>
    <button id="btn3">视图</button>
    <select id="select">
        <option value="polygon">未开启图像细化</option>
        <option value="line">开启图像细化</option>
    </select>
    <div id="cesiumContainer"></div>
</template>
<script setup>
import { onMounted } from 'vue'
import * as Cesium from "cesium";
// import tfjsFracRec from '../utils/tfjsFracRec'
import screenshots from '../utils/screenshots'

// import * as tf from '@tensorflow/tfjs'

onMounted(() => {
    
    
    const viewer = new Cesium.Viewer('cesiumContainer', {
        animation: false,    //左下角的动画仪表盘
        baseLayerPicker: false,  //右上角的图层选择按钮
        geocoder: false,  //搜索框
        homeButton: false,  //home按钮
        sceneModePicker: false, //模式切换按钮
        timeline: false,    //底部的时间轴
        navigationHelpButton: false,  //右上角的帮助按钮，
        fullscreenButton: false,   //右下角的全屏按钮
        contextOptions: {
            webgl: {
                preserveDrawingBuffer: true,
            }
        }
    });
    document.getElementsByClassName('cesium-viewer-bottom')?.[0].parentNode.removeChild(document.getElementsByClassName('cesium-viewer-bottom')?.[0]);
    let palaceTileset = new Cesium.Cesium3DTileset({
        url: '/text_3dtile/tileset.json',
        maximumScreenSpaceError: 2,//最大的屏幕空间误差
        maximumNumberOfLoadedTiles: 1000//最大加载瓦片个数

        //或者url: 'http://ip:port/www/DAEPalace/tileset.json'
    })
    let tileset = viewer.scene.primitives.add(palaceTileset);

    viewer.zoomTo(tileset)
    document.getElementById('btn3').onclick = function () {
        viewer.zoomTo(tileset)
    }
    //加载截图功能
    screenshots(viewer);
    // var myWorker = new Worker('/worker.js');
    // myWorker.postMessage('来自外部的数据');

    // myWorker.onmessage = function (e) {
    //     console.log("来自内部的数据：",e.data);
    // }







});
</script>

<style scoped>
#cesiumContainer {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
}
.active_canvas {
    background: green;
    position: absolute;
    opacity: 0.5;
    cursor: move;
}
.box_canvas {
    background: green;
    position: absolute;
    opacity: 1;
    cursor: move;
}
</style>
