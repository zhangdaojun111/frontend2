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

let SetAvatar = Component.extend({
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
                this.el.find("div.img_tips").attr("html","文件大小不大于1MB");
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

            reader.onload = (e) => {
                this.data.picSrc = e.target['result'];
                this.actions.setImageProportion(this.data.picSrc);
            };
        },
        /**
         * 将原始图片按比例缩放，按较长边缩放至350px，居中显示
         * @param src
         */
        setImageProportion:function (src) {
            this.data._img = new Image();
            this.data._img.src = src;
            this.data._img.onload = (event) => {//根据图片大小以长边为基准对图片按比例放大或缩小，长边长度放缩为350px
                if(this.data._img.height >= this.data._img.width){
                    this.data.imgH = 350;
                    this.data.imgW = (this.data._img.width * 350 / this.data._img.height).toFixed(0);
                    this.data.scale = parseFloat((350/this.data._img.height).toFixed(5));
                    this.data.imgX = ((350 - this.data.imgW)/2).toFixed(0);
                    this.data.imgY = 0;
                }else if(this.data._img.width > this.data._img.height){
                    this.data.imgW = 350;
                    this.data.imgH = (this.data._img.height * 350 / this.data._img.width).toFixed(0);
                    this.data.scale = parseFloat((350/this.data._img.width).toFixed(5));
                    this.data.imgY = ((350 - this.data.imgH)/2).toFixed(0);
                    this.data.imgX = 0;
                }
                //展示图片前去掉默认背景
                this.el.find('.avatar-container').removeClass('post-local-image');
                this.actions.setJcropPosition();
                this.actions.displayPostImage();
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
            this.actions._setAvatar();
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
        _setAvatar:function () {
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
        // Mediator.removeAll("personal:setAvatar");
    }
});

export const AvatarSet = {
    el:null,
    show: function() {
        let component = new SetAvatar();
        this.el = $('<div id="set-avatar-page">').appendTo(document.body);
        component.render(this.el);
        this.el.erdsDialog({
            title: '设置头像',
            width: 540,
            modal:true,
            height: 600,
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