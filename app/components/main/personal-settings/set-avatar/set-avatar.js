import Component from '../../../../lib/component';
import 'jquery-ui/themes/base/base.css';
import 'jquery-ui/themes/base/theme.css';
import 'jquery-ui/ui/widgets/dialog.js';
import './set-avatar.scss';
import template from './set-avatar.html';
import {UserInfoService} from "../../../../services/main/userInfoService"
import msgbox from '../../../../lib/msgbox';


let config = {
    template:template,
    data:{
        status:true,
        imgTips:'',
        imageArr:["image/png","image/jpg","image/jpeg","image/gif","image/tiff"],
    },

    actions:{
        postPic(event){
            this.data.status = true;
            let file = event.target.files[0];

            if(file.size > 1024000){       //检查文件大小
                this.data.imgTips = '文件大小要小于1MB';
                this.data.status = false;
                return this.data.status;
            }

            if(this.data.imageArr.indexOf(file.type) === -1){
                this.data.imgTips = "必须上传图片类型";
                this.data.status  = false;
                return this.data.status;
            }
            console.log(file);
            let reader=new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e)=>{
                this._picSrc=e.target['result'];
                this._img=new Image();
                this._img.src=this._picSrc;
                this._img.onload=(e)=>{
                    if(this._img.height>this._img.width){
                        if(this._img.width<=350){
                            this.imgH=this._img.height;
                            this.imgW=this._img.width;
                            this.scale=1
                        }else{
                            this.imgW=350;
                            this.scale=parseFloat((350/this._img.width).toFixed(3));
                            this.imgH=(this._img.height*350/this._img.width).toFixed(1);
                        }
                    }else if(this._img.width>this._img.height){
                        if(this._img.height<=350){
                            this.imgH=this._img.height;
                            this.imgW=this._img.width;
                            this.scale=1
                        }else{
                            this.imgH=350;
                            this.scale=parseFloat((350/this._img.height).toFixed(3));
                            this.imgW=parseFloat((this._img.width*350/this._img.height).toFixed(1));
                        }
                    }
                };
                //手动修改当前显示的图片信息


            };
            this.err=false;

        },
    },
    afterRender:function () {
        this.el.on("change","input.select-pic",(event) => {   //监听上传图片
            this.actions.postPic(event);
        })
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
        console.log("do show");
        let component = new SetAvatar();
        component.dataService = UserInfoService;
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