import Component from '../../../lib/component';
import 'jquery-ui/themes/base/base.css';
import 'jquery-ui/themes/base/theme.css';
import 'jquery-ui/ui/widgets/dialog.js';
import template from './login-by-other.html';
import "./login-by-other.scss";
import {AutoSelect} from '../../../components/util/autoSelect/autoSelect';
import {UserInfoService} from "../../../services/main/userInfoService";
import msgbox from "../../../lib/msgbox";

let config = {
    template:template,
    data:{
        userData:null,
        selectedUserName:"",
        _autoSelect : null,
        _otherId:'',
    },
    actions:{
        getData:function () {
            UserInfoService.getAllUsersInfo().done((result) => {
                if(result.success === 1){
                    this.data.userData = result.rows;
                    this.actions.initList();
                }else{
                    console.log("获取数据失败",result);
                }
            }).fail((err) => {
                console.log("获取数据失败",err);
            })
        },
        initList:function () {          //使用组件绘制下拉框
            let $wrap = this.el.find('.user-list');
            let that = this;
            let autoSelect = new AutoSelect({
                list: this.data.userData,
                multiSelect: false,
                editable: true,
                onSelect: function (choosed) {
                    console.log(choosed);
                    if(choosed.length > 0){
                        that.data._otherId = choosed[0].id;
                    }else{
                        that.data._otherId = '';
                    }
                }
            });
            autoSelect.render($wrap);
            this._autoSelect = autoSelect;
        },
        loginOtherAccount:function () {
            // let userId = this._autoSelect.actions.getId();
            let userId = this.data._otherId;
            userId = userId.trim();
            if(userId && userId !== ''){
                //执行以选中人的账号登录
                return UserInfoService.change_login_user(userId).done((result) => {
                    console.log(result);
                    if(result.success === 0){
                        msgbox.alert("切换用户失败，原因是" + result.error);
                    }
                    if(result.success === 1){
                        location.reload(false);
                    }
                })
            }
        },
        cancel:function () {
            this.el.dialog('close');
        }
        
    },
    afterRender:function () {
        this.actions.getData();
        this.el.on("click",".confirm-btn",() => {
            this.actions.loginOtherAccount();
        }).on("click",".cancel-btn", () => {
            this.actions.cancel();
        })
    },
    beforeDestory:function () {

    }
};

class LoginOther extends Component{
    constructor(){
        super(config);
    }
}

export default {
    show: function() {
        let component = new LoginOther();
        let el = $('<div id="login-by-other">').appendTo(document.body);
        component.render(el);
        el.dialog({
            title: '他人登录',
            width: 400,
            height: 500,
            modal: true,
            close: function() {
                $(this).dialog('destroy');
                component.destroySelf();
            }
        });
    }
}