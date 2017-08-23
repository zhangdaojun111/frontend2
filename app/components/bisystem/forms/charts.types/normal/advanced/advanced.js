import template from './advanced.html';

let css =`
    .bi-advanced-container{
        padding-top:40px;
    }
    .bi-advanced-container ul{
        padding:0 40px;
    }
    .bi-advanced-container ul li{
        margin-bottom:20px;
        width:410px;
    }
    .bi-advanced-container ul li span{
        display:block;
        text-align:left;
        font-size:14px;
        margin-bottom:10px;
    }
    .bi-advanced-container .input-name{
        width:100%;
        height:40px;
        border:1px solid #ddd;
        text-indent:5px;
        margin-left:10px;
        outline:none;
    }
    .bi-advanced-container .textarea{
        width:100%;
        height:200px;
        line-height:30px;
        outline:0;
        overflow:auto;
        border:1px solid #ddd;
        padding:5px;
        margin-left:10px;
        resize:none;
    }
    .bi-advanced-container .template-name{
        
    }
    .bi-advanced-container .submit-area{
        padding:20px 0;
        text-align:center;
    }
    .bi-advanced-container .submit-area button{
        width:80px;
        height:40px;
        border-radius:3px;
        background:#eee;
        color:#999;
        border:0;
        letter-spacing:2px;
        outline:0;
        cursor:pointer;
        margin:0 10px;
    }
    .bi-advanced-container .submit-area .submit{
        background:#3b8cff;
        color:#fff;
    }
`;
export let config = {
    template:template,
    data: {
        css:css.replace(/(\n)/g, ''),
    },
    actions: {},
    afterRender() {
        //添加样式
        $(`<style>${this.data.css}</style>`).appendTo(this.el);
    },
    beforeDestory: function () {
    }
};