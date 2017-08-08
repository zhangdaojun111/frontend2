import Component from '../../../../lib/component';
import 'jquery-ui/themes/base/base.css';
import 'jquery-ui/themes/base/theme.css';
import 'jquery-ui/ui/widgets/dialog.js';
import './set-avatar.scss';
import template from './set-avatar.html';
import {UserInfoService} from "../../../../services/main/userInfoService"
import Mediator from "../../../../lib/mediator"
// import msgbox from '../../../../lib/msgbox';



let config = {
    template:template,
    data:{
        status:true,
        imageArr:["image/png","image/jpg","image/jpeg","image/gif","image/tiff"],
        avatar:null,        //当前图片数据，包含picSrc，left，top
        picSrc:'',         //记录当前图片
        _picSrc:'',         //记录新图片
        _img:'',            //新图片对象
        imgW:350,           //图片显示宽度
        imgH:350,
        imgX:0,             //图片横向位移量
        imgY:0,             //图片纵向位移量
        component:null,
    },

    actions:{
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
            reader.onload = (e) => {
                this.data._picSrc = e.target['result'];
                this.data._img = new Image();
                this.data._img.src = this._picSrc;
                //自适应图片大小
                // this.data._img.onload = (e) => {
                //     if(this.data._img.height > this.data._img.width){
                //         if(this.data._img.width <= 350){
                //             this.data.imgH = this.data._img.height;
                //             this.data.imgW = this.data._img.width;
                //             this.data.scale = 1
                //         }else{
                //             this.data.imgW = 350;
                //             this.data.scale = parseFloat((350/this.data._img.width).toFixed(3));
                //             this.data.imgH = (this._img.height*350/this.data._img.width).toFixed(1);
                //         }
                //     }else if(this.data._img.width > this.data._img.height){
                //         if(this.data._img.height <= 350){
                //             this.data.imgH = this.data._img.height;
                //             this.data.imgW = this.data._img.width;
                //             this.data.scale = 1
                //         }else{
                //             this.data.imgH = 350;
                //             this.data.scale = parseFloat((350/this.data._img.height).toFixed(3));
                //             this.data.imgW = parseFloat((this.data._img.width*350/this.data._img.height).toFixed(1));
                //         }
                //     }
                // };

                //手动显示上传的图片
                this.el.find("img.pic_set")
                    .attr("src",this.data._picSrc)
                    .attr("width",this.data.imgW)
                    .attr("height",this.data.imgH)
                    .attr("left",this.data.imgX)
                    .attr("top",this.data.imgY)
            };
        },
        dragStart:function () {
            //拖动起始事件
        },
        drag:function () {
            //拖动事件
        },
        dragStop:function () {
            //拖动完成，记录拖动框坐标
            this.data.imgX = (0 - parseInt(this.el.find("div.drag-able").css("left"))) + "px";
            this.data.imgY = (0 - parseInt(this.el.find("div.drag-able").css("top"))) + "px";
            this.el.find(".result-img")
                .attr("src",this.data._picSrc)
                .css("left",this.data.imgX)
                .css("top",this.data.imgY)
        },

        saveAvatar:function () {
            let data = {
                picSrc:this.data._picSrc,
                left:this.data.imgX,
                top:this.data.imgY
            };
            //向父窗口传递头像数据
            Mediator.emit("personal:setAvatar",data);
            //向后台传递头像数据
            UserInfoService.saveAvatar(data).done((result) => {
                //根据结果处理后续工作
                console.log(result)
            }).fail((err) => {
                console.log("err",err)
            })
        }
    },

    afterRender:function () {
        //设置可拖动的圆形div
        this.el.find("div.drag-able").draggable({
            start:this.actions.dragStart,
            drag:this.actions.drag,
            stop:this.actions.dragStop,
        });
        //设置监听
        this.el.on("change","input.select-pic",(event) => {   //监听上传图片
            this.actions.getPic(event);
        }).on("click","span.save-avatar",(event) => {
            this.actions.saveAvatar();
        }).on("click","span.set-cancel",(event) => {
            this.el.dialog('close');
        });
        this.avatar = window.config.sysConfig.userInfo.avatar;
    },
    beforeDestory:function () {

    }
};

class SetAvatar extends Component{
    constructor(){
        super(config);
    }
}

export default {
    show: function() {
        let component = new SetAvatar();
        let el = $('<div id="set-avatar-page">').appendTo(document.body);
        component.render(el);
        el.dialog({
            title: '设置头像',
            width: 400,
            height: 600,
            close: function() {
                component.destroySelf();
            }
        });
    }
}