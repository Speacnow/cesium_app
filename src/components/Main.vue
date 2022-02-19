
<template>
    <div style=" position: fixed; bottom:0">
        <button id="btn1">截图</button>
        <button id="btn2">退出</button>
        <button id="btn3">视图</button>
        <select id="select">
            <option value="polygon">未开启图像细化</option>
            <option value="line">开启图像细化</option>
        </select>
        &nbsp;&nbsp;&nbsp;
        <input id="drawWidth" type="text" value="2" style="width:40px"/>
        &nbsp;&nbsp;&nbsp;
        <select id="selectDrawColor" >
            <option value="white">白色</option>
            <option value="black">黑色</option>
        </select>
        <button id="btn4">显示</button>
    </div>

    <el-container style="margin:0;padding:0">
        <el-header style="margin:0;padding:0">
            <el-col :span="19" :offset="1" id="col1">
                <em>野外地质露头数字云平台</em>
            </el-col>
            <el-col :span="3" :offset="1" id="col2">
                <!-- <span>新疆一间房三维模型</span> -->
                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            </el-col>

            <el-col :span="10" :offset="12" id="col2">用户：admin</el-col>
        </el-header>
        <div id="menu">
            <div class="gong">
                <img src="../assets/images/cl.png" alt /> &nbsp;量测⏷
            </div>
            <div class="gong">
                <img src="../assets/images/dw.png" alt /> &nbsp;模型标绘⏷
            </div>
            <div class="gong">
                <img src="../assets/images/cl.png" alt /> 空间分析⏷
            </div>
            <div class="gong">
                <img src="../assets/images/gjx.png" alt /> &nbsp;工具箱⏷
            </div>
            <div class="gong">
                <img src="../assets/images/kz.png" alt /> 裂缝识别
                <div class="up"></div>
            </div>
        </div>
        <div id="uparrow"></div>
        <div id="menu2">
            <div style="border-bottom:1px dashed black;margin-bottom:5px">
                <span style="font-size: smaller ;font-weight:bold">选择模型计算方式：</span>

                <el-radio-group v-model="radio1">
                    <el-radio :label="1" size="large">GPU模式</el-radio>
                    <el-radio :label="2" size="large">CPU模式&nbsp;&nbsp;&nbsp;&nbsp;</el-radio>
                </el-radio-group>
            </div>
            <div style="border-bottom:1px dashed black;margin-bottom:5px">
                <span style="font-size: smaller ;font-weight:bold">选择裂缝可视化方式：</span>

                <el-radio-group v-model="radio2">
                    <el-radio :label="3" size="large">逐像素点可视化</el-radio>
                    <el-radio :label="4" size="large">邻点连接可视化</el-radio>
                    <el-radio :label="5" size="large">裂缝中轴线可视化</el-radio>
                </el-radio-group>
            </div>
            <el-button id="con111" style="font-size: smaller ;font-weight:bold">确定</el-button>
        </div>
        <el-main style="margin:0;padding:0">
            <div id="cesiumContainer" style="width:100%;height:100%;margin:0;padding:0"></div>
        </el-main>
    </el-container>
</template>
<script setup>
import { onMounted } from 'vue'
import * as Cesium from "cesium";
// import tfjsFracRec from '../utils/tfjsFracRec'
import screenshots from '../utils/screenshots'
import { ArrowDown } from '@element-plus/icons-vue'
import { ref } from 'vue'

// import * as tf from '@tensorflow/tfjs'
const radio1 = ref('1')
const radio2 = ref('3')


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
        // url: '/text_3dtile/tileset.json',
        url: "http://111.229.182.114:8090/datong/lingshandao3D/tileset.json",
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
    document.getElementById('con111').onclick = function () {
        document.getElementById('menu2').style.display = 'none';
        document.getElementById('uparrow').style.display = 'none';
    }









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
/* .el-main{
    margin:0%;
    padding:0%
} */
.el-header {
    background: rgb(0, 10, 27);
}
#col1 {
    font-size: xx-large;
    color: aliceblue;
    font-weight: bolder;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
}
#col2 {
    font-size: small;
    color: aliceblue;

    position: relative;
    top: 50%;
    transform: translateY(0%);
}
#menu {
    position: fixed;
    top: 80px;
    right: 110px;
    width: 500px;
    height: 40px;

    background: white;
    z-index: 100;
    border-radius: 2px;
    display: flex;
    justify-content: space-around;
    align-items: center;
}
.gong {
    height: 100%;
    width: 20%;
    display: flex;
    justify-content: center;
    align-items: center;
}

#menu2 {
    padding: 10px;
    position: fixed;
    top: 133px;
    right: 110px;
    width: 210px;
    height: 240px;

    background: white;
    z-index: 100;
    border-radius: 5px;
    /* display: flex;
    justify-content: space-around;
    align-items: center; */
}
#uparrow {
    position: fixed;
    top: 113px;
    right: 148px;
    width: 0px;
    height: 0px;
    background: black;
    z-index: 99;

    border-top: 10px solid rgb(178, 161, 153);
    border-right: 10px solid rgb(178, 161, 153);

    border-left: 10px solid rgb(178, 161, 153);
    border-bottom: 10px solid white;
}
.up {
    width: 0px;
    height: 0px;

    border-top: 5px solid white;
    border-right: 5px solid white;

    border-left: 5px solid white;
    border-bottom: 5px solid black;
}
</style>
