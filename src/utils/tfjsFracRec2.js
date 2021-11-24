import * as tf from '@tensorflow/tfjs'
import Worker from './worker?worker'

export default function (obj) {
    let { myCanvas, callback,str } = obj
    const t1 = new Date();
    console.log(str + ' ...tfjs start');
    //console.log(t1.getTime().toString().slice(-2) + ' in tfjs');
    
    let myWorker = new Worker();
    let ow = myCanvas.width;
    let oh = myCanvas.height;
    //读取数据
    tf.tidy(() => {
        let x = tf.browser.fromPixels(myCanvas);
        x = x.dataSync()
        myWorker.postMessage({ x, ow, oh,str });
    })
    myWorker.onmessage = function (e) {
        callback(e.data)
        console.log(str + '...tfjs total take time: ', (new Date() - t1), 'ms');
    }
}