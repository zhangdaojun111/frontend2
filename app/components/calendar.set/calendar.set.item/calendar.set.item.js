/**
 * Created by zj on 2017/8/4.
 */

/**
 * @description 表设置的行数据
 */
import Component from "../../../lib/component";
import template from './calendar.set.item.html';
import './calendar.set.item.scss';
import {PMAPI} from '../../../lib/postmsg';
import Mediator from '../../../lib/mediator';
import {AutoSelect} from '../../util/autoSelect/autoSelect';

let config = {
    template: template,
    data: {
        rowSetData: {},                 // 设置的行数据
        rowTitle: '',
        dropdown: [],                   // 附加字段
        dropdownForRes: [],             // 代表字段
        dropdownForCalendarChange: [],  // 首页可修改字段
        replaceDropDown: [],            // 可配置字段

        isConfigText: true,
        selectedOpts: [],
        initAllRows: [],

        //收信人
        recipients: [],
        recipients_per: [],

        //抄送人
        copypeople: [],

        //发信箱数据
        emailAddressList: [],

        //默认选择的
        emailAddress: '',

        preViewText: [],

        forResPreviewText: '',

        newSelectedOpts: [],

        multiSelectMenu: {},
        singleSelectMenu: {},
        editable:false,

    },
    actions: {
        /**
         * @author zj
         * @param param
         * @returns {{res: Array, text: Array}}
         * 数据回显
         */
        returnShow: function (param) {
            let res = [];
            let text = [];
            for(let a of param){
                for(let b in this.data.dropdown){
                    if(a === this.data.dropdown[b]['id']){
                        res.push(this.data.dropdown[b]);
                        text.push(this.data.dropdown[b]['name']);
                    }
                }
            }
            return {res: res, text: text};
        },
        dropdownChoosed: function (param) {
            let res = [];
            let text = [];
            for(let b in this.data.dropdownForRes){
                if(param === this.data.dropdownForRes[b]['id']){
                    res.push(this.data.dropdownForRes[b]);
                    text.push(this.data.dropdownForRes[b]['name']);
                }
            }
            return {res: res, text: text};
        },

        /**
         * @author zj
         * @param forResText
         * @param forResId
         * 代表字段选中后，附加字段中对应字段也选中
         */
        checkForResSelected: function (forResText, forResId) {
            let selectedOpts = this.data.multiSelectMenu.data.choosed;
            let isInSelectedOpts = false;
            for(let item of selectedOpts) {
                if(forResId === item['id']) {
                    isInSelectedOpts = true;
                }
            }
            if(!isInSelectedOpts) {
                selectedOpts.push({id: forResId, name: forResText});
                this.data.multiSelectMenu.actions.setChoosed(selectedOpts);
                this.actions.checkSelectedOpts(selectedOpts);
            }

        },

        /**
         * @author zj
         * @param newSelectedOpts
         * 检查已选中的附加字段
         */
        checkSelectedOpts: function (newSelectedOpts) {
            let selectedOptsId = [];
            let selectedOptsText  = [];
            for(let newItem of newSelectedOpts) {
                selectedOptsText.push(newItem['name']);
                selectedOptsId.push(newItem['id']);
            }
            this.data.preViewText = selectedOptsText;
            this.el.find('.preview-text').html(this.data.preViewText);
        },
        /**
         * @author zj
         * 打开提醒方式设置
         */
        openSetRemind: function () {
            PMAPI.openDialogByIframe(
                '/iframe/calendarSetRemind/',
                {
                    width: "800",
                    height: '800',
                    title: '【'+ this.data.rowTitle.name + '】'+'的提醒'
                },{
                    emailStatus: this.data.rowSetData.email.email_status,
                    smsStatus: this.data.rowSetData.sms.sms_status,
                    sms: this.data.rowSetData.sms,
                    email: this.data.rowSetData.email,
                    recipients: this.data.recipients,
                    recipients_per: this.data.recipients_per,
                    copypeople: this.data.copypeople,
                    emailAddressList: this.data.emailAddressList,
                    emailAddress: this.data.emailAddress,
                }).then(data => {
                    if(!data.onlyclose) {
                        console.log(data);
                        this.data.rowSetData.email = data['email'];
                        this.data.rowSetData.sms = data['sms'];
                        let showMethod = '';
                        if(data['sms']['sms_status'] === '1') {
                            showMethod = '短信';
                            this.el.find('.set-remind-method').html(showMethod);
                        }
                        if (data['email']['email_status'] === '1') {
                            showMethod = showMethod + ' ' + '邮件';
                            this.el.find('.set-remind-method').html(showMethod);
                        }
                        if(data['sms']['sms_status'] === 0 && data['email']['email_status'] === 0) {
                            showMethod = '设置提醒方式';
                            this.el.find('.set-remind-method').html(showMethod);
                        }
                    }
            });
        },


        /**
         * @author zj
         * 检查已设置的首页可修改字段
         */
        checkChangeTextSelected: function () {
            let changeOpts = this.el.find('.page-change-text option');
            changeOpts.each(item => {
                if(changeOpts[item].value) {
                    let a= changeOpts[item].value;
                    if(a === this.data.rowSetData['selectedEnums']) {
                        changeOpts[item].selected  = 'selected';
                    }
                }
            });
        },
    },
    afterRender: function () {
        this.el.css({});
        let staus = false;
        let _this = this;

        let select_item_data = {
            'list': this.data.dropdown,
            displayType: 'popup',
            editable:this.data.editable,
            choosed: this.actions.returnShow(this.data.rowSetData['selectedOpts']).res,
            onSelect: function (choosed) {
                let choosedList = [];
                for(let choosedItem of choosed) {
                    choosedList.push(choosedItem['id']);
                }
                _this.data.rowSetData['selectedOpts'] = choosedList;
                _this.actions.checkSelectedOpts(choosed);
            },
        };
        this.data.multiSelectMenu = new AutoSelect(select_item_data);
        this.append(this.data.multiSelectMenu, this.el.find('.multi-select-item'));

        let single_item_data = {
            'list': this.data.dropdownForRes,
            displayType: 'popup',
            multiSelect: false,
            editable:this.data.editable,
            choosed:this.actions.dropdownChoosed(this.data.rowSetData['selectedRepresents']).res,
            onSelect: function (choosed) {
               if(choosed.length > 0){
                   _this.actions.checkForResSelected(choosed[0].name, choosed[0].id);
                   _this.data.rowSetData['selectedRepresents'] = choosed[0].id;
               }
            },
        };

        this.data.singleSelectMenu = new AutoSelect(single_item_data);
        this.append(this.data.singleSelectMenu, this.el.find('.single-select-item'));

        Mediator.on('calendar-set:editor', data => {
            if (data.data === 1) {
                this.el.find(".editor-items").attr("disabled", false);
                this.data.singleSelectMenu.destroySelf();
                _this.data.multiSelectMenu.destroySelf();
                select_item_data.editable = true;
                _this.data.multiSelectMenu = new AutoSelect(select_item_data);
                _this.append(_this.data.multiSelectMenu, _this.el.find('.multi-select-item'));
                single_item_data.editable = true;
                this.data.singleSelectMenu = new AutoSelect(single_item_data);
                this.append(this.data.singleSelectMenu, this.el.find('.single-select-item'));
                _this.el.find('td').removeClass('unclick');
                _this.el.find(".set-remind-method").removeClass('unclick');
                _this.el.find('input').removeClass('unclick');
                staus = true;
            } else {
                this.el.find(".editor-items").attr("disabled", true);
                this.data.singleSelectMenu.destroySelf();
                _this.data.multiSelectMenu.destroySelf();
                select_item_data.editable = false;
                single_item_data.editable = false;
                _this.data.multiSelectMenu = new AutoSelect(select_item_data);
                _this.append(_this.data.multiSelectMenu, _this.el.find('.multi-select-item'));
                this.data.singleSelectMenu = new AutoSelect(single_item_data);
                this.append(this.data.singleSelectMenu, this.el.find('.single-select-item'));
                _this.el.find("td").addClass('unclick');
                _this.el.find(".set-remind-method").addClass('unclick');
                _this.el.find('input').addClass('unclick');
                staus = false;
            }
        });

        this.actions.checkChangeTextSelected();

        if(!this.data.rowSetData['email']['email_status'] && !this.data.rowSetData['sms']['sms_status']) {
            this.el.find('.set-remind-method').html('设置提醒方式');
        }
        this.el.on('click', '.set-show-text-input', () => {

            let isSetShowText = this.el.find('.set-show-text-input').is(':checked');
            this.data.rowSetData['isSelected'] = isSetShowText;

        }).on('click', '.set-calendar-page-show-text', () => {

            let isShowHomePage = this.el.find('.set-calendar-page-show-text').is(':checked');
            this.data.rowSetData['is_show_at_home_page'] = isShowHomePage;

        }).on('change', '.set-color', () => {
            let setColor = this.el.find('.set-color').val();
            this.data.rowSetData['color'] = setColor;
        }).on('change', '.res-text', () => {
            let textForResValue = this.el.find('.res-text option:selected').val();
            let textForResText = this.el.find('.res-text option:selected').text();
            this.actions.checkForResSelected(textForResText, textForResValue);
            this.data.rowSetData['selectedRepresents'] = textForResValue;
        }).on('change', '.page-change-text', () => {
            let valueForCalendarChangeValue = this.el.find('.page-change-text option:selected').val();
            // let textForCalendarChangeValue = this.el.find('.page-change-text option:selected').text();

            this.data.rowSetData['selectedEnums'] = valueForCalendarChangeValue;
        }).on('click', '.set-remind-method', () => {
            if(staus){
                this.actions.openSetRemind();
            }
        }).on('change', '.config-text', () => {
            let valueConfigTextValue = this.el.find('.config-text option:selected').val();
            let textConfigTextValue = this.el.find('.config-text option:selected').text();
        });

        this.data.preViewText = this.actions.returnShow(this.data.rowSetData['selectedOpts']).text;
        this.el.find('.preview-text').text(this.data.preViewText);

        $("#set-color-id").attr("id", "set-color-" + this.data.rowSetData.field_id);
        let set_color_id = "#set-color-" + this.data.rowSetData.field_id;
        $(set_color_id).attr("value", this.data.rowSetData.color);
    },
    beforeDestory: function () {
        Mediator.removeAll('calendar-set:editor');
    }
};

class CalendarSetItem extends Component {
    constructor(data) {
        config.data.rowSetData = data.rowData;
        config.data.dropdown = data.dropdown;
        config.data.dropdownForRes = data.dropdownForRes;
        config.data.dropdownForCalendarChange = data.dropdownForCalendarChange;
        config.data.rowTitle = data.rowTitle;
        config.data.replaceDropDown = data.replaceDropDown;
        config.data.isConfigText = data.isConfigField;
        config.data.recipients = data.recipients;
        config.data.recipients_per = data.recipients_per;
        config.data.copypeople = data.copypeople;
        config.data.emailAddressList = data.emailAddressList;
        config.data.emailAddress = data.emailAddress;
        super(config);
    }
}

export default CalendarSetItem;