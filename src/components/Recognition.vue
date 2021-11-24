<template>
    <canvas id="myCanvas" width="256" height="256" style="width:256px;height:256px"></canvas>
    <canvas id="toCanvas" width="256" height="256" style="width:256px;height:256px;background:red"></canvas>
</template>

<script setup>
import { onMounted } from 'vue'
import * as tf from '@tensorflow/tfjs'
onMounted(() => {
    const MODEL_URL = '/v7/model.json';
    let model = null;

    (async () => {
        model = await tf.loadGraphModel(MODEL_URL);
        //model.summary()
        let myImage = new Image(256, 256);
        myImage.src = '/112.jpg';
        let myCanvas = document.getElementById('myCanvas');
        let myCtx = myCanvas.getContext('2d');
        let toCanvas = document.getElementById('toCanvas')
        myImage.onload = function () {
            myCtx.drawImage(myImage, 0, 0, 256, 256);
            const t1 = new Date();
            const pred = tf.tidy(() => {


                let x = img2Tensor(myCanvas);
                x = model.predict(x);
                //每个像素分类最大值的索引
                x = tf.argMax(x, -1);
                //变成256*256
                x = tf.reshape(x, [256, 256]);

                console.log('===============unique===============');
                //tf.unique(x,1).values.print()
                //x.min().print()
                x=tf.cast(x,'float32')
                
                //toPixels 
                tf.browser.toPixels(x, toCanvas)

                return x

            });
            const t2 = new Date();
            console.log('===============time===============');

            console.log((t2 - t1) / 1000);
            //pred.print()

        }
    })();



    function img2Tensor(imgEl) {
        return tf.tidy(() => {
            return tf.browser.fromPixels(imgEl).toFloat().div(255).mul(2).sub(1).reshape([1, 256, 256, 3]);
            //return tf.browser.fromPixels(imgEl).toFloat().sub(255 / 2).div(255 / 2).reshape([1, 224, 224, 3]);
        })
    }
})


</script>
<style scoped>
</style>
