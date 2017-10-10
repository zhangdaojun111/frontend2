/**
 * @author zhaoyan
 * 内置展示个人信息
 */
import template from './user-info-display.html'

let css = `
.user-info-display {
    background-color: #ffffff;
    width: 100%;
    height: 100%;
}
.personal-setting-header {
    height: 130px;
}
.uid-avatar-box {
    width: 64px;
    height: 64px;
    border: solid 2px #E4E4E4;
    top: 38px;
    left: 100px;
    float: left;
    clear: both;
    border-radius: 50%;
    overflow: hidden;
    position: absolute;
}
.uid-default_avatar{
     background-image: url(data:image/png;base64,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);
}
.uid-user-avatar{
    width: 100%;
    height: 100%;
    display: block;
}
.uid-name-group {
    height: 60px;
    position: absolute;
    top: 50px;
    left: 180px;
}
.uid-name-group > .uid-name{
    height: 50px;
    line-height: 50px;
    margin-top: 5px;
    font-size: 20px;
}
.uid-view-control {
    height: 50px;
    clear: both;
}
.show-personal-info{
    width: 250px;
    height: 40px;
    line-height: 40px;
    float: left;
    margin-left: 50px;
    border-bottom: solid 1px #e4e4e4;
    text-align: center;
}
.show-personal-info.active{
    color: #0088ff;
    border-bottom: solid 1px #0088ff;
}
.uid-personal-info {
    margin-top: 10px;
}
.uid-personal-info span{
    display: inline-block;
    height: 25px;
    line-height: 25px;
    margin-top: 1px;
    vertical-align: middle;
}
.uid-department-group,.uid-position-group {
    height: 50px;
    float: left;
    margin-left: 70px;
    line-height: 50px;
    position: relative;
}
input.uid-department-info,input.uid-position-info,input.uid-email-info,input.uid-phone-info{
    width:180px;
    height: 25px;
    overflow: hidden;
    white-space:nowrap;
    text-overflow: ellipsis;
    background-color: transparent;
    border: none;
    !important;
}
.uid-email-group,.uid-phone-group {
    height: 50px;
    float: left;
    margin-left: 70px;
    line-height: 50px;
    position: relative;
}
`;

let userInfoDisplay = {
    template: template.replace(/\"/g, '\''),
    data:{
        css: css.replace(/(\n)/g, ''),
        userInfo:{},
        userName:''
    },
    actions:{
        /**
         * 展示用户基本信息
         */
        displayTargetInfo:function () {
            this.el.find('.uid-department-info').val(this.data.userInfo.user_department).attr('title',this.data.userInfo.user_department);
            this.el.find('.uid-email-info').val(this.data.userInfo.user_email).attr('title',this.data.userInfo.user_email);
            this.el.find('.uid-position-info').val(this.data.userInfo.user_job).attr('title',this.data.userInfo.user_job);
            this.el.find('.uid-phone-info').val(this.data.userInfo.user_tel).attr('title',this.data.userInfo.user_tel);
            this.el.find('.uid-name').html(this.data.userName);
            if(this.data.userInfo.avatar === ""){
                this.data.avatar = "";
            }else{
                this.data.avatar = "/mobile/get_file/?file_id=" + this.data.userInfo.avatar + "&download=0";
            }
            this.actions.initInfo();
        },
        /**
         * 初始化，检测用户头像路径返回值，没有则显示默认头像
         */
        initInfo:function () {
            let src = this.data.avatar;
            if(src !== ''){
                let $img = $("<img>").addClass("uid-user-avatar").attr('src',src);
                this.el.find(".uid-avatar-box").append($img);
                let that = this;
                $img.on('error', function () {
                    that.el.find(".uid-avatar-box").addClass('uid-default_avatar');
                    $img.remove();
                });
            }else{
                this.el.find("div.uid-avatar-box").addClass('uid-default_avatar');
            }
        },
    },
    binds:[],
    afterRender:function () {
        this.actions.displayTargetInfo();
        this.data.style = $("<style></style>").text(this.data.css).appendTo($("head"));
    },
    beforeDestory:function () {
        this.data.style.remove();
    }
};

export default userInfoDisplay;