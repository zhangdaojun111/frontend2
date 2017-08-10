import template from './add-enrypt.html';
let css = ``;
css = css.replace(/(\n)/g, '')
let AddItem = {
    template: template.replace(/\"/g, '\''),
    data: {
        // text:'哈哈',
        newItems:[],
    },
    actions:{
        // hasExistInOriginal:function(addItemContent) {
        //     let isExist = false;
        //     for(let key in this.data.originalOptions) {
        //         if(this.data.originalOptions[key]["label"] == addItemContent){
        //             isExist = true;
        //         }
        //     }
        //     return isExist;
        // },
    },
    firstAfterRender:function(){
        let _this=this;
        this.el.on('click', '#save', function () {
            let valPw = $(this).siblings("input").val();
            if (valPw != '') {
                    _this.data.newItems.push(valPw);
                    _this.el.find('#inputShow').val(`${valPw}`);
            }
            console.log(valPw)
                    PMAPI.sendToParent({
                        type: PMENUM.close_dialog,
                        key: _this.key,
                        data: {
                            newItems:valPw
                        }
                    })
            });
        this.el.on('click', ("#cancel"), ()=> {
            PMAPI.sendToParent({
                type: PMENUM.close_dialog,
                key: _this.key,
                data: {
                    cancel:true,
                }
            })
        });
    },
    afterRender: function() {
    },
}
export default AddItem