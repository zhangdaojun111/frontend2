/**
 * Created by zhr
 */

import Component from "../../../../lib/component";
import template from './fast-search.html';
import msgBox from '../../../../lib/msgbox';
import './fast-search.scss';
let config = {
    template: template,
    inputObject: null,
    inputNextObject: null,
    rendItemNum:0,
    ulChecked: true,
    data: {
        expertItemData: [],
        inputValue:'',
        postExpertSearch:function(){}
    },
    binds:[
        {
            event:'click',
            selector:'.fast-search-box-input',
            callback: _.debounce(function(){
                if (this.ulChecked){
                    this.actions.showList();
                } else {
                    this.actions.hideList();
                }
            }, 0)
        }
    ],
    actions: {
        showList: function() {
            this.el.find('.fast-search-ul').css('display','block');
            this.ulChecked = !this.ulChecked;
        },
        hideList: function() {
            this.el.find('.fast-search-ul').css('display','none');
            this.ulChecked = !this.ulChecked;
        },
        submitData: function (name){
            this.data.searchInputList = [];
            let obj = {
                cond: {
                    leftBracket:'0',
                    rightBracket:'0'
                },
                relation:'$and'
            }
            if(this.el.find('.fast-search-box-input').attr('title') == 'number') {
                obj['cond']['keyword'] = parseInt(this.el.find('.fast-search-input').val());
            } else {
                obj['cond']['keyword'] = this.el.find('.fast-search-input').val();
            }
            obj['cond']['operate'] = this.el.find('.fast-search-select.relation').val()
            obj['cond']['searchBy'] = this.el.find('.fast-search-box-input').attr('name');
            obj['cond']['searchByName'] = this.el.find('.fast-search-box-input').val();
            obj['cond']['searchByNew'] = this.el.find('.fast-search-box-input').attr('name');
            this.data.searchInputList.push(obj);
            this.actions.checkedSubmitData()
        },
        //校验提交的高级查询
        checkedSubmitData: function() {
            if (this.data.searchInputList[0]['cond']['keyword'] == '') {
                this.data.fastSearchData([]);
                return false
            } else if (this.data.searchInputList[0]['cond']['searchByName'] == '') {
                this.data.fastSearchData([]);
                return false
            } else {
                this.data.fastSearchData(this.data.searchInputList);
            }
        },
        setInputObject: function(object,nextObject) {
            this.inputObject = object;
            this.inputNextObject = nextObject;
        },
        setInputValue: function(value,name,type) {
            this.el.find('.fast-search-box-input').val(value);
            this.el.find('.fast-search-box-input').attr('name',name);
            this.el.find('.fast-search-box-input').attr('title',type);
        },
        setInputType: function(type) {
            let inputType;
            switch (type) {
                case "datetime": inputType = 'datetime-local'; break;
                case "text": inputType = 'text'; break;
                case "number": inputType = 'number'; break;
                case "person": inputType = 'text'; break;
            }
            this.el.find('.fast-search-input').attr("type",inputType);
            this.el.find('.fast-search-input').attr("title",type);
        },
        setSelectValue: function(type) {
            let optionHtmlOne = `<option value="$regex">包含</option>
                                <option value="exact">等于</option>
                                <option value="$ne">不等于</option>`,
                optionHtmlTwo = `<option value="$regex">包含</option>
                                <option value="exact">等于</option>
                                <option value="$gt">大于</option>
                                <option value="$lt">小于</option>
                                <option value="$ne">不等于</option>`,
                optionHtmlThree =  `<option value="exact">等于</option>
                                <option value="$gt">大于</option>
                                <option value="$lt">小于</option>
                                <option value="$ne">不等于</option>`,
                optionHtmlFour = `<option value="exact">等于</option>
                                  <option value="$ne">不等于</option>`;
            switch (type) {
                case "datetime": this.el.find('.fast-search-select.relation').html(optionHtmlTwo); break;
                case "text": this.el.find('.fast-search-select.relation').html(optionHtmlOne); break;
                case "number": this.el.find('.fast-search-select.relation').html(optionHtmlThree); break
                case "person": this.el.find('.fast-search-select.relation').html(optionHtmlFour); break
            }
        },
    },
    afterRender: function() {
        let _this = this
        this.el.on('click','.fast-search-li', function() {
            _this.actions.setInputValue($(this).html(),$(this).attr('title'),$(this).attr('type'));
            _this.actions.setSelectValue($(this).attr('type'));
            _this.actions.setInputType($(this).attr('type'));
            _this.actions.hideList();
        }).on('click','.fast-search-img',function(){
            _this.actions.submitData();
        })
    }
}
class fastSearch extends Component {
    constructor(data) {
        for (let d in data) {
            config.data[d] = data[d]
        }
        super(config)
    }
}
export default fastSearch