import Component from "../../../../lib/component";
import template from './expert-search.html';
import expertCondition from './expert-search-condition/expert-search-condition';
import {dataTableService} from '../../../../services/dataGrid/data-table.service';
import {PMAPI,PMENUM} from '../../../../lib/postmsg';
import {HTTP} from "../../../../lib/http";
import addQuery from '../common-query-add/common-query-add.js';
import msgBox from '../../../../lib/msgbox';
import './expert-search.scss';

let config = {
    template: template,
    ulChecked: true,
    inputValue: null,
    radioId: 0,
    searchInputList:[],
    optionHtmlOne : `<option value="$regex">包含</option>
                    <option value="exact">等于</option>
                    <option value="$ne">不等于</option>`,
    optionHtmlTwo : `<option value="$regex">包含</option>
                    <option value="exact">等于</option>
                    <option value="$gt">大于</option>
                    <option value="$lt">小于</option>
                    <option value="$ne">不等于</option>`,
    data: {
        tableId: null,
        //高级查询字段信息
        fieldsData: [],
        commonQuery: [],
        queryParams:[],
        postExpertSearch: function(data){

        },
        getExpertSearchData:function(data){

        },
        saveTemporaryCommonQuery:function(data){

        }
    },
    actions: {
        //渲染第一个查询条
        rendSearchItem: function(){
            this.append(new expertCondition({expertItemData:this.data.fieldsData}), this.el.find('.condition-search-container'));
            $('.condition-search-item').css('marginLeft','97px');
            $('.condition-search-radiobox').css('display','none');
            $('.delete').css('display','none');
        },
        showList: function() {
            $('.condition-search-ul').css('display','block');
            config.ulChecked = !config.ulChecked;
        },
        hideList: function() {
            $('.condition-search-ul').css('display','none');
            config.ulChecked = !config.ulChecked;
        },
        // 获取查询数据
        submitData: function (name){
            this.data.searchInputList = [];
            let itemList = document.querySelectorAll('.condition-search-item');
            if (itemList.length <= 1) {
                let obj = {
                    cond: {},
                    relation:'$and'
                }
                obj['cond']['keyword'] = document.querySelector('.condition-search-input').value;
                obj['cond']['leftBracket'] = document.querySelector('.condition-search-select.left-select').value;
                obj['cond']['operate'] = document.querySelector('.condition-search-select.relation').value;
                obj['cond']['rightBracket'] = document.querySelector('.condition-search-select.right-select').value;
                obj['cond']['searchBy'] = document.querySelector('.condition-search-box-input').name;
                obj['cond']['searchByName'] = document.querySelector('.condition-search-box-input').value;
                obj['cond']['searchByNew'] = document.querySelector('.condition-search-box-input').name;
                this.data.searchInputList.push(obj);
            } else {
                for(let i = 0; i < itemList.length; i++) {
                    let obj = {
                        cond: {},
                        relation:'$and'
                    }
                    obj['cond']['keyword'] = document.querySelectorAll('.condition-search-input')[i].value;
                    obj['cond']['leftBracket'] = document.querySelectorAll('.condition-search-select.left-select')[i].value;
                    obj['cond']['operate'] = document.querySelectorAll('.condition-search-select.relation')[i].value;
                    obj['cond']['rightBracket'] = document.querySelectorAll('.condition-search-select.right-select')[i].value;
                    obj['cond']['searchBy'] = document.querySelectorAll('.condition-search-box-input')[i].name;
                    obj['cond']['searchByName'] = document.querySelectorAll('.condition-search-box-input')[i].value;
                    obj['cond']['searchByNew'] = document.querySelectorAll('.condition-search-box-input')[i].name;
                    debugger
                    if($('.condition-search-radio.or').eq(i).prop('checked') == true) {
                        obj['relation'] = '$or';
                    }
                    this.data.searchInputList.push(obj);
                }
            }
            this.actions.checkedSubmitData(name)
        },
        //展示常用查询
        showSearchData: function(data) {
            let searchData = data;
            $('.condition-search-container').find('div').remove();
            this.actions.rendSearchItem();
            for(let i = 0; i<searchData.length-1; i++) {
                this.append(new expertCondition({expertItemData:this.data.fieldsData}), this.el.find('.condition-search-container'));
            }
            for(let j = 0;j<searchData.length;j++) {
                let html = this.actions.checkedRelationType(searchData[j]['cond']['searchByName']);
                document.querySelectorAll('.condition-search-select.relation')[j].innerHTML = html
                document.querySelectorAll('.condition-search-input')[j].value = searchData[j]['cond']['keyword'];
                document.querySelectorAll('.condition-search-select.left-select')[j].value = searchData[j]['cond']['leftBracket'];
                document.querySelectorAll('.condition-search-select.relation')[j].value = searchData[j]['cond']['operate'];
                document.querySelectorAll('.condition-search-select.right-select')[j].value = searchData[j]['cond']['rightBracket'];
                document.querySelectorAll('.condition-search-box-input')[j].name = searchData[j]['cond']['searchBy'];
                document.querySelectorAll('.condition-search-box-input')[j].value = searchData[j]['cond']['searchByName'];
                document.querySelectorAll('.condition-search-box-input')[j].name = searchData[j]['cond']['searchByNew'];
                if(searchData[j]['relation'] == "$or") {
                    $('.condition-search-radio.or').eq(j).prop('checked',true);
                    $('.condition-search-radio.and').eq(j).prop('checked',false);
                }
            }
        },
        //加载不同查询条件的查询关系
        checkedRelationType: function(value){
            let htmlStr;
            this.data.fieldsData.forEach((item)=> {
                if(item.name == value) {
                    switch (item.searchType) {
                        case "datetime": htmlStr = config.optionHtmlTwo; break;
                        case "text": htmlStr = config.optionHtmlOne; break;
                        case "number": htmlStr = config.optionHtmlOne; break
                    }
                }
            })
            return htmlStr;
        },
        //校验提交的高级查询
        checkedSubmitData: function(name) {
            let checkedPost = true,
                leftBracketNum = 0,
                rightBracketNum = 0;
            this.data.searchInputList.forEach((item)=> {
                if(item['cond']['keyword'] == ''){
                    msgBox.alert('查询值不能为空！');
                    checkedPost = false;
                    return false
                } else if (item['cond']['searchByName'] == '') {
                    msgBox.alert('查询条件不能为空！');
                    checkedPost = false;
                    return false
                }
                if(item['cond']['leftBracket'] == '(') {
                    leftBracketNum ++;
                }
                if(item['cond']['rightBracket'] == ')') {
                    rightBracketNum ++;
                }
            })
            if (checkedPost) {
                if (leftBracketNum == rightBracketNum) {
                    if(name == 'save'){
                        this.actions.openSaveQuery(name);
                    } else {
                        $('.dataGrid-commonQuery-select').append(`<option class="dataGrid-commonQuery-option Temporary" fieldId="00" value="临时常用查询">临时常用查询</option>`)
                        this.data.saveTemporaryCommonQuery(this.data.searchInputList);
                        this.data.postExpertSearch(this.data.searchInputList);
                    }
                } else {
                    msgBox.alert('运算括号出错')
                }
            }
        },
        //打开保存常用查询
        openSaveQuery: function(){
            PMAPI.openDialogByComponent(addQuery, {
                width: 380,
                height: 220,
                title: '保存为常用查询'
            }).then((data) => {
                if(data) {
                    this.actions.saveCommonQuery(data.value);
                }
            });
        },
        //渲染常用查询按钮
        renderQueryItem: function(data){
            data.forEach((item)=> {
                $('.common-search-list').append(`<li class="common-search-item" fieldId="${item.id}">${item.name}<span class="item-delete"></span></li>`);
            })
        },
        //保存临时常用查询
        // saveTemporaryCommonQuery:function() {
        //     this.data.commonQuery.push({
        //         id: '00',
        //         name:'临时常用查询',
        //         queryParams: JSON.stringify(this.data.searchInputList)
        //     })
        //     debugger
        // },
        //保存常用查询
        saveCommonQuery: function(name) {
            let obj = {
                'action': 'queryParams',
                'table_id': this.data.tableId,
                'name': name,
                'queryParams': JSON.stringify(this.data.searchInputList)
            };
            dataTableService.savePreference(obj).then( res=>{
                if(res.succ == 0) {
                    msgBox.alert(res.error)
                } else if(res.succ == 1) {
                    this.data.getExpertSearchData();
                }
            });
            HTTP.flush();
        },
        //删除常用查询
        deleteCommonQuery: function(id){
            let obj = {
                'table_id': this.data.tableId,
                'id': id
            };
            dataTableService.delPreference(obj).then( res=>{
                if(res.succ == 0) {
                    msgBox.alert(res.error)
                } else if(res.succ == 1) {
                    this.data.postExpertSearch()
                    this.actions.removeQueryItem(id)
                }
            } );
            HTTP.flush();
        },
        removeQueryItem: function(id) {
            let itemLength = $('.common-search-item').length;
            let optionLength = $('.dataGrid-commonQuery-option').length;
            for(let i = 0; i < itemLength; i++) {
                if($('.common-search-item').eq(i).attr('fieldId') == id){
                    $('.common-search-item').eq(i).remove();
                }

            }
            for(let i = 0; i < optionLength; i++) {
                if($('.dataGrid-commonQuery-option').eq(i).attr('fieldId') == id){
                    $('.dataGrid-commonQuery-option').eq(i).remove();
                }
            }
        }
    },
    afterRender: function() {
        let epCondition = new expertCondition();
        if(this.data.commonQuery.length == 0){
            $('.common-search-compile').css('display','none')
        } else {
            this.data.commonQuery.forEach((item)=> {
                $('.common-search-list').append(`<li class="common-search-item" fieldId="${item.id}">${item.name}<span class="item-delete"></span></li>`);
            })
        }
        this.actions.rendSearchItem();
        let _this = this,itemDeleteChecked=true;
        this.el.on('click','.condition-search-box-input', function() {
            if (config.ulChecked){
                $(this).next('.condition-search-ul').css('display','block');
                config.ulChecked = !config.ulChecked;
            } else {
                $(this).next('.condition-search-ul').css('display','none');
                config.ulChecked = !config.ulChecked;
            }
            epCondition.actions.setInputObject($(this),$(this).parent().parent().find('.condition-search-input'))
        }).on('click','.add',()=> {
            this.append(new expertCondition({expertItemData:this.data.fieldsData}), this.el.find('.condition-search-container'));
        }).on('click','.condition-search-radio', function() {
            $(this).parent().parent('.condition-search-radiobox').find('.condition-search-radio').prop('checked',false);
            $(this).prop('checked',true)
        }).on('click','.searchButton', ()=> {
            this.actions.submitData()
        }).on('click','.resetButton',function(){
            $('.condition-search-container').find('div').remove();
            _this.actions.rendSearchItem();
        }).on('click','.common-search-item',function() {
            _this.data.commonQuery.forEach((item) => {
                if(item.id == this.attributes['fieldId'].nodeValue){
                    _this.actions.showSearchData(JSON.parse(item.queryParams));
                }
            })
        }).on('click','.save-button',()=> {
            this.actions.submitData('save');
        }).on('click','.item-delete',function(event) {
            event.stopPropagation();
            _this.actions.deleteCommonQuery($(this).parent('.common-search-item').attr('fieldId'))
        }).on('click','.common-search-compile',function(){
            if(itemDeleteChecked){
                $('.common-search-list').find('.item-delete').css('display','block');
                $('.common-search-compile').html('取消');
                itemDeleteChecked = !itemDeleteChecked;
            } else {
                $('.common-search-list').find('.item-delete').css('display','none');
                $('.common-search-compile').html('编辑');
                itemDeleteChecked = !itemDeleteChecked;
            }


        })

    }

}
class expertSearch extends Component {
    constructor(data) {
        for (let d in data) {
            config.data[d] = data[d]
        }
        super(config)
    }
}
export default {
    expertSearch:expertSearch,
    show: function (d) {
        let component = new expertSearch(d);
        let el = $('<div>').appendTo(document.body);
        component.render(el);
        el.dialog({
            title: '高级查询',
            width: 1000,
            height: 600,
            close: function () {
                $(this).dialog('destroy');
                component.destroySelf();
            }
        });
    }
}