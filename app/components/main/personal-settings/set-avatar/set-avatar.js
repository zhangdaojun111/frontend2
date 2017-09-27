/**
 * @author zhaoyan
 * 打开头像设置界面
 */
import Component from '../../../../lib/component';
import 'jquery-ui/themes/base/base.css';
import 'jquery-ui/themes/base/theme.css';
import 'jquery-ui/ui/widgets/dialog.js';
import './set-avatar.scss';
import template from './set-avatar.html';
import {UserInfoService} from "../../../../services/main/userInfoService"
import Mediator from "../../../../lib/mediator"
import "../../../../lib/jcrop";
import msgbox from "../../../../lib/msgbox";

let jcropApi = undefined;       //保存Jcrop的接口

let config = {
    template:template,
    data:{
        status:true,
        imageArr:["image/png","image/jpg","image/jpeg","image/gif","image/tiff"],
        avatar:null,        //当前图片数据，包含picSrc，left，top
        picSrc:'',         //图片文件源数据
        avatarSrc:'',       //记录剪切后的图片的src
        _img:{},            //新图片对象
        imgW:0,           //图片显示宽度
        imgH:0,
        imgX:0,
        imgY:0,
        DragX:0,        //用于记录裁剪图片时的起点，需要通过两次比例处理
        DragY:0,        //用于记录裁剪图片时的起点
        scale:1,        //初始化图片时的放缩比例（缩放到350*350的框中）
        dragResult:{            //拖动结束后和数据
            coords:null,
            proportion:1,
        },
        imgData:{},    //记录选中部分的坐标信息
        JPosition:{},
        initFlag:true,      //判断是否使用后台数据加载头像设置历史状态（仅初始化时可能为true）
    },

    actions:{
        /**
         * 保存代理设置
         * @param event
         */
        getPic(event){
            this.data.status = true;
            let file = event.target.files[0];
            if(file.size > 1024000){       //检查文件大小
                // msgbox.alert("文件大小要小于1MB");
                this.el.find("div.img_tips").attr("html","文件大小要小于1MB");
                this.data.status = false;
                return this.data.status;
            }

            if(this.data.imageArr.indexOf(file.type) === -1){       //检查图片类型
                // msgbox.alert("必须上传图片类型");
                this.el.find("div.img_tips").attr("html","必须上传图片类型");
                this.data.status  = false;
                return this.data.status;
            }

            let reader = new FileReader();
            reader.readAsDataURL(file);
            if(jcropApi !== undefined){
                jcropApi.destroy();
            }

            let that = this;
            reader.onload = (e) => {
                that.data.picSrc = e.target['result'];
                that.actions.setImageProportion(that.data.picSrc);
            };
        },
        /**
         * 将原始图片按比例缩放，按较长边缩放至350px，居中显示
         * @param src
         */
        setImageProportion:function (src) {
            this.data._img = new Image();
            this.data._img.src = src;
            let that = this;
            this.data._img.onload = (event) => {                //根据图片大小以长边为基准对图片按比例放大或缩小，长边长度放缩为350px
                if(that.data._img.height >= that.data._img.width){
                    that.data.imgH = 350;
                    that.data.imgW = (that.data._img.width * 350 / that.data._img.height).toFixed(0);
                    that.data.scale = parseFloat((350/this.data._img.height).toFixed(5));
                    that.data.imgX = ((350 - that.data.imgW)/2).toFixed(0);
                    that.data.imgY = 0;
                }else if(that.data._img.width > that.data._img.height){
                    that.data.imgW = 350;
                    that.data.imgH = (that.data._img.height * 350 / that.data._img.width).toFixed(0);
                    that.data.scale = parseFloat((350/that.data._img.width).toFixed(5));
                    that.data.imgY = ((350 - that.data.imgH)/2).toFixed(0);
                    that.data.imgX = 0;
                }
                //展示图片前去掉默认背景
                this.el.find('.avatar-container').removeClass('post-local-image');
                that.actions.setJcropPosition();
                that.actions.displayPostImage();
            }
        },
        /**
         * 设置裁剪框的初始位置（居中）
         */
        setJcropPosition:function () {
            if(this.data.initFlag === false){
                this.data.JPosition.Jx = (this.data.imgW - 64)/2;
                this.data.JPosition.Jy = (this.data.imgH - 64)/2;
                this.data.JPosition.Jx2 = this.data.JPosition.Jx + 64;
                this.data.JPosition.Jy2 = this.data.JPosition.Jy + 64;
                this.data.DragX = this.data.JPosition.Jx / this.data.scale;
                this.data.DragY = this.data.JPosition.Jy / this.data.scale;
            }else{
                this.data.initFlag = false;
            }
        },
        /**
         * 展示用户上传的图片
         */
        displayPostImage(){
            let $parent = this.el.find(".avatar-container");
            $parent.empty();
            let $img = $("<img>").addClass('pic_set');
            this.data.imgX = this.data.imgX + "px";
            this.data.imgY = this.data.imgY + "px";
            $img.attr("src",this.data._img.src)
                .css("width",this.data.imgW)
                .css("height",this.data.imgH);

            //设置avatar-container位置使图片居中，防止jcrop改变图片位置
            $parent.css({
                paddingLeft:(350 - this.data.imgW)/2,
                paddingTop:(350 - this.data.imgH)/2
            });
            $parent.append($img);
            this.actions.initResultImgData();
            // 上传图片后，开启裁剪功能
            let that = this;
            this.el.find("img.pic_set").Jcrop({
                aspectRatio:1,
                bgColor:"black",
                bgOpacity:0.4,
                bgFade: true,
                onSelect:this.actions.updateCoords
            },function () {
                jcropApi = this;
                jcropApi.setSelect([that.data.JPosition.Jx,that.data.JPosition.Jy,that.data.JPosition.Jx2,that.data.JPosition.Jy2]);
            });
        },
        /**
         * 将裁剪框中的图片展示到圆形结果框中
         */
        initResultImgData:function () {
            this.data.imgData.src = this.data._img.src;
            this.data.imgData.width =  this.data.imgW;
            this.data.imgData.height = this.data.imgH;
            this.data.imgData.left = this.data.imgX;
            this.data.imgData.top = this.data.imgY;
        },
        /**
         * 拖动时更新圆形结果框中的图片
         * @param c
         */
        updateCoords:function (c) {
            this.data.dragResult.coords = c;
            this.data.dragResult.proportion = (c.x2 - c.x)/64;
            this.actions.resizeImg(c,this.data.dragResult.proportion);
            this.data.DragX = c.x / this.data.scale;
            this.data.DragY = c.y / this.data.scale;
            this.actions.printSquare();
        },
        /**
         * 根据比例缩放图片，作为最终使用图片
         * @param c
         * @param p
         */
        resizeImg:function (c,p) {
            this.data.imgData.src = this.data._img.src;
            this.data.imgData.width = this.data.imgW/p + "px";
            this.data.imgData.height = this.data.imgH/p + "px";
            this.data.imgData.left = 0 -  c.x/p + "px";
            this.data.imgData.top = 0 - c.y/p + "px";
        },
        /**
         * 在正方形画布上展示结果
         */
        printSquare(){
            let pic = this.el.find('img.pic_set')[0];
            let canvasS = this.el.find('.avatar-result-square')[0];
            let ctx = canvasS.getContext('2d');
            ctx.clearRect(0,0,64,64);
            let d = 64 * this.data.dragResult.proportion / this.data.scale;
            ctx.drawImage(pic,this.data.DragX,this.data.DragY,d,d,0,0,64,64);
            this.data.avatarSrc = this.actions.convertCanvasToImage(canvasS).src;
        },
        /**
         * 画布结果转化为base64数据
         * @param canvas
         * @returns {Image|*}
         */
        convertCanvasToImage(canvas){
            let image = new Image();
            image.src = canvas.toDataURL("image/png");
            return image;
        },
        /**
         * 保存头像
         */
        saveAvatar:function () {
            if(this.data.avatarSrc === ''){
                msgbox.alert('头像不能设置为空');
                return;
            }
            this.showLoading();
            //向后台传递头像数据
            UserInfoService.saveAvatar(this.data.avatarSrc).done((result) => {
                //根据结果处理后续工作
                if(result.success === 1){
                    console.log(result);
                    //向父窗口传递头像数据并设置
                    window.config.sysConfig.userInfo.avatar = this.data.avatarSrc;
                    Mediator.emit("personal:setAvatar");
                    msgbox.alert("头像设置成功!");
                }else{
                    msgbox.alert("头像设置失败！");
                }
                AvatarSet.hide();
            }).fail((err) => {
                msgbox.alert("头像设置失败！");
                AvatarSet.hide();
                console.log("err",err)
            })
        },
        /**
         * 获取用户头像数据
         */
        initUserAvatar:function () {

            //从后台获取用户数据

            let result = {              //测试数据
                data:{
                    picSrc:"data:image/jpeg;base64,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",
                    Jx:100,
                    Jy:150,
                    Jx2:300,
                    Jy2:350,
                },
                success:0
            };

            if(result.success === 1){
                //数据请求成功，回显头像设置历史状态
                this.data.initFlag = true;
                this.data.picSrc = result.data.picSrc;
                this.data.JPosition.Jx = result.data.Jx;
                this.data.JPosition.Jy = result.data.Jy;
                this.data.JPosition.Jx2 = result.data.Jx2;
                this.data.JPosition.Jy2 = result.data.Jy2;
                this.actions.setImageProportion(this.data.picSrc);
            }else{
                //数据获取失败或用户没有默认头像,显示请上传图片默认背景
                this.data.initFlag = false;
                this.actions.setDefaultBg();
            }
        },
        /**
         * 设置默认背景
         */
        setDefaultBg:function () {
            this.el.find('.avatar-container').addClass('post-local-image');
        }
    },
    binds:[
        {
            event:'change',
            selector:'input.select-pic',
            callback:function (target,event) {
                this.actions.getPic(event);
            }
        },
        {
            event:'click',
            selector:'span.save-avatar',
            callback:_.debounce(function(){
                this.actions.saveAvatar();
            },150)
        },
        {
            event:'click',
            selector:'span.set-cancel',
            callback:function () {
                AvatarSet.hide();
            }
        }
    ],

    afterRender:function () {
        this.actions.initUserAvatar();
    },
    beforeDestory:function () {

    }
};

class SetAvatar extends Component{
    constructor(){
        super(config);
    }
}

export const AvatarSet = {
    el:null,
    show: function() {
        let component = new SetAvatar();
        this.el = $('<div id="set-avatar-page">').appendTo(document.body);
        component.render(this.el);
        this.el.erdsDialog({
            title: '设置头像',
            width: 500,
            modal:true,
            height: 620,
            close: function() {
                $(this).erdsDialog('destroy');
                component.destroySelf();
            }
        });
    },
    hide:function () {
        this.el.erdsDialog('close');
    }
};