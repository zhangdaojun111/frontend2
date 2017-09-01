import template from './popup.html';
import {textareaTextDict} from '../options';
let css = `
.form-setting-textarea-popup {
    overflow: hidden;
    font-size: 12px;
    padding: 20px;
}
.form-setting-textarea-popup p.line {
    width: 100%;
    border-top: 1px solid #eaeaea;
}
.form-setting-textarea-popup-tips {
    margin: 0;
    margin-bottom: 10px;
    height: 40px;
    line-height: 20px;
    color: red;
}
.form-setting-textarea-popup-ul-wrap {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: stretch;
    align-content: flex-start;
    height: 420px;
    overflow: auto;
}
.form-setting-textarea-popup-ul {
    user-select: none;
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: stretch;
    align-content: flex-start;
    width: 50%;
}
.form-setting-textarea-popup-ul.remain {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: stretch;
    align-content: flex-start;
    width: 100%;
}
.form-setting-textarea-popup-ul.remain .form-setting-textarea-popup-li {
    width: 50%;
}
.form-setting-textarea-popup-li {
    list-style: none;
    margin: 0;
    padding: 0;
    line-height: 20px;
    width: 340px;
    padding: 10px;
    box-sizing: border-box;
    align-items: center;
    display: flex;
}
.form-setting-textarea-popup-li.error {
    background-color: #ef9393;
}
.form-setting-textarea-popup-checkbox {
    float: left;
    margin: 3px 4px 0 0;
    outline: none;
}
.form-setting-textarea-popup-inputtext {
    border: 0 none;
    width: 30px;
    border-bottom: 1px solid #ddd;
    margin:0 5px;
    padding:0;
    text-align: center;
    background: transparent;
    outline: none;
}
.form-setting-textarea-popup-save {
    margin: 0;
    padding: 0;
    width: 80px;
    height: 34px;
    float: right;
    margin-top: 20px;
    border-radius: 5px;
    background-color: #0088ff;
    color: #fff;
    border: 0 none;
}
`;

let dealedTextareaTextDict = {};
for(let key in textareaTextDict){
    dealedTextareaTextDict[key] = textareaTextDict[key].replace(/\$/g, `<input type='text' class='form-setting-textarea-popup-inputtext'>`);
}

let popupSetting = {
    template: template.replace(/\"/g, '\''),
    data: {
        textareaTextDict,
        dealedTextareaTextDict,
        arrayLeft: [66,0,1,2,3,4,5,6,7,8,9,10,11,12,13,59,15,60,17,61],
        arrayRight: [67,44,49,45,50,46,62,58,47,63,48,64,65,14,16,18],
        arrayRemain: [19,20,21,22,23,24,25,26,27,28,29,30,31,32,51,52,53,54,33,34,35,36,37,38,39,40,41,55,42,56,43,57],
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
                    let checkbox = item.find('input:checkbox')[0];
                    checkbox.checked = true;
                    console.log(key);
                    if (key === '66' || key === '67') {
                        $(checkbox).trigger('change');
                    }
                    item.find('input:text').each(function(index) {
                        $(this).val(choosedData[key][index]);
                    });
                }
            }
        },

        /**
         * 渲染无开放日
         */
        renderLeft: function () {
            let html = [];
            let that = this;
            this.data.arrayLeft.forEach(function(key) {
                html.push(`<li class=form-setting-textarea-popup-li key=${key}><label><input key=${key} type=checkbox class=form-setting-textarea-popup-checkbox>${that.data.dealedTextareaTextDict[key]}</label></li>`);
            });
            this.leftWrap.html(html.join(''));
        },

        /**
         * 渲染五无固定开放日
         */
        renderRight: function () {
            let html = [];
            let that = this;
            this.data.arrayRight.forEach(function(key) {
                html.push(`<li class=form-setting-textarea-popup-li key=${key}><label><input key=${key} type=checkbox class=form-setting-textarea-popup-checkbox>${that.data.dealedTextareaTextDict[key]}</label></li>`);
            });
            this.rightWrap.html(html.join(''));
        },

        /**
         * 渲染剩下的所有
         */
        renderRemain: function () {
            let html = [];
            let that = this;
            this.data.arrayRemain.forEach(function(key) {
                html.push(`<li class=form-setting-textarea-popup-li key=${key}><label><input key=${key} type=checkbox class=form-setting-textarea-popup-checkbox>${that.data.dealedTextareaTextDict[key]}</label></li>`);
            });
            this.remainWrap.html(html.join(''));
        },

        onCheckboxChange: function (input) {
            let checked = input.checked;
            let $input = $(input);
            let key = $input.attr('key');
            let that = this;

            function removeChecked(list) {
                list.each(function (index, item) {
                    if (item.checked) {
                        item.checked = false;
                        that.actions.valid($(item).parentsUntil('ul').last());
                    }
                })
            }

            if (key === '66' || key === '67') {
                console.log(input);
                if (checked) {
                    this.leftCheckbox.removeAttr('disabled');
                    removeChecked(this.rightCheckbox);
                    removeChecked(this.leftCheckbox);
                    removeChecked(this.remainCheckbox);
                    this.leftCheckbox.attr('disabled', 'true');
                    this.rightCheckbox.attr('disabled', 'true');
                    this.remainCheckbox.attr('disabled', 'true');
                    input.checked = true;
                    $input.removeAttr('disabled');
                } else {
                    this.leftCheckbox.removeAttr('disabled');
                    this.rightCheckbox.removeAttr('disabled');
                    this.remainCheckbox.removeAttr('disabled');
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
    binds: [
        {
            event: 'change',
            selector: '.form-setting-textarea-popup-checkbox',
            callback: function (context) {
                this.actions.onCheckboxChange(context);
            }
        }, {
            event: 'click',
            selector: '.form-setting-textarea-popup-save',
            callback: function () {
                this.actions.save();
            }
        }, {
            event: 'input',
            selector: 'input:text',
            callback: function(context) {
                this.actions.onTextInput($(context));
            }
        }, {
            event: 'change',
            selector: 'input:checkbox',
            callback: function (context) {
                this.actions.valid($(context).parentsUntil('ul').last());
            }
        }
    ],
    afterRender: function () {

        this.leftWrap = this.el.find('.form-setting-textarea-popup-ul.left');
        this.rightWrap = this.el.find('.form-setting-textarea-popup-ul.right');
        this.remainWrap = this.el.find('.form-setting-textarea-popup-ul.remain');

        this.actions.renderLeft();
        this.actions.renderRight();
        this.actions.renderRemain();

        this.leftCheckbox = this.leftWrap.find('input:checkbox');
        this.rightCheckbox = this.rightWrap.find('input:checkbox');
        this.remainCheckbox = this.remainWrap.find('input:checkbox');

        this.data.style = $("<style></style>").text(this.data.css).appendTo($("head"));
        this.actions.fillData();
    },
    beforeDestory: function () {
        this.data.style.remove();
    }
};

export default popupSetting;