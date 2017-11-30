/*
 * Created by zhr
 */

//生成字母数组
function getAllLetter() {
    let letterStr = "a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z";
    return letterStr.split(",");
}
//生成一个随机数
function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
//生成一个随机色
function randomColor(min, max) {
    let r = randomNum(min, max);
    let g = randomNum(min, max);
    let b = randomNum(min, max);
    return "rgb(" + r + "," + g + "," + b + ")";
}
class verify {
    constructor(options){
        this.options = { //默认options参数值
            id: "", //容器Id
            canvasId: "verifyCanvas", //canvas的ID
            width: "160", //默认canvas宽度
            height: "40", //默认canvas高度
            type: "blend", //图形验证码默认类型blend:数字字母混合类型、number:纯数字、letter:纯字母
            code: ""
        }

        if(Object.prototype.toString.call(options) == "[object Object]"){//判断传入参数类型
            for(let i in options) { //根据传入的参数，修改默认参数值
                this.options[i] = options[i];
            }
        }else{
            this.options.id = options;
        }

        this.options.numArr = "0,1,2,3,4,5,6,7,8,9".split(",");
        this.options.letterArr = getAllLetter();

        this._init();
        this.refresh();
    }

    //初始化方法
    _init() {
        let con = document.getElementById(this.options.id);
        let canvas = document.createElement("canvas");
        this.options.width = con.offsetWidth > 0 ? con.offsetWidth : "160";
        this.options.height = con.offsetHeight > 0 ? con.offsetHeight : "40";
        canvas.id = this.options.canvasId;
        canvas.width = this.options.width;
        canvas.height = this.options.height;
        canvas.style.cursor = "pointer";
        canvas.innerHTML = "您的浏览器版本不支持canvas";
        con.appendChild(canvas);
        let parent = this;
        canvas.onclick = function(){
            parent.refresh();
        }
    }

    //生成验证码
    refresh() {
        this.options.code = "";
        let canvas = document.getElementById(this.options.canvasId);
        if(canvas.getContext) {
            this.ctx = canvas.getContext('2d');
        }else{
            return;
        }

        this.ctx.textBaseline = "middle";

        this.ctx.fillStyle = randomColor(180, 240);
        this.ctx.fillRect(0, 0, this.options.width, this.options.height);

        if(this.options.type == "blend") { //判断验证码类型
            this.txtArr = this.options.numArr.concat(this.options.letterArr);
        } else if(this.options.type == "number") {
            this.txtArr = this.options.numArr;
        } else {
            this.txtArr = this.options.letterArr;
        }

        for(let i = 1; i <= 4; i++) {
            this.txt = this.txtArr[randomNum(0, this.txtArr.length)];
            this.options.code += this.txt;
            this.ctx.font = randomNum(this.options.height/2, this.options.height) + 'px SimHei'; //随机生成字体大小
            this.ctx.fillStyle = randomColor(50, 160); //随机生成字体颜色
            this.ctx.shadowOffsetX = randomNum(-3, 3);
            this.ctx.shadowOffsetY = randomNum(-3, 3);
            this.ctx.shadowBlur = randomNum(-3, 3);
            this.ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
            let x = this.options.width / 5 * i;
            let y = this.options.height / 2;
            let deg = randomNum(-30, 30);
            //设置旋转角度和坐标原点
            this.ctx.translate(x, y);
            this.ctx.rotate(deg * Math.PI / 180);
            this.ctx.fillText(this.txt, 0, 0);
            //恢复旋转角度和坐标原点
            this.ctx.rotate(-deg * Math.PI / 180);
            this.ctx.translate(-x, -y);
        }
        //绘制干扰线
        for(let i = 0; i < 4; i++) {
            this.ctx.strokeStyle = randomColor(40, 180);
            this.ctx.beginPath();
            this.ctx.moveTo(randomNum(0, this.options.width), randomNum(0, this.options.height));
            this.ctx.lineTo(randomNum(0, this.options.width), randomNum(0, this.options.height));
            this.ctx.stroke();
        }
        //绘制干扰点
        for(let i = 0; i < this.options.width/4; i++) {
            this.ctx.fillStyle = randomColor(0, 255);
            this.ctx.beginPath();
            this.ctx.arc(randomNum(0, this.options.width), randomNum(0, this.options.height), 1, 0, 2 * Math.PI);
            this.ctx.fill();
        }
    }
    validate(code){
        this.code = code.toLowerCase();
        this.v_code = this.options.code.toLowerCase();
        console.log(this.v_code);
        if(this.code == this.v_code){
            return true;
        }else{
            this.refresh();
            return false;
        }
    }
}
export {verify}