import * as tf from '@tensorflow/tfjs'
const MODEL_URL = '/v7/model.json';

function img2Tensor(imgEl) {
    return tf.tidy(() => {
        return tf.browser.fromPixels(imgEl).toFloat().div(255).mul(2).sub(1).reshape([1, 256, 256, 3]);
    })
}
let model = await tf.loadGraphModel(MODEL_URL);
export default function (myCanvas) {
    return new Promise((resolve, reject) => {
        let ow = myCanvas.width;
        let oh = myCanvas.height;
        const t1 = new Date();
        tf.tidy(() => {
            //读取数据
            let x = tf.browser.fromPixels(myCanvas);
            //resize
            x = tf.image.resizeBilinear(x, [256, 256])
            //归一化
            x = tf.cast(x, 'float32').div(255).mul(2).sub(1).reshape([1, 256, 256, 3]);
            x = model.predict(x);
            //resize
            x = tf.image.resizeBilinear(x, [oh, ow])
            //每个像素分类最大值的索引
            x = tf.argMax(x, -1);
            //变成oh*ow大小
            x = tf.reshape(x, [oh, ow]);
            //toPixels 前数据类型转化
            x = tf.cast(x, 'float32')
            
            
            
            tf.browser.toPixels(x, myCanvas)

            let data = x.dataSync()
            resolve(data)
            
        });
        const t2 = new Date();
        console.log('model predict take time: ', (t2 - t1), 'ms');
    })

}
