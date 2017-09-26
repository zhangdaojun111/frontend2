import template from './autoSelect.html';
import './autoSelect.scss';
import Component from '../../../lib/component';
// import {AutoSelectItem} from './item/item';

let config = {
    template: template,
    data: {
        /**
         * 数据格式
         * {
         *     id: '',
         *     name: '',
         *     py: ''
         * }
         */
        list: [],                       // 全部列表
        /**
         * {
         *      id: '',
         *      name: ''
         * }
         */
        choosed: [],                    // 已经选择的数据
        displayType: 'popup',           // popup或者static popup为弹出的形式 static 为静态显示
        multiSelect: true,              // 是否多选
        selectBoxHeight: 'auto',           // select 框的高度
        width: 0,                       // 为0表示显示默认宽度240
        editable: true,                 // 是否可编辑
        onSelect: null,                  // 选择时的事件
        placeholder: '',
        focusItem:null,                 //记录键鼠当前指向的item
    },
    actions: {
        selectItem: function (item) {
            if (this.data.multiSelect === true) {
                let choosed = this.el.find('input:checked');
                choosed = Array.from(choosed).map((item) => {
                    let $item = $(item);
                    return {
                        id: $item.data('id'),
                        name: $item.data('name')
                    }
                });
                this.data.choosed = choosed;
            } else {
                if (item.find('input:checkbox')[0].checked) {
                    this.data.choosed = [{
                        id: item.data('id'),
                        name: item.data('name')
                    }];
                    this.actions.hideSelectBox();
                } else {
                    this.data.choosed = [];
                }
            }
            this.actions.renderChoosed();
        },
        unSelectItem: function (id) {
            _.remove(this.data.choosed, function (item) {
                return item.id === id;
            });
            this.actions.renderChoosed();
        },
        clearValue: function () {
            this.data.choosed = [];
            this.actions.renderChoosed();
        },
        onInput: function (input) {
            let value = _.trim(input.val());
            input.val(value);
            if (value === '') {
                this.listWrap.find('li').show();
            } else {
                this.listWrap.find('li').hide();
                this.listWrap.find(`li[data-name*=${value}]`).show();
                this.listWrap.find(`li[data-py*=${value}]`).show();
            }
        },
        showSelectBox: function () {
            this.listWrap.show();
            this.data.isSelectBoxDisplayed = true;
            //设置搜索框焦点
            this.el.find('.auto-select-text').focus();
            //第一个备选项设置光标，并设置当前焦点dom
            this.data.focusItem = this.el.find("ul li:first-child").addClass('selected');
            //开始监听键盘
            this.actions.startListenKeyboard();
        },
        hideSelectBox: function () {
            if (this.listWrap) {
                this.listWrap.hide();
                this.data.isSelectBoxDisplayed = false;
                this.actions.stopListenKeyboard();
            }
        },
        getValue: function () {
            return this.data.choosed;
        },
        setChoosed: function (choosed) {
            this.data.choosed = choosed;
            this.actions.renderChoosed();
        },
        setList: function (list) {
            this.data.list = list;
            this.reload();
            // this.actions.renderChoosed();
        },
        renderChoosed: function () {
            this.listWrap.find('input:checkbox:checked').each(function () {
                this.checked = false;
            });
            if (this.data.onSelect) {
                this.data.onSelect(this.data.choosed);
            }
            this.trigger('onSelect', this.data.choosed);
            let html = [];
            if (this.data.choosed.length) {
                this.data.choosed.forEach((item) => {
                    if (!_.isUndefined(item.id)) {
                        let checkbox = this.listWrap.find(`input:checkbox[data-id=${item.id}]`);
                        if (checkbox.length) {
                            checkbox[0].checked = true;
                        }
                        html.push(item.name);
                    }
                });
            }
            this.inputResult.val(html.join(','));
            this.el.find('.select-all span').text(this.data.choosed.length);
        },
        selectAll: function () {
            if (this.data.choosed.length === this.data.list.length) {
                this.data.choosed = [];
            } else {
                this.data.choosed = this.data.list;
            }
            this.actions.renderChoosed();
        },
        /**
         * 开始监听上下回车键
         */
        startListenKeyboard(){
            console.log("aaaaa");
            this.el.on('keydown','.auto-select-text',function (event) {
                console.log("dsdasdsa",event);
                let keyCode = event.keyCode;
                if(keyCode === 13){
                    console.log('select');
                }else if(keyCode === 40){
                    console.log('40');
                }else if(keyCode === 38){
                    console.log('38');
                }
            })
        },
        /**
         * 停止监听键盘
         */
        stopListenKeyboard(){

        }
    },
    binds:[
        {
            event: 'click',
            selector: 'li',
            callback: _.debounce(function (context) {
                this.actions.selectItem($(context));
            }, 50)
        },{
            event: 'input',
            selector: 'input.auto-select-text',
            callback: _.debounce(function (context) {
                this.actions.onInput($(context));
            }, 1000)
        },{
            event: 'click',
            selector: '.choosed .item',
            callback: function (context) {
                let id = $(context).data('id');
                this.actions.unSelectItem(id);
            }
        },{
            event: 'click',
            selector: '.select-all a',
            callback: function () {
                this.actions.selectAll();
            }
        },{
            event: 'click.visible',
            selector: '.result,.triangle',
            callback: function () {
                if (this.data.isSelectBoxDisplayed) {
                    this.actions.hideSelectBox();
                } else {
                    this.actions.showSelectBox();
                }
            }
        },{
            event: 'mouseleave.visible',
            selector: '',
            callback: function () {
                // this.actions.hideSelectBox();
            }
        }
    ],
    afterRender: function () {
        this.listWrap = this.el.find('.list');
        this.inputResult = this.el.find('input.result');
        this.actions.renderChoosed();
        if (this.data.selectBoxHeight === 'auto') {
            this.listWrap.css({
                height: 'auto'
            });
            this.listWrap.find('ul').css({
                maxHeight: '150px'
            });
        } else {
            this.listWrap.height(this.data.selectBoxHeight);
            let inputHeight = this.listWrap.find('.auto-select-text-wrap').outerHeight();
            let selectAllHeight = this.listWrap.find('.select-all').outerHeight();
            this.listWrap.find('ul').css({
                maxHeight: (this.data.selectBoxHeight - inputHeight - selectAllHeight) + 'px'
            });
        }
        if (this.data.displayType === 'popup') {
            this.listWrap.addClass('popup');
        }
        if (this.data.width !== 0) {
            this.el.find('.auto-select-component').css('width', this.data.width);
        }
        if (this.data.editable === false) {
            this.el.find('.auto-select-component').addClass('disabled');
        }
        if (this.data.multiSelect === false) {
            this.listWrap.find('.select-all').hide();
            this.listWrap.find('ul').height('100%');
        }
    },
    firstAfterRender: function () {
        if (this.data.editable === true) {
            if (this.data.displayType !== 'popup') {
                this.el.off('click.visible');
                this.el.off('mouseleave.visible');
            }
        } else {
            this.cancelEvents();
        }
    }
}

class AutoSelect extends Component {

    constructor(data, events) {
        super(config, data, events);
    }

}

export {AutoSelect}