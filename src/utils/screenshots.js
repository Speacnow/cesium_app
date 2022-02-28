import tfjsFracRec from '../utils/tfjsFracRec'
import img2cesium from './img2cesium';
import tfjsFracRec2 from '../utils/tfjsFracRec2'
import img2cesium2 from './img2cesium2';
import img2cesium3 from './img2cesium3';
import thinning_track from './thinning_track';
import draw from './draw';
import * as tf from '@tensorflow/tfjs'
const MODEL_URL = '/ours/model.json';
export default function (viewer) {
    function btn2() {
        let canvas_cover = document.getElementById("canvas_cover")
        if (canvas_cover) {
            canvas_cover.parentNode.removeChild(canvas_cover)
        }
    };
    document.getElementById('btn2').onclick = btn2;
    //数据读取原生webgl
    document.getElementById('btn1').onclick = function () {
        (async function () {

            //tf.setBackend('cpu')
            let model = await tf.loadGraphModel(MODEL_URL);
            alert('done!!')
            const cesium_widget = viewer.canvas.parentNode;
            cesium_widget.style.cssText = "position:relative"
            //viewer.canvas.style.cssText = 'display:none'
            let canvas_cover = document.createElement("canvas");
            canvas_cover.id = 'canvas_cover'
            canvas_cover.width = viewer.canvas.width;
            canvas_cover.height = viewer.canvas.height;
            canvas_cover.style.cssText = "background:black;opacity:0.5;position:absolute;left:0px;top:0px;";
            cesium_widget.appendChild(canvas_cover);

            let drag = false;//开始拖拽
            let startX, startY;


            canvas_cover.onmousedown = function (e) {
                if (!drag) {
                    drag = true;
                    startX = e.offsetX;
                    startY = e.offsetY;
                    let active_canvas = document.createElement("canvas");
                    active_canvas.classList.add("active_canvas");
                    active_canvas.style.cssText = `background: grey;position: absolute; opacity: 0.5; cursor: move;`
                    active_canvas.style.top = startY + 'px';
                    active_canvas.style.left = startX + 'px';
                    active_canvas.style.width = '0px';
                    active_canvas.style.height = '0px';
                    cesium_widget.appendChild(active_canvas);
                    active_canvas = null;
                }

            }
            // 鼠标移动
            canvas_cover.onmousemove = function (e) {
                // 更新 box 尺寸
                if (drag && document.getElementsByClassName("active_canvas")[0]) {
                    let active_canvas = document.getElementsByClassName("active_canvas")[0];
                    active_canvas.style.width = e.offsetX - startX + 'px';
                    active_canvas.style.height = e.offsetY - startY + 'px';
                }

            };
            // 鼠标抬起
            canvas_cover.onmouseup = function (e) {

                if (drag && document.getElementsByClassName("active_canvas")[0]) {
                    let active_canvas = document.getElementsByClassName("active_canvas")[0];
                    // 如果长宽均小于 3px，移除 box
                    drag = false;

                    let box_width = Number(active_canvas.style.width.split('px')[0]);
                    let box_height = Number(active_canvas.style.height.split('px')[0]);
                    active_canvas.width = box_width;
                    active_canvas.height = box_height;

                    let bigwidth = viewer.canvas.width;
                    let bigheight = viewer.canvas.height;
                    let gl = viewer.canvas.getContext('webgl');
                    let pixels = new Uint8Array(box_width * box_height * 4);
                    gl.readPixels(startX, bigheight - startY - box_height, box_width, box_height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

                    let copy = [];
                    //把数据上下反转，相当于镜面反转，这是由于readPixels的原点在左下角，而putImageData原点在右上角
                    for (let row = box_height - 1; row >= 0; row--) {
                        copy.push(Array.from(pixels.slice(row * box_width * 4, (row + 1) * box_width * 4)))
                    }
                    pixels = new Uint8Array(copy.flat())
                    let imageData = new ImageData(new Uint8ClampedArray(pixels), box_width, box_height);
                    active_canvas.getContext('2d').putImageData(imageData, 0, 0);
                    /**
                     * main code
                     */

                    //把active_canvas改为box_canvas
                    let rate = 256
                    let doms = document.getElementsByClassName("active_canvas");
                    for (let i = 0; i < doms.length; i++) {
                        //截图图像总长宽
                        let W = doms[i].width
                        let H = doms[i].height
                        console.log('---总长宽----', W, H);
                        //被256*256分割横向与纵向的数量
                        let W_number = Math.round(W / rate) == 0 ? 1 : Math.round(W / rate)
                        let H_number = Math.round(H / rate) == 0 ? 1 : Math.round(H / rate)
                        console.log('---数量----', W_number, H_number);
                        //每个小图形的长宽 注意分割canvas要注意除不整的情况

                        let w = Math.floor(W / W_number)
                        let w_last = W - (W_number - 1) * w
                        let h = Math.floor(H / H_number)
                        let h_last = H - (H_number - 1) * h

                        //let all_result_array = [];
                        let all_result_array_squence = new Array(W * H).fill(-1)
                        //开始分割
                        //沿着横向分割

                        let btn4_click = null;

                        for (let a = 0; a < W_number; a++) {
                            //沿着横向分割
                            for (let b = 0; b < H_number; b++) {
                                let current_w = a == W_number - 1 ? w_last : w
                                let current_h = b == H_number - 1 ? h_last : h
                                //console.log(a, b, current_w, current_h);
                                let canvas = document.createElement('canvas')
                                canvas.classList.add("mini_canvas");
                                canvas.style.cssText = `background: red;position: absolute; opacity:1; cursor: move;`
                                canvas.style.top = startY + h * b + 'px';
                                canvas.style.left = startX + w * a + 'px';
                                canvas.style.width = current_w + 'px';
                                canvas.style.height = current_h + 'px';
                                canvas.width = current_w
                                canvas.height = current_h
                                let context = canvas.getContext('2d');
                                let imagedata = doms[i].getContext('2d').getImageData(w * a, h * b, current_w, current_h);
                                context.putImageData(imagedata, 0, 0);
                                //cesium_widget.appendChild(canvas);
                                //判断是否移除遮罩和active_box
                                // let isClose = a == W_number - 1 && b == H_number - 1 ? true : false
                                let callback = (data) => {

                                    //整合零散的canvas数据，使之最后变成一张大的
                                    for (let q = 0; q < current_h; q++) {
                                        let slice = data.slice(q * current_w, (q + 1) * current_w)
                                        let start = (b * h + q) * W + a * w
                                        all_result_array_squence.splice(start, current_w, ...slice)
                                    }
                                    if (!all_result_array_squence.includes(-1)) {
                                        //b遍历完了
                                        console.log('---------遍历完了----------');
                                        console.log(all_result_array_squence);
                                        let imageData = doms[i].getContext('2d').getImageData(0, 0, W, H);
                                        let length = W * H * 4;
                                        for (var index = 0; index < length; index += 4) {
                                            if (all_result_array_squence[index / 4] == 0) {
                                                imageData.data[index] = 0;
                                                imageData.data[index + 1] = 0;
                                                imageData.data[index + 2] = 0;
                                            } else {
                                                imageData.data[index] = 255;
                                                imageData.data[index + 1] = 255;
                                                imageData.data[index + 2] = 255
                                            }
                                        }

                                        doms[i].getContext('2d').putImageData(imageData, 0, 0);
                                        //开启绘图功能
                                        draw(doms[i])
                                        //let array = new Array(all_result_array_squence.length).fill(-1)
                                        btn4_click = function () {

                                            let imageData = doms[i].getContext('2d').getImageData(0, 0, W, H);
                                            let length = W * H * 4;
                                            for (var index = 0; index < length; index += 4) {

                                                if (imageData.data[index] == 0 && imageData.data[index + 1] == 0 && imageData.data[index + 2] == 0)
                                                    all_result_array_squence[index / 4] = 0

                                                else {
                                                    all_result_array_squence[index / 4] = 1
                                                }


                                            }
                                            let value = document.getElementById("select").value
                                            if (value == 'thin') {
                                                data
                                                let lines = thinning_track(all_result_array_squence, W, H)
                                                img2cesium3({ lines, W, H, startX, startY, viewer })

                                            }
                                            else if (value == 'point') {
                                                //逐像素绘制点'
                                                //图像细化
                                                img2cesium({ data: all_result_array_squence, width: W, startX: startX, startY: startY, viewer })
                                            }
                                            else {
                                                //邻点
                                                img2cesium2({ data: all_result_array_squence, W, H, startX, startY, viewer })
                                            }
                                            doms[i].parentNode.removeChild(doms[i])
                                            btn2()

                                        }
                                        document.getElementById('btn4').onclick = btn4_click;

                                    }
                                    else {
                                        btn4_click = null;
                                        document.getElementById('btn4').onclick = btn4_click;
                                    }

                                }
                                let seq = { a, b }
                                // tfjsFracRec2({ myCanvas: canvas, callback, seq })
                                //开始识别
                                const t1 = new Date();
                                console.log(seq.a, seq.b, ' ...tfjs start');
                                let ow = canvas.width;
                                let oh = canvas.height;
                                tf.tidy(() => {
                                    let x = tf.browser.fromPixels(canvas);
                                    //x = x.dataSync()
                                    //myWorker.postMessage({ x, ow, oh, seq });
                                    //x = tf.tensor(x, [oh, ow, 3])

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
                                    x = tf.cast(x, 'float32')
                                    let data = x.dataSync()
                                    callback(data)
                                    console.log(seq.a, seq.b, '...tfjs total take time: ', (new Date() - t1), 'ms');
                                })

                            }

                        }
                    }

                }
            };


        })();

    }
}