
export default function (canvas) {
    canvas.style.cursor = 'crosshair'
    let context = canvas.getContext('2d');  //2d用单引用括起来
    //x1 y1旧点 x2 y2新点
    canvas.drawing = function (x1, y1, x2, y2, e) {
        let self = this;
        if (!context) {
            return;
        } else {
            // 设置画笔的颜色和大小
            //context.strokeStyle = "blue";  // 画笔的颜色
            context.strokeStyle = document.getElementById('selectDrawColor').value;  // 画笔的颜色
            context.lineWidth = document.getElementById('drawWidth').value;  // 指定描边线的宽度

            context.save();
            context.beginPath();

            context.moveTo(x1, y1);
            context.lineTo(x2, y2);
            context.stroke();

            self.X1 = self.X2;
            self.Y1 = self.Y2;

            context.restore();
            context.closePath();
        }
    };
    canvas.onmousedown = function mouseDownAction(e) {
        let self = this;
        self.X1 = e.offsetX;
        self.Y1 = e.offsetY;
        self.isMouseDown = true;

    };
    canvas.onmousemove = function mouseMoveAction(e) {
        let self = this;
        if (self.isMouseDown) {
            self.X2 = e.offsetX;
            self.Y2 = e.offsetY;
            self.drawing(self.X1, self.Y1, self.X2, self.Y2, e);
        }
    };
    canvas.onmouseup = function mouseUpAction(e) {
        let self = this;
        self.isMouseDown = false;
    };
}
