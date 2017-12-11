/**
 * @author zhaoyan
 * 他人登录界面
 */

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
        _otherId:''
    },
    actions:{
        /**
         * 获取用户名单列表
         */
        getData:function () {
            UserInfoService.getAllUsersInfo().done((result) => {
                let tempData = [];
                if(result.success === 1){
                    this.data.userData = result.rows;
                    for (let row of this.data.userData){
                        if(row.name && row.name.trim() !== '' && row.id && row.id.trim() !== ''){
                            if( row.f7_p ){
                                row.py = row.f7_p.join(',');
                            }else {
                                row.py = ''
                            }
                            tempData.push(row);
                        }
                    }
                    this.actions.initList(tempData);
                }else{
                    console.log("获取数据失败",result);
                }
            }).fail((err) => {
                console.log("获取数据失败",err);
            })
        },
        /**
         * 使用组件绘制下拉框
         * @param tempData
         */
        initList:function (tempData) {
            let $wrap = this.el.find('.user-list');
            let that = this;
            let autoSelect = new AutoSelect({data:{
                list: tempData,
                multiSelect: false,
                editable: true,
                onSelect: function (choosed) {
                    if(choosed.length > 0){
                        that.data._otherId = choosed[0].id;
                    }else{
                        that.data._otherId = '';
                    }
                }
            }});
            autoSelect.render($wrap);
        },
        /**
         * 向后台发送他人登录请求
         */
        loginOtherAccount:function () {
            let userId = this.data._otherId;
            userId = userId.trim();
            if(userId && userId !== ''){
                //执行以选中人的账号登录
                return UserInfoService.change_login_user(userId).done((result) => {
                    if(result.success === 0){
                        msgbox.alert("切换用户失败，原因是" + result.error);
                    }
                    if(result.success === 1){
                        location.reload(false);
                    }
                })
            }
        },
    },
    binds:[
        {
            event:'click',
            selector:'.confirm-btn',
            callback:_.debounce(function(){
                this.actions.loginOtherAccount();
            },100)
        },
        {
            event:'click',
            selector:'.cancel-btn',
            callback:function () {
                LoginByOther.hide();
            }
        }
    ],
    afterRender:function () {
        this.actions.getData();
    },
    beforeDestory:function () {

    }
};

class LoginOther extends Component{
    constructor(newConfig){
        super($.extend(true,{},config,newConfig));
    }
}

export const LoginByOther =  {
    el:null,
    show: function() {
        let component = new LoginOther();
        this.el = $('<div class="login-by-other">').appendTo(document.body);
        component.render(this.el);
        this.el.erdsDialog({
            title: '他人登录',
            width: 400,
            height: 500,
            modal: true,
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