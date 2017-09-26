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
        mouseActive:false,              //标记鼠标是否在移动
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
            // this.data.mouseActive = false;
            this.el.find('ul li').removeClass('hovered').removeClass('match-visible');
            let value = _.trim(input.val());
            input.val(value);
            if (value === '') {
                this.listWrap.find('li').addClass('match-visible').show();
                // this.data.focusItem = this.el.find('ul li:first-child').addClass('hovered');
                let index = this.data.focusItem.index();
                let scrollTop = Math.max(0,(index-2) * 30);
                this.el.find('.auto-select-ul').scrollTop(scrollTop);
                this.data.focusItem.addClass('hovered');
            } else {
                this.listWrap.find('li').hide();
                this.listWrap.find(`li[data-name*=${value}]`).addClass('match-visible').show();
                this.listWrap.find(`li[data-py*=${value}]`).addClass('match-visible').show();
                let $matchItems = this.el.find('li.match-visible');
                if($matchItems.length > 0){
                    this.data.focusItem = $matchItems.eq(0).addClass('hovered');
                    this.el.find('.auto-select-ul').scrollTop(0);
                }
            }
        },
        showSelectBox: function () {
            this.listWrap.show();
            this.data.isSelectBoxDisplayed = true;
            //设置搜索框焦点
            this.el.find('.auto-select-text').focus();
            this.el.find('.auto-select-ul').scrollTop(0);
            //第一个备选项设置光标，并设置当前焦点dom
            this.el.find("ul li").removeClass('hovered');
            this.data.focusItem = this.el.find("ul li:first-child").addClass('hovered');
            //开始监听键盘
            this.actions.startListenKeyboard();
        },
        hideSelectBox: function () {
            if (this.listWrap) {
                this.actions.resetAutoSelect();
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
        startListenKeyboard:function(){
            let that = this;
            this.el.on('keydown','.auto-select-component',function (event) {
                that.data.mouseActive = false;
                let keyCode = event.keyCode;
                if(keyCode === 13){
                    that.actions.setCheckBoxByKeyboard();
                }else if(keyCode === 40){
                    // that.data.mouseActive = false;
                    let $next = that.data.focusItem.nextAll('.match-visible');
                    if($next.length > 0){
                        that.data.focusItem.removeClass('hovered');
                        that.data.focusItem = $next.eq(0);
                        that.data.focusItem.addClass('hovered');
                        let index = that.data.focusItem.index();
                        let scrollTop = Math.max(0,(index-2) * 30);
                        that.el.find('.auto-select-ul').scrollTop(scrollTop);
                    }
                }else if(keyCode === 38){
                    // that.data.mouseActive = false;
                    let $prev = that.data.focusItem.prevAll('.match-visible');
                    if($prev.length > 0){
                        that.data.focusItem.removeClass('hovered');
                        that.data.focusItem = $prev.eq(0);
                        that.data.focusItem.addClass('hovered');
                        let index = that.data.focusItem.index();
                        let scrollTop = Math.max(0,(index-2) * 30);
                        that.el.find('.auto-select-ul').scrollTop(scrollTop);
                    }
                }
            })
        },
        /**
         * 停止监听键盘
         */
        stopListenKeyboard:function(){
            this.el.off('keydown');
        },
        /**
         * 鼠标指向某条li，做样式处理和记录当前焦点
         */
        setMouseHover:function (event) {
            console.log(this.data.mouseActive);
            if(this.data.mouseActive === true){
                this.el.find('li').removeClass('hovered');
                this.data.focusItem = $(event.currentTarget);
                this.data.focusItem.addClass('hovered');
            }
        },
        /**
         * 键盘监听设置当前选中项的checkbox
         */
        setCheckBoxByKeyboard:function () {
            let $checkbox = this.data.focusItem.find('input:checkbox');
            if($checkbox.prop('checked') === true){
                $checkbox.prop('checked',false);
            }else{
                $checkbox.prop('checked',true);
            }
            this.actions.selectItem(this.data.focusItem);
        },
        setMouseMove:function () {
            this.data.mouseActive = true;
        },
        /**
         * 退出时重置组件
         */
        resetAutoSelect:function () {
            this.el.find('.auto-select-text').val('');
            this.el.find('ul li').addClass('match-visible').show();
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
            }, 500)
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
            selector: '.auto-select-component',
            callback: function () {
                if(this.data.mouseActive === true) {
                    this.actions.hideSelectBox();
                }
            }
        },
        {
            event:'mouseenter',
            selector:'li',
            callback:function (target,event) {
                this.actions.setMouseHover(event);
            }
        },
        {
            event:'mousemove',
            selector:'.auto-select-component',
            callback:function(){
                this.actions.setMouseMove();
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