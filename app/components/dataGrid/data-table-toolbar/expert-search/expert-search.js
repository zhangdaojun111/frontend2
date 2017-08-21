import Component from "../../../../lib/component";
import template from './expert-search.html';
import expertCondition from './expert-search-condition/expert-search-condition';
import {dataTableService} from '../../../../services/dataGrid/data-table.service';
import {PMAPI,PMENUM} from '../../../../lib/postmsg';
import {HTTP} from "../../../../lib/http";
import Mediator from "../../../../lib/mediator"
import addQuery from '../common-query-add/common-query-add.js';
import msgBox from '../../../../lib/msgbox';
import dataTableAgGrid from '../../data-table-page/data-table-agGrid/data-table-agGrid'
import './expert-search.scss';

let config = {
    template: template,
    ulChecked: true,
    inputValue: null,
    radioId: 0,
    id: null,
    name:'',
    isEdit: false,
    itemChecked:false,
    itemDeleteChecked:false,
    optionHtmlOne : `<option value="$regex">包含</option>
                    <option value="exact">等于</option>
                    <option value="$ne">不等于</option>`,
    optionHtmlTwo : `<option value="$regex">包含</option>
                    <option value="exact">等于</option>
                    <option value="$gt">大于</option>
                    <option value="$lt">小于</option>
                    <option value="$ne">不等于</option>`,
    optionHtmlThree : `<option value="exact">等于</option>
                    <option value="$gt">大于</option>
                    <option value="$lt">小于</option>
                    <option value="$ne">不等于</option>`,
    data: {
        tableId: null,
        num:1,
        addNameAry:[],
        saveCommonQuery: false,
        key:'',
        commonQuerySelectLength:null,
        //高级查询字段信息
        searchInputAry:[],
        searchInputList:[],
        fieldsData: [],
        commonQuery: [],
        queryParams:[],
        // postExpertSearch: function(data){
        //
        // },
        // getExpertSearchData:function(data){
        //
        // },
        // saveTemporaryCommonQuery:function(data){
        //
        // }
    },
    actions: {
        //渲染第一个查询条
        rendSearchItem: function(){
            this.data.searchInputAry = [];
            let epCondition = new expertCondition({expertItemData:this.data.fieldsData});
            this.append(epCondition, this.el.find('.condition-search-container'));
            this.data.searchInputAry.push(epCondition.data);
            this.el.find('.condition-search-item').css({'paddingLeft':'83px','borderTop':'1px solid #e4e4e4'});
            this.el.find('.condition-search-select.radio').css('display','none');
            this.el.find('.condition-search-delete').css('visibility','hidden');
            this.el.find('.condition-search-add').css('display','inline-block');
        },
        // 获取查询数据
        submitData: function (name){
            this.data.searchInputList = [];
            for(let i = 0; i < this.data.searchInputAry.length; i++) {
                let obj = {
                    cond: {},
                    relation:'$and'
                }
                // if(this.data.searchInputAry[i].inputBoxTitle == 'number') {
                //     obj['cond']['keyword'] = parseInt(this.data.searchInputAry[i].inputValue);
                // } else {
                //     obj['cond']['keyword'] = this.data.searchInputAry[i].inputValue;
                // }
                // obj['cond']['leftBracket'] = this.data.searchInputAry[i].leftSelect;
                // obj['cond']['operate'] = this.data.searchInputAry[i].relationSelect;
                // obj['cond']['rightBracket'] = this.data.searchInputAry[i].rightSelect;
                // obj['cond']['searchBy'] = this.data.searchInputAry[i].inputBoxValue;
                // obj['cond']['searchByName'] = this.data.searchInputAry[i].inputBoxName;
                // obj['cond']['searchByNew'] = this.data.searchInputAry[i].inputBoxValue;
                // if(this.el.find('.condition-search-radio.or').eq(i).prop('checked') == true) {
                //     obj['relation'] = '$or';
                // }

                //由于选择一个常用查询后 改变其查询值 new一个组件时push到数组的值是不会发生变化的

                if(this.el.find('.condition-search-box-input').eq(i).attr('title') == 'number') {
                    obj['cond']['keyword'] = parseInt(this.el.find('.condition-search-input').eq(i).val());
                } else {
                    obj['cond']['keyword'] = this.el.find('.condition-search-input').eq(i).val();
                }
                if(this.el.find('.condition-search-choice.left-choice').eq(i).hasClass('active')){
                    obj['cond']['leftBracket'] = '('
                } else {
                    obj['cond']['leftBracket'] = '0'
                }
                if(this.el.find('.condition-search-choice.right-choice').eq(i).hasClass('active')){
                    obj['cond']['rightBracket'] = ')'
                } else {
                    obj['cond']['rightBracket'] = '0'
                }
                obj['cond']['operate'] = this.el.find('.condition-search-select.relation').eq(i).val()
                obj['cond']['searchBy'] = this.el.find('.condition-search-box-input').eq(i).attr('name');
                obj['cond']['searchByName'] = this.el.find('.condition-search-box-input').eq(i).val();
                obj['cond']['searchByNew'] = this.el.find('.condition-search-box-input').eq(i).attr('name');
                obj['relation'] = this.el.find('.condition-search-select.radio').val()
                // if(this.el.find('.condition-search-radio.or').eq(i).prop('checked') == true) {
                //     obj['relation'] = '$or';
                // }
                this.data.searchInputList.push(obj);
            }
            this.actions.checkedSubmitData(name)
        },
        //展示常用查询
        showSearchData: function(data) {
            let searchData = data;
            this.el.find('.condition-search-container').find('div').remove();
            this.actions.rendSearchItem();
            for(let i = 0; i<searchData.length-1; i++) {
                this.append(new expertCondition({expertItemData:this.data.fieldsData}), this.el.find('.condition-search-container'));
            }
            for(let j = 0;j<searchData.length;j++) {
                let html = this.actions.checkedRelationType(searchData[j]['cond']['searchByName']);
                if(searchData[j]['cond']['leftBracket'] == '(') {
                    this.el.find('.condition-search-choice.left-choice').addClass('active')
                } else {
                    this.el.find('.condition-search-choice.left-choice').removeClass('active')
                }
                if(searchData[j]['cond']['rightBracket'] == '(') {
                    this.el.find('.condition-search-choice.right-choice').addClass('active')
                } else {
                    this.el.find('.condition-search-choice.right-choice').removeClass('active')
                }
                this.el.find('.condition-search-select.relation').eq(j).html(html)
                this.el.find('.condition-search-input').eq(j).val(searchData[j]['cond']['keyword']);
                this.el.find('.condition-search-select.relation').eq(j).val(searchData[j]['cond']['operate']);
                this.el.find('.condition-search-box-input').eq(j).attr('name',searchData[j]['cond']['searchBy']);
                this.el.find('.condition-search-box-input').eq(j).val(searchData[j]['cond']['searchByName']);
                this.el.find('.condition-search-box-input').eq(j).attr('name',searchData[j]['cond']['searchByNew']);
                this.el.find('.condition-search-select.radio').val(searchData[j]['relation']);
                // if(searchData[j]['relation'] == "$or") {
                //     this.el.find('.condition-search-radio.or').eq(j).prop('checked',true);
                //     this.el.find('.condition-search-radio.and').eq(j).prop('checked',false);
                // }
            }
        },
        //加载不同查询条件的查询关系
        checkedRelationType: function(value){
            debugger
            let htmlStr;
            this.data.fieldsData.forEach((item)=> {
                if(item.name == value) {
                    switch (item.searchType) {
                        case "datetime": htmlStr = config.optionHtmlTwo; break;
                        case "text": htmlStr = config.optionHtmlOne; break;
                        case "number": htmlStr = config.optionHtmlThree; break
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
            try {
                this.data.searchInputList.forEach((item) => {
                    if (item['cond']['keyword'] == '') {
                        msgBox.alert('查询值不能为空！');
                        checkedPost = false;
                        foreach.break=new Error("StopIteration");
                    } else if (item['cond']['searchByName'] == '') {
                        msgBox.alert('查询条件不能为空！');
                        checkedPost = false;
                        foreach.break=new Error("StopIteration");
                    }
                    if (item['cond']['leftBracket'] == '(') {
                        leftBracketNum++;
                    }
                    if (item['cond']['rightBracket'] == ')') {
                        rightBracketNum++;
                    }
                })
            } catch (e) {
                if(e.message==="foreach is not defined") {
                    return;
                } else throw e;
            }
            if (checkedPost) {
                if (leftBracketNum == rightBracketNum) {
                    if(name == 'save'){
                        this.actions.openSaveQuery(name);
                    } else {
                        // this.data.saveTemporaryCommonQuery(this.data.searchInputList);
                        let searchId = '临时高级查询',searchName = '临时高级查询',appendChecked = true;
                        this.data.commonQuery.forEach((item) => {
                            if(item.id == this.id) {
                                searchId = item.id;
                                searchName = item.name;
                                appendChecked = false;
                            }
                        })
                        PMAPI.closeIframeDialog(window.config.key, {
                            type:'temporaryQuery',
                            appendChecked:appendChecked,
                            saveCommonQuery:this.data.saveCommonQuery,
                            id:searchId,
                            name:searchName,
                            value: this.data.searchInputList,
                            addNameAry: this.data.addNameAry
                        });
                    }
                } else {
                    msgBox.alert('运算括号出错')
                }
            }
        },
        //打开保存常用查询
        openSaveQuery: function(){
            if(this.isEdit) {
                addQuery.data.name = this.name;
            }
            PMAPI.openDialogByComponent(addQuery, {
                width: 380,
                height: 220,
                title: '保存为常用查询'
            }).then((data) => {
                if(data) {
                    if(!this.isEdit) {
                        this.actions.saveCommonQuery(data.value);
                    } else {
                        this.actions.deleteCommonQuery(this.id);
                        this.actions.saveCommonQuery(data.value);
                    }
                }
            });
        },
        //渲染常用查询按钮
        renderQueryItem: function(data){
            data.forEach((item)=> {
                this.el.find('.common-search-list').append(`<li class="common-search-item" fieldId="${item.id}">${item.name}<span class="item-delete"></span></li>`);
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
                    this.actions.renderQueryItem(this.data.searchInputList)
                    this.data.saveCommonQuery = true
                    this.data.addNameAry.push(name)
                    this.data.commonQuery.push({
                        id:1000+this.data.num,
                        name:name,
                        queryParams:JSON.stringify(this.data.searchInputList)
                    })

                    this.num ++;
                    this.name = name;
                    this.id = 1000+this.data.num;
                    this.el.find('.common-search-item').remove();
                    this.data.commonQuery.forEach((item)=> {
                        this.el.find('.common-search-list').append(`<li class="common-search-item" fieldId="${item.id}">${item.name}<span class="item-delete"></span></li>`);
                    })
                    // Mediator.on('renderQueryItem:itemData',data =>{
                    //     this.actions.renderQueryItem(data);
                    // });
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
                    this.actions.removeQueryItem(id)
                    for(let i = 0; i <this.data.commonQuery.length; i++) {
                        if (this.data.commonQuery[i].id == id){
                            this.data.commonQuery.splice(i,1);
                        }
                    }
                }
            } );
            HTTP.flush();
        },
        //移除常用查询按钮
        removeQueryItem: function(id) {
            let itemLength = this.el.find('.common-search-item').length;
            for(let i = 0; i < itemLength; i++) {
                if(this.el.find('.common-search-item').eq(i).attr('fieldId') == id){
                    this.el.find('.common-search-item').eq(i).remove();
                }
            }
        },
        // 接受父组件传数据过来后
        afterGetMsg:function() {
            if(this.data.commonQuery.length == 0){
                this.el.find('.common-search-compile').css('display','none')
            } else {
                this.data.commonQuery.forEach((item)=> {
                    this.el.find('.common-search-list').append(`<li class="common-search-item" fieldId="${item.id}">${item.name}<span class="item-delete"></span></li>`);
                })
            }
            this.actions.rendSearchItem();
            this.itemDeleteChecked = false;
            this.isEdit = false;
            let _this = this;
            this.el.on('click','.condition-search-add',()=> {
                // this.append(new expertCondition({expertItemData:this.data.fieldsData}), this.el.find('.condition-search-container'));
                let epCondition = new expertCondition({expertItemData:this.data.fieldsData});
                this.append(epCondition, this.el.find('.condition-search-container'));
                this.data.searchInputAry.push(epCondition.data);
                let length = this.el.find('.condition-search-item').length;
                this.el.find('.condition-search-item').find('.condition-search-add').css('display','none')
                this.el.find('.condition-search-item').eq(length-1).find('.condition-search-add').css('display','inline-block')
            }).on('click','.condition-search-choice.left-choice',function(){
                if($(this).hasClass('active')) {
                    $(this).removeClass('active');
                } else {
                    $(this).addClass('active');
                }
            }).on('click','.condition-search-choice.right-choice',function(){
                if($(this).hasClass('active')) {
                    $(this).removeClass('active');
                } else {
                    $(this).addClass('active');
                }
            }).on('click','.condition-search-radio', function() {
                $(this).parent().parent('.condition-search-radiobox').find('.condition-search-radio').prop('checked',false);
                $(this).prop('checked',true)
            }).on('click','.search-button', ()=> {
                this.actions.submitData()
            }).on('click','.reset-button',function(){
                _this.el.find('.condition-search-container').find('div').remove();
                _this.actions.rendSearchItem();
            }).on('click','.common-search-item',function() {
                _this.data.commonQuery.forEach((item) => {
                    if(item.id == this.attributes['fieldId'].nodeValue){
                        _this.name = item.name;
                        _this.id = item.id;
                        _this.itemChecked = true;
                        _this.data.searchInputList = JSON.parse(item.queryParams);
                        _this.actions.showSearchData(JSON.parse(item.queryParams));
                        if(_this.itemDeleteChecked) {
                            _this.isEdit = true;
                        }
                    }
                })
            }).on('click','.save-button',()=> {
                this.actions.submitData('save');
            }).on('click','.item-delete',function(event) {
                event.stopPropagation();
                _this.actions.deleteCommonQuery($(this).parent('.common-search-item').attr('fieldId'))
            }).on('click','.common-search-compile',function(){
                if(!_this.itemDeleteChecked){
                    _this.el.find('.common-search-list').find('.item-delete').css('display','block');
                    $('.common-search-compile').html('取消');
                    _this.itemDeleteChecked = !_this.itemDeleteChecked;
                } else {
                    _this.el.find('.common-search-list').find('.item-delete').css('display','none');
                    _this.el.find('.common-search-compile').html(`<span class="img"></span>`);
                    _this.itemDeleteChecked = !_this.itemDeleteChecked;
                    _this.isEdit = false;
                }
            })
        }

    },
    afterRender: function() {
        PMAPI.getIframeParams(window.config.key).then((res) => {
            for (let item in res.data.d) {
                this.data[item] = res.data.d[item]
            }
            this.actions.afterGetMsg();
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
export default expertSearch