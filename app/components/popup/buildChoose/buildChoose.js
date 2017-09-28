/**
 *@author yudeping
 *内置选择器
 */

import Component from "../../../lib/component";
import {HTTP} from "../../../lib/http";
import {PMAPI, PMENUM} from "../../../lib/postmsg";
import Mediator from "../../../lib/mediator";
import {FormService} from '../../../services/formService/formService';
import './buildChoose.scss';
import FormEntry from '../../../entrys/form';
import SearchBar from "./searchBar";
import template from './buildChoose.html';

let config = {
    template: template,
    data:{
        isCreatingForm:false,
    },
    afterRender() {
        let _this = this;
        FormService.getStaticData({field_id: this.data.fieldId}).then(res => {
            if(res.error == '您没有数据查看权限') {
                _this.el.find('.ui-section').append('<p style="font-size:20px">您没有数据查看权限</p>')
            }
           _this.data = Object.assign({},  _this.data, res['data'][0]);
            let real_id= _this.data['options'][1]['value'];
            if(!real_id){
                for(let index in _this.data['options']){
                    if(index==0 || index==1){
                        continue;
                    }
                    if(_this.data['options'][index]['value']){
                        real_id=_this.data['options'][index]['value']
                        break;
                    }
                }
            }
            let r1 = FormEntry.createForm({
                table_id: _this.data.source_table_id,
                form_id: '',
                is_view: 1,
                parent_table_id: '',
                parent_real_id: '',
                parent_temp_id: '',
                real_id: real_id,
                el: _this.el.find('.ui-section'),
                btnType:'none',
            })
            if(!r1){
                _this.el.find('.ui-section').append('<p style="font-size:20px">您没有数据查看权限</p>')
            }
                for (let i = 0, len = _this.data['options'].length; i < len; i++) {
                    if (_this.data['options'][i]['value'] != '' && _this.data['options'][i]['value']) {
                        _this.el.find('ul').append(`<li><a class="choose-aside-a" href="javascript:void(0);" title="${_this.data['options'][i]['label']}" data-value="${_this.data['options'][i]['value']}">${_this.data['options'][i]['label']}</a></li>`)
                    }
                }

            let searchBar = new SearchBar({tableId: _this.data.source_table_id});
            _this.append(searchBar, _this.el.find('.search-bar'));
            _this.data.selected = {value: _this.data['options'][1]['value'], label: _this.data['options'][1]['label']};
        });
        HTTP.flush();
        //改变表单
        _this.el.on('click', 'a.choose-aside-a', function () {
            if(_this.data.isCreatingForm){
                return;
            }
            _this.data.isCreatingForm=true;
            _this.data.selected = {value: $(this).data('value'), label: $(this).html()};
            FormEntry.destoryForm(_this.data.source_table_id);
            let r2 =  FormEntry.createForm({
                table_id: _this.data.source_table_id,
                form_id: '',
                is_view: 1,
                parent_table_id: '',
                parent_real_id: '',
                parent_temp_id: '',
                real_id: $(this).data('value'),
                el: _this.el.find('.ui-section'),
                btnType: 'none'
            })
            if(!r2){
                _this.el.find('.ui-section').append('<p style="font-size:20px">您没有数据查看权限</p>')
            }
        })
        //搜索结果过滤
        Mediator.subscribe('form:chooseSelect', function (data) {
            _this.el.find('a.choose-aside-a').each((index, obj) => {
                if (data.indexOf($(obj).data('value')) != -1) {
                    $(obj).show();
                } else {
                    $(obj).hide();
                }
            })
        });
        //确认选择
        this.el.on('click', '.confirm', function () {
            PMAPI.sendToParent({
                type: PMENUM.close_dialog,
                key: _this.data.key,
                data: _this.data.selected
            })
        });
        Mediator.subscribe('form:formAlreadyCreate'+this.data.source_table_id,res=>{
            if(res=='success'){
                _this.data.isCreatingForm=false;
            }
        })
    }
}

export default class BuildChoose extends Component {
    constructor(data) {
        super(config, data);
    }
}