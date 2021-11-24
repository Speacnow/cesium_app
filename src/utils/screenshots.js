import tfjsFracRec from '../utils/tfjsFracRec'
import img2cesium from './img2cesium';
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
                    //识别图像
                    tfjsFracRec(doms[i]).then(data => {
                        //三维映射
                        img2cesium({ data, canvas: doms[i], startX, startY, viewer })
                        //doms[i].classList.replace('active_canvas', 'box_canvas')
                        doms[i].parentNode.removeChild(doms[i])
                        btn2()


                    })
                }

            }
        };

    }
}