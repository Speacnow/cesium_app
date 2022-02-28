import * as tf from '@tensorflow/tfjs'
const MODEL_URL = '/ours/model.json';
onmessage = function (e) {
    let { x, ow, oh, seq } = e.data;
    console.log(seq.a, seq.b,'---worker start');
    (async function () {

        //tf.setBackend('cpu')

        let model = await tf.loadGraphModel(MODEL_URL);

        tf.tidy(() => {
            x = tf.tensor(x, [oh, ow, 3])

            //resize
            x = tf.image.resizeBilinear(x, [256, 256], 'float32')
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

            postMessage(x.dataSync())
        });
        self.close();
    })();
}


