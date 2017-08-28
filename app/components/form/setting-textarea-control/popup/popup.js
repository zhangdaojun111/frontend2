import template from './popup.html';
import {textareaTextDict} from '../options';
let css = `
.form-setting-textarea-popup {
    overflow: hidden;
    font-size: 12px;
    padding: 20px;
}
.form-setting-textarea-popup-tips {
    margin: 0;
    margin-bottom: 10px;
    height: 40px;
    line-height: 20px;
    color: red;
}
.form-setting-textarea-popup-ul {
    list-style: none;
    margin: 0;
    padding: 0;
    border-left: 1px solid #ddd;
    border-top: 1px solid #ddd;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: stretch;
    align-content: flex-start;
    height: 420px;
    overflow: auto;
}
.form-setting-textarea-popup-li {
    list-style: none;
    margin: 0;
    padding: 0;
    line-height: 20px;
    width: 33.3333%;
    padding: 10px;
    box-sizing: border-box;
    border: 1px solid #ddd;
    margin: -1px 0 0 -1px;
    align-items: center;
    display: flex;
}
.form-setting-textarea-popup-li.error {
    background-color: #ef9393;
}
.form-setting-textarea-popup-checkbox {
    float: left;
    margin: 3px 4px 0 0;
}
.form-setting-textarea-popup-inputtext {
    border: 0 none;
    width: 30px;
    border-bottom: 1px solid #ddd;
    margin:0 5px;
    padding:0;
    text-align: center;
    background: transparent;
}
.form-setting-textarea-popup-save {
    margin: 0;
    padding: 0;
    width: 120px;
    height: 40px;
    float: right;
    margin-top: 20px;
}
`;

let dealedTextareaTextDict = {};
for(let key in textareaTextDict){
    dealedTextareaTextDict[key] = textareaTextDict[key].replace(/\$/g, `<input type='text' class='form-setting-textarea-popup-inputtext'>`);
}

let popupSetting = {
    template: template,
    data: {
        textareaTextDict,
        dealedTextareaTextDict,
        array1: [66,0,1,2,3,4,5,6,7,8,9,10,11,12,13,59,15,60,17,61],
        array2: [67,44,49,45,50,46,62,58,47,63,48,64,65,14,16,18],
        array3: [19,20,21,22,23,24,25,26,27,28,29,30,31,32,51,52,53,54,33,34,35,36,37,38,39,40,41,55,42,56,43,57],
        css: css.replace(/(\n)/g, '')
    },
    actions: {

        valid: function (item) {
            if (item.find('input:checkbox').is(':checked')) {
                let key = parseInt(item.attr('key'));
                let inputs = item.find('input:text');
                let error = false;
                inputs.each(function () {
                    let value = $(this).val();
                    if (value === '') {
                        error = true;
                    }
                });
                if (error) {
                    item.addClass('error');
                } else {
                    item.removeClass('error');
                }
                return error;
            } else {
                item.removeClass('error');
                return false;
            }
        },

        onTextInput: function (input) {
            let originVal = input.val();
            if (_.trim(originVal) === '0' ) {
                input.val('');
                return;
            }
            let value = parseInt(originVal);
            if (value.toString() !== originVal) {
                if (_.isNaN(value)) {
                    value = '';
                }
                input.val(value);
            }
            this.actions.valid(input.parentsUntil('ul').last());
        },

        showMessage: function (msg) {
            if (msg) {
                this.el.find('.form-setting-textarea-popup-tips').html(msg);
            } else {
                this.el.find('.form-setting-textarea-popup-tips').html("注释：①无后缀的规则默认法定工作日日期规则。②后缀为“（交易日）”按交易所交易日日期规则。③后缀为“提前”的规则即“遇节假日则提前至最后一个工作日/交易日”。");
            }
        },

        fillData: function () {
            if (this.data.choosedData) {
                let choosedData = this.data.choosedData;
                for (let key in choosedData) {
                    let item = this.el.find(`.form-setting-textarea-popup-li[key=${key}]`);
                    item.find('input:checkbox').attr('checked', true);
                    item.find('input:text').each(function(index) {
                        $(this).val(choosedData[key][index]);
                    })
                }
            }
        },

        save: function () {
            let that = this;
            let selects = this.el.find('input:checkbox:checked');
            if (selects.length === 0) {
                this.actions.showMessage('您必须选择一个选项！');
            } else {

                let passValid = this.el.find('.form-setting-textarea-popup-li.error').length === 0;
                if (!passValid) {
                    this.actions.showMessage('您必须修复红色格子内的数据才能提交！');
                } else {
                    let res = {
                        '-1': []
                    };
                    selects.each(function () {

                        let item = $(this).parentsUntil('ul').last();
                        let key = item.attr('key');
                        res[key] = [];
                        let inputs = item.find('input:text').each(function () {
                            res[key].push(parseInt($(this).val()));
                        });
                        let str = that.data.textareaTextDict[parseInt(key)];
                        res[key].forEach((v) => {
                            str = str.replace('$', v);
                        })
                        res['-1'].push(str);
                    });
                    PMAPI.sendToParent({
                        type: PMENUM.close_dialog,
                        key: this.key,
                        data: {
                            choosedData: res
                        }
                    })
                }
            }
        }
    },
    afterRender: function () {
        this.data.style = $("<style></style>").text(this.data.css).appendTo($("head"));
        this.el.find('.form-setting-textarea-popup-save').button()
        this.el.on('click', '.form-setting-textarea-popup-save', () => {
            this.actions.save();
        });

        this.actions.fillData();

        let that = this;
        this.el.find('input:text').on('input', function () {
            let input = $(this);
            that.actions.onTextInput(input);
        });
        this.el.find('input:checkbox').on('change', function () {
            that.actions.valid($(this).parentsUntil('ul').last());
        });
    },
    beforeDestory: function () {
        this.data.style.remove();
    }
};

export default popupSetting;