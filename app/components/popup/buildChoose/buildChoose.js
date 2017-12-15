import Component from "../../../lib/component";
import {HTTP} from "../../../lib/http";
import {PMAPI, PMENUM} from "../../../lib/postmsg";
import Mediator from "../../../lib/mediator";
import {FormService} from '../../../services/formService/formService';
import './buildChoose.scss';
import FormEntry from '../../../entrys/form';
import SearchBar from "./searchBar";
import template from './buildChoose.html';
import {CreateFormServer} from "../../../services/formService/CreateFormServer";
let BuildChoose = Component.extend({
	template: template,
	data:{
		isCreatingForm:false,
	},
	binds:[
		{
			event:'click',
			selector:'.confirm',
			callback:function () {
                PMAPI.sendToParent({
                    type: PMENUM.close_dialog,
                    key: _this.data.key,
                    data: _this.data.selected
                });
            }
		}
	],
	actions:{
		_initForm:function (real_id) {
            FormEntry.initForm({
                table_id: this.data.source_table_id,
                form_id: '',
                is_view: 1,
                parent_table_id: '',
                parent_real_id: '',
                parent_temp_id: '',
                real_id: real_id,
                el: this.el.find('.ui-section'),
                btnType:'none',
            })
        },
		_appendChooseAside:function () {
            for (let i = 0, len = this.data['options'].length; i < len; i++) {
                if (this.data['options'][i]['value'] != '' && this.data['options'][i]['value']) {
                    this.el.find('ul').append(`<li><a class="choose-aside-a" href="javascript:void(0);" title="${this.data['options'][i]['label']}" data-value="${this.data['options'][i]['value']}">${this.data['options'][i]['label']}</a></li>`)
                }
            }
        },
		_subscribeMediators:function () {
            //搜索结果过滤
            Mediator.subscribe('form:chooseSelect', (data) => {
                this.el.find('a.choose-aside-a').each((index, obj) => {
                    if (data.indexOf($(obj).data('value')) != -1) {
                        $(obj).show();
                    } else {
                        $(obj).hide();
                    }
                })
            });
            Mediator.subscribe('form:formAlreadyCreate'+this.data.source_table_id,res=>{
                if(res=='success'){
                    this.data.isCreatingForm=false;
                }
            });
        },
        _getIframeParams:function () {
            PMAPI.getIframeParams(window.config.key).then(res => {
                this.data = Object.assign({}, this.data, res.data.data);
                let real_id;
                let value;
                let label;
                for (let index in this.data.options) {
                    if (this.data.options[index].value) {
                        value = real_id = this.data.options[index].value;
                        label = this.data['options'][index]['label']
                        break;
                    }
                }
                this.actions._initForm(real_id);
                this.actions._appendChooseAside();
                let searchBar = new SearchBar({data:{tableId: this.data.source_table_id}});
                this.append(searchBar, this.el.find('.search-bar'));
                this.data.selected = {value: value, label: label};
            });
            HTTP.flush();
        }
	},
	afterRender() {
	    this.actions._getIframeParams();
		let _this = this;
        this.el.on('click', 'a.choose-aside-a', function () {
            if(_this.data.isCreatingForm){
                return;
            }
            _this.data.isCreatingForm=true;
            _this.data.selected = {value: $(this).data('value'), label: $(this).html()};
            CreateFormServer.destoryForm(_this.data.source_table_id);
            _this.el.find('.ui-section').empty();
            _this.actions._initForm($(this).data('value'));
        })
	},
	firstAfterRender:function () {
        //改变表单
        let el;
        Mediator.on('form: dataRes', (res) =>{
            if(res[1].error !== '您没有数据查看权限'){
                el = this.el.find('.ui-section');
            }
        });
        this.actions._subscribeMediators();
    }
});

export default BuildChoose;