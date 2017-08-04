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