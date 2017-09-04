import template from './add-enrypt.html';

let css = `
    #editShow {
       margin-left: 20px; 
       margin-top: 5px;  
    }
    #inputHide{
        width: 244px;
        border: 1px solid #ddd;
        height: 30px;
        line-height: 30px;
        padding: 0;
        outline: none;
        text-indent: 10px;
        box-sizing: border-box;
        z-index: 100;
        background-color: #fff; 
    }
    #save, #cancel{
        height: 30px;
        border: 1px solid #ddd;
        background: #0088ff;
        color: #fff;
        width: 65px;
        border-radius: 5px;
        cursor: pointer;       
    }
    #save {
        margin-left: 20px;
    }

`;
let AddItem = {
    template: template.replace(/\"/g, '\''),
    data: {
        newItems: [],
    },
    data: {
        css: css.replace(/(\n)/g, ''),
    },
    actions: {
    },
    afterRender: function () {
        let _this = this;
        this.data.style = $("<style></style>").text(this.data.css).appendTo($("head"));
        this.el.on('click', '#save', function () {
            let valPw = $(this).siblings("input").val();
            console.log(valPw)
            PMAPI.sendToParent({
                type: PMENUM.close_dialog,
                key: _this.key,
                data: {
                    newItems: valPw
                }
            })
        });
        this.el.on('click', ("#cancel"), () => {
            PMAPI.sendToParent({
                type: PMENUM.close_dialog,
                key: _this.key,
                data: {
                    cancel: true,
                }
            })
        });
    },
}
export default AddItem