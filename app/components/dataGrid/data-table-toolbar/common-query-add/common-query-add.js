import template from './common-query-add.html';
import msgBox from '../../../../lib/msgbox';
import './common-query-add.scss';
let css = `
.add-container{
    padding: 20px;
    overflow: hidden;
}
.add-container .input-box {
    text-align: center;
}
.add-container .input-box .title{
    display: inline-block;
    font-size: 12px;
    font-weight: bold;
    margin-right: 15px;
}
.add-container .input-box input{
    width: 240px;
    height: 30px;
}
.add-container .button-box {
    position: absolute;
    bottom: 30px;
    right: 35px;
}
.add-container .button-box .save-btn{
    cursor: pointer;
    width: 90px;
    height: 30px;
    background-color: #0088ff;
    border: 1px solid #0088ff;
    border-radius: 4px;
    color: #fff;
    margin-right: 8px;
    font-size:12px;
}
.add-container .button-box .cancel-btn {
    cursor: pointer;
    width: 90px;
    height: 30px;
    background-color: #fff;
    border: 1px solid #d7d7d7;
    border-radius: 4px;
    color: #666;
    margin-right: 8px;
    font-size:12px;
}
\`;
`;
let addQuery = {

    template: template,
    data: {
        css: css.replace(/(\n)/g, ''),
        name:null
    },
    actions: {
        btnClick: function () {
            let _this = this;
            $( '.save-btn' ).click( ()=>{
                PMAPI.sendToParent( {
                    key: this.key,
                    type: PMENUM.close_dialog,
                    data: {
                        value: _this.el.find('.query-name-input').val()
                    }
                } )
            } )
            $( '.cancel-btn' ).click( ()=>{
                PMAPI.sendToParent( {
                    key: this.key,
                    type: PMENUM.close_dialog,
                    data:{
                        onlyclose: true
                    }
                } )
            } )
        }
    },
    afterRender: function () {
        this.data.style = $("<style></style>").text(this.data.css).appendTo($("head"));
        if (this.data.name) {
            $('.query-name-input').val(this.data.name);
        }
        this.actions.btnClick();
    },
    beforeDestory: function () {

    }
};
export default addQuery;
