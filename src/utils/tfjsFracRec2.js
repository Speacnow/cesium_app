import * as tf from '@tensorflow/tfjs'
import Worker from './worker?worker'

export default function (obj) {
    let { myCanvas, callback, seq } = obj
    const t1 = new Date();
    console.log(seq.a, seq.b, ' ...tfjs start');

    let myWorker = new Worker();
    let ow = myCanvas.width;
    let oh = myCanvas.height;
    //读取数据
    tf.tidy(() => {
        let x = tf.browser.fromPixels(myCanvas);
        x = x.dataSync()
        myWorker.postMessage({ x, ow, oh, seq });
    })
    myWorker.onmessage = function (e) {
        callback(e.data)
        console.log(seq.a, seq.b, '...tfjs total take time: ', (new Date() - t1), 'ms');
    }
}