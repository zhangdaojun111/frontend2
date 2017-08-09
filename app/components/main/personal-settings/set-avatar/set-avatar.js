import Component from '../../../../lib/component';
import 'jquery-ui/themes/base/base.css';
import 'jquery-ui/themes/base/theme.css';
import 'jquery-ui/ui/widgets/dialog.js';
import './set-avatar.scss';
import template from './set-avatar.html';
import {UserInfoService} from "../../../../services/main/userInfoService"
import Mediator from "../../../../lib/mediator"
// import msgbox from '../../../../lib/msgbox';
import "../../../../lib/jcrop";
import msgbox from "../../../../lib/msgbox";

let jcropApi = undefined;       //保存Jcrop的接口

let config = {
    template:template,
    data:{
        status:true,
        imageArr:["image/png","image/jpg","image/jpeg","image/gif","image/tiff"],
        avatar:null,        //当前图片数据，包含picSrc，left，top
        picSrc:'',         //记录当前图片
        _picSrc:'',         //记录新上传图片
        _img:'',            //新图片对象
        imgW:350,           //图片显示宽度
        imgH:350,
        imgX:0,
        imgY:0,
        component:null,
        dragResult:{            //拖动结束后和数据
            coords:null,
            proportion:1,
        },
        imgData:{               //根据比例计算后的结果，用于设置最终图片位置
            src:"",
            width:"",
            height:"",
            left:"",
            top:"",
        },
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
            if(jcropApi !== undefined){
                jcropApi.destroy();
            }
            reader.onload = (e) => {
                let picSrc = e.target['result'];
                // 手动显示上传的图片(350*350)
                this.el.find("img.pic_set")
                    .attr("src",picSrc)
                    .attr("width",this.data.imgW)
                    .attr("height",this.data.imgH)
                    .attr("left",this.data.imgX)
                    .attr("top",this.data.imgY);
                this.actions.initImgData(picSrc);
                //上传图片后，开启裁剪功能
                this.el.find("img.pic_set").Jcrop({
                    aspectRatio:1,
                    bgColor:"black",
                    bgOpacity:0.4,
                    bgFade: true,
                    onSelect:this.actions.updateCoords
                },function () {
                    jcropApi = this;
                    jcropApi.setSelect([145,145,205,205]);
                });
            };
        },
        initImgData:function (src) {
            this.data.imgData.src = src;
            this.data._picSrc = src;
            this.data.imgData.width =  "350px";
            this.data.imgData.height = "350px";
            this.data.imgData.left = "-145px";
            this.data.imgData.top = "-145px";
        },
        updateCoords:function (c) {
            this.data.dragResult.coords = c;
            this.data.dragResult.proportion = (c.x2 - c.x)/60;
            this.actions.resizeImg(c,this.data.dragResult.proportion);
        },
        resizeImg:function (c,p) {
            //根据比例缩放图片，作为最终使用图片
            this.data.imgData.src = this.data._picSrc;
            this.data.imgData.width =  350/p + "px";
            this.data.imgData.height = 350/p + "px";
            this.data.imgData.left = 0 - c.x/p + "px";
            this.data.imgData.top = 0 - c.y/p + "px";
            this.actions.displayAvatar();
        },
        displayAvatar:function () {
            this.el.find("img.result-img")
                .attr("src",this.data.imgData.src)
                .css("width",this.data.imgData.width)
                .css("height",this.data.imgData.height)
                .css("left",this.data.imgData.left)
                .css("top",this.data.imgData.top);
        },
        saveAvatar:function () {
            let data = this.data.imgData;
            //向后台传递头像数据
            UserInfoService.saveAvatar(data).done((result) => {
                //根据结果处理后续工作
                console.log(result);
                if(result.success === 1){
                    //向父窗口传递头像数据并设置
                    Mediator.emit("personal:setAvatar",data);
                }else{
                    msgbox.alert("头像设置失败！");
                }
            }).fail((err) => {
                msgbox.alert("头像设置失败！");
                console.log("err",err)
            })
        }
    },

    afterRender:function () {
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
            width: 500,
            height: 600,
            close: function() {
                component.destroySelf();
            }
        });
    }
}