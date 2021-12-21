import tfjsFracRec from '../utils/tfjsFracRec'
import img2cesium from './img2cesium';
import tfjsFracRec2 from '../utils/tfjsFracRec2'
import img2cesium2 from './img2cesium2';
import img2cesium3 from './img2cesium3';
import thinning_track from './thinning_track';
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
                let doms = document.getElementsByClassName("active_canvas");
                for (let i = 0; i < doms.length; i++) {
                    //截图图像总长宽
                    let W = doms[i].width
                    let H = doms[i].height
                    console.log('---总长宽----', W, H);
                    //被256*256分割横向与纵向的数量
                    let W_number = Math.round(W / 256) == 0 ? 1 : Math.round(W / 256)
                    let H_number = Math.round(H / 256) == 0 ? 1 : Math.round(H / 256)
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

                                if (document.getElementById("select").value == 'polygon') {
                                    //绘制点
                                    img2cesium({ data: data, width: current_w, startX: startX + w * a, startY: startY + h * b, viewer })


                                    //是否到了最后一个分割图像,到了就绘制网格
                                    if (!all_result_array_squence.includes(-1)) {
                                        console.log('---遍历完了----');


                                        //绘制点的连线
                                        img2cesium2({ data: all_result_array_squence, W, H, startX, startY, viewer })
                                        doms[i].parentNode.removeChild(doms[i])
                                        btn2()


                                    }
                                }
                                else {
                                    if (!all_result_array_squence.includes(-1)) {
                                        console.log('---遍历完了----');
                                        let lines = thinning_track(all_result_array_squence, W, H)



                                        img2cesium3({ lines, W, H, startX, startY, viewer })
                                        doms[i].parentNode.removeChild(doms[i])
                                        btn2()
                                    }


                                }



                            }
                            let seq = { a, b }
                            tfjsFracRec2({ myCanvas: canvas, callback, seq })

                        }

                    }
                }

            }
        };

    }
}