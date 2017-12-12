/**
 *@author zhr
 *@description 高级查询组件
 */
import Component from "../../../../lib/component";
import template from './expert-search.html';
import expertCondition from './expert-search-condition/expert-search-condition';
import {dataTableService} from '../../../../services/dataGrid/data-table.service';
import searchImport from '../expert-search-import/search-import'
import {searchExport} from '../expert-search-export/search-export'
import {Uploader} from '../../../../lib/uploader'
import {PMAPI,PMENUM} from '../../../../lib/postmsg';
import {HTTP} from "../../../../lib/http";
import DateTimeControl from "../../../form/datetime-control/datetime-control";
import DateControl from "../grid-data-control/grid-data-control";
import TimeControl from "../../../form/time-control/time-control";
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
    autoSearch: false,
    isEdit: false,
    itemChecked:false,
    itemDeleteChecked:false,
    optionHtmlOne : `<option value="$regex">包含</option>
                    <option value="nor">不包含</option>
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
    optionHtmlFour : `<option value="exact">等于</option>
                      <option value="$ne">不等于</option>`,
    data: {
        tableId: null,
        addNameAry:[],
        saveCommonQuery: false,
        deleteCommonQuery: false,
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
            let epCondition = new expertCondition({data:{expertItemData:this.data.fieldsData}});
            let dom = document.createElement('div');
            dom.className = 'condition-search-choice';
            this.append(epCondition, $(dom));
            $(dom).appendTo(this.el.find('.condition-search-container'));
            // this.append(epCondition, this.el.find('.condition-search-container'));
            this.data.searchInputAry.push(epCondition.data);
            this.el.find('.condition-search-item').css({'paddingLeft':'83px','borderTop':'1px solid #e4e4e4'});
            this.el.find('.condition-search-select.radio').css('display','none');
            this.el.find('.condition-search-delete').css('visibility','hidden');
            this.el.find('.left-choice').addClass('active');
            this.el.find('.right-choice').addClass('active');
        },
        //获取高级查询数据
        getExpertSearchData: function () {
            let obj = {'actions':JSON.stringify( ['queryParams'] ),'table_id':this.data.tableId};
            dataTableService.getPreferences( obj ).then( res=>{
                this.data.commonQuery = res.rows;
                this.el.find('.common-search-item').remove();
                this.data.commonQuery.forEach((item)=> {
                    this.el.find('.common-search-list').append(`<li class="common-search-item" fieldId="${item.id}">${item.name}<span class="item-delete icon-expert-error-msg"></span></li>`);
                });
                if(this.data.commonQuery.length != 0){
                    this.el.find('.common-search-compile').css('display','block');
                }
            } );
            HTTP.flush();
        },
        // 获取查询数据
        submitData: function (name){
            this.data.searchInputList = [];
            let itemList = this.el.find('.condition-search-item');
            for(let i = 0; i < itemList.length; i++) {
                let obj = {
                    cond: {},
                    relation:'$and'
                };
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

                if(this.el.find('.result').eq(i).attr('search-type') == 'number') {
                    obj['cond']['keyword'] = Number(this.el.find('.condition-search-value').find('input').eq(i).val());
                    obj['cond']['operate'] = this.el.find('.condition-search-select.relation').eq(i).val()
                } else if(this.el.find('.result').eq(i).attr('search-type') == 'date') {
                    obj['cond']['keyword'] = $.trim(this.el.find('.condition-search-value').find('input').eq(i).val());
                    obj['cond']['operate'] = this.el.find('.condition-search-select.relation').eq(i).val()
                } else {
                    if(this.el.find('.condition-search-select.relation').eq(i).val() == 'nor') {
                        let keyword = this.el.find('.condition-search-value').find('input').eq(i).val();
                        obj['cond']['operate'] = '$regex';
                        obj['cond']['keyword'] = `^((?!${keyword}).)*$`;
                    }
                    else {
                        obj['cond']['keyword'] = this.el.find('.condition-search-value').find('input').eq(i).val();
                        obj['cond']['operate'] = this.el.find('.condition-search-select.relation').eq(i).val()
                    }
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
                // obj['cond']['operate'] = this.el.find('.condition-search-select.relation').eq(i).val()
                obj['cond']['searchBy'] = this.el.find('.result').eq(i).attr('name');
                obj['cond']['searchByName'] = this.el.find('.result').eq(i).val();
                obj['cond']['searchByNew'] = this.el.find('.result').eq(i).attr('name');
                obj['relation'] = this.el.find('.condition-search-select.radio').eq(i).val();
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
                let epCondition = new expertCondition({data:{expertItemData:this.data.fieldsData}});
                let dom = document.createElement('div');
                dom.className = 'condition-search-choice';
                this.append(epCondition, $(dom));
                $(dom).appendTo(this.el.find('.condition-search-container'));
            }
            for(let j = 0;j<searchData.length;j++) {
                let html = this.actions.checkedRelationType(searchData[j]['cond']['searchByName']);
                this.actions.checkedInputType(searchData[j]['cond']['searchByName'],searchData[j]['cond']['keyword'],j,html,searchData[j]['cond']['operate']);
                if(searchData[j]['cond']['leftBracket'] == '(') {
                    this.el.find('.condition-search-choice.left-choice').eq(j).addClass('active')
                } else {
                    this.el.find('.condition-search-choice.left-choice').eq(j).removeClass('active')
                }
                if(searchData[j]['cond']['rightBracket'] == ')') {
                    this.el.find('.condition-search-choice.right-choice').eq(j).addClass('active')
                } else {
                    this.el.find('.condition-search-choice.right-choice').eq(j).removeClass('active')
                }
                // this.el.find('.condition-search-select.relation').eq(j).html(html)
                // this.el.find('.condition-search-select.relation').eq(j).val(searchData[j]['cond']['operate']);
                this.el.find('.result').eq(j).attr('name',searchData[j]['cond']['searchBy']);
                this.el.find('.result').eq(j).val(searchData[j]['cond']['searchByName']);
                this.el.find('.result').eq(j).attr('name',searchData[j]['cond']['searchByNew']);
                this.el.find('.condition-search-select.radio').eq(j).val(searchData[j]['relation']);

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
                        case "number": htmlStr = config.optionHtmlThree; break;
                        case "person": htmlStr = config.optionHtmlFour; break;
                    }
                }
            });
            return htmlStr;
        },
        //加载不同查询条件的输入框类型
        checkedInputType: function(type, value, index, html, relation){
            this.data.fieldsData.forEach((item)=> {
                if(item.name == type) {
                    switch (item.searchType) {
                        case "datetime":
                            this.el.find('.result').eq(index).attr('search-type','datetime');
                            this.el.find('.condition-search-input').eq(index).remove();
                            let dateTimeControl = new DateTimeControl({value: value},{changeValue:function(data){}});
                            dateTimeControl.render(this.el.find('.condition-search-value').eq(index));
                            this.el.find('.condition-search-select.relation').eq(index).html(html);
                            this.el.find('.condition-search-select.relation').eq(index).val(relation);
                            break;
                        case "date":
                            this.el.find('.result').eq(index).attr('search-type','date');
                            this.el.find('.condition-search-input').eq(index).remove();
                            let dateControl = new DateControl({value: value},{changeValue:function(data){}});
                            dateControl.render(this.el.find('.condition-search-value').eq(index));
                            this.el.find('.condition-search-select.relation').eq(index).html(html);
                            this.el.find('.condition-search-select.relation').eq(index).val(relation);
                            break;
                        case "time":
                            this.el.find('.result').eq(index).attr('search-type','time');
                            this.el.find('.condition-search-input').eq(index).remove();
                            let timeControl = new TimeControl({value: value},{changeValue:function(data){}});
                            timeControl.render(this.el.find('.condition-search-value').eq(index));
                            this.el.find('.condition-search-select.relation').eq(index).html(html);
                            this.el.find('.condition-search-select.relation').eq(index).val(relation);
                            break;
                        case "text":
                            let str = /\^\(\(\?!/;
                            this.el.find('.condition-search-value').eq(index).html(`<input class="condition-search-input" type="text">`);
                            this.el.find('.condition-search-select.relation').eq(index).html(html);
                            if(str.test(value)){
                                let length = value.length - 5;
                                let newValue = value.substring(5,length);
                                this.el.find('.condition-search-value').eq(index).find('.condition-search-input').val(newValue);
                                this.el.find('.condition-search-select.relation').eq(index).val('nor');
                            } else {
                                this.el.find('.condition-search-select.relation').eq(index).val(relation);
                                this.el.find('.condition-search-value').eq(index).find('.condition-search-input').val(value);
                            }
                            break;
                        case "number":
                            this.el.find('.result').eq(index).attr('search-type','number');
                            this.el.find('.condition-search-value').eq(index).html(`<input class="condition-search-input" type="number">`);
                            this.el.find('.condition-search-input').eq(index).val(value);
                            this.el.find('.condition-search-select.relation').eq(index).html(html);
                            this.el.find('.condition-search-select.relation').eq(index).val(relation);
                            break;
                        case "person":
                            this.el.find('.condition-search-value').eq(index).html(`<input class="condition-search-input" type="text">`);
                            this.el.find('.condition-search-value').eq(index).find('.condition-search-input').val(value);
                            this.el.find('.condition-search-select.relation').eq(index).html(html);
                            this.el.find('.condition-search-select.relation').eq(index).val(relation);
                            break;
                    }
                }
            })
        },
        //校验提交的高级查询
        checkedSubmitData: function(name) {
            let checkedPost = true,
                leftBracketNum = 0,
                rightBracketNum = 0;
            try {
                this.data.searchInputList.forEach((item) => {
                    if (item['cond']['keyword'] === '') {
                        msgBox.alert('查询值不能为空！');
                        checkedPost = false;
                        foreach.break=new Error("StopIteration");
                    } else if (item['cond']['searchByName'] === '') {
                        msgBox.alert('查询条件不能为空！');
                        checkedPost = false;
                        foreach.break=new Error("StopIteration");
                    }
                    if (item['cond']['leftBracket'] === '(') {
                        leftBracketNum++;
                    }
                    if (item['cond']['rightBracket'] === ')') {
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
                            if(item.id == this.id && JSON.parse(item.queryParams).length == this.data.searchInputList.length) {
                                for (let i = 0; i< this.data.searchInputList.length; i++) {
                                    if( JSON.parse(item.queryParams)[i]['cond']['keyword'] == this.data.searchInputList[0]['cond']['keyword'] &&
                                        JSON.parse(item.queryParams)[i]['cond']['operate'] == this.data.searchInputList[0]['cond']['operate'] &&
                                        JSON.parse(item.queryParams)[i]['cond']['leftBracket'] == this.data.searchInputList[0]['cond']['leftBracket'] &&
                                        JSON.parse(item.queryParams)[i]['cond']['rightBracket'] == this.data.searchInputList[0]['cond']['rightBracket']&&
                                        JSON.parse(item.queryParams)[i]['cond']['searchBy'] == this.data.searchInputList[0]['cond']['searchBy']&&
                                        JSON.parse(item.queryParams)[i]['cond']['searchByName'] == this.data.searchInputList[0]['cond']['searchByName']
                                    ){
                                        return false;
                                    }else {
                                        searchId = item.id;
                                        searchName = item.name;
                                        appendChecked = false;
                                    }
                                }
                            }
                        });
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
        //取消查询关闭iframe
        // cancelSearch:function() {
        //     PMAPI.closeIframeDialog(window.config.key, {
        //         saveCommonQuery:this.data.saveCommonQuery,
        //         deleteCommonQuery:this.data.deleteCommonQuery,
        //         onlyclose:true
        //     });
        // },
        //打开保存常用查询
        openSaveQuery: function(){
            if(this.isEdit) {
                addQuery.data.name = this.name;
            }
            this.actions.openSaveQueryDialog(addQuery);
        },
        //打开保存常用查询弹窗
        openSaveQueryDialog:function(addQuery){
            PMAPI.openDialogByComponent(addQuery, {
                width: 380,
                height: 180,
                title: '保存为常用查询'
            }).then((data) => {
                if(data.onlyclose){
                    return false
                }
                if(data.value == '') {
                    msgBox.alert('名字不能为空');
                    // this.actions.openSaveQueryDialog(addQuery)
                }else  {
                    if(!this.isEdit) {
                        this.actions.saveCommonQuery(data.value);
                    } else {
                        this.actions.deleteCommonQuery(this.id,data.value);
                        // this.actions.saveCommonQuery(data.value);
                    }
                }
            });
        },
        //渲染常用查询按钮
        renderQueryItem: function(data){
            data.forEach((item)=> {
                this.el.find('.common-search-list').append(`<li class="common-search-item" fieldId="${item.id}">${item.name}<span class="item-delete icon-expert-error-msg"></span></li>`);
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
                    // this.actions.renderQueryItem(this.data.searchInputList)
                    this.data.saveCommonQuery = true;
                    this.data.addNameAry.push(name);
                    this.actions.getExpertSearchData();
                    // this.data.commonQuery.push({
                    //     id:1000+this.data.num,
                    //     name:name,
                    //     queryParams:JSON.stringify(this.data.searchInputList)
                    // });

                    this.name = name;
                    // Mediator.on('renderQueryItem:itemData',data =>{
                    //     this.actions.renderQueryItem(data);
                    // });
                    this.actions.setConditionHeight()
                }
            });
            HTTP.flush();
        },
        //删除常用查询
        deleteCommonQuery: function(id,value){
            let obj = {
                'table_id': this.data.tableId,
                'id': id
            };
            dataTableService.delPreference(obj).then( res=>{
                if(res.succ == 0) {
                    msgBox.alert(res.error)
                } else if(res.succ == 1) {
                    this.actions.removeQueryItem(id);
                    for(let i = 0; i <this.data.commonQuery.length; i++) {
                        if (this.data.commonQuery[i].id == id){
                            this.data.commonQuery.splice(i,1);
                        }
                    }
                    if(this.data.commonQuery.length == 0){
                        this.el.find('.common-search-compile').css('display','none');
                        this.el.find('.common-search-compile').html(`<span class="img icon-expert-edit"></span>`);
                        this.itemDeleteChecked = false;
                    }
                    this.data.deleteCommonQuery = true;
                    if(this.isEdit && value) {
                        this.actions.saveCommonQuery(value);
                        this.el.find('.common-search-compile').html(`<span class="img icon-expert-edit"></span>`);
                        this.itemDeleteChecked = !this.itemDeleteChecked;
                        this.isEdit = false;
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
            this.actions.setConditionHeight()
        },
        setConditionHeight:function() {
            let height = 450 - parseInt(this.el.find('.common-search').css('height'));
            this.el.find('.condition-search').css('height',`${height}px`);
        },
        // showAddBtn:function() {
        //     let length = this.el.find('.condition-search-item').length;
        //     this.el.find('.condition-search-item').find('.condition-search-add').css('display','none')
        //     this.el.find('.condition-search-item').eq(length-1).find('.condition-search-add').css('display','inline-block')
        // },
        // 接受父组件传数据过来后
        afterGetMsg:function() {
            if (this.data.commonQuery.length == 0) {
                this.el.find('.common-search-compile').css('display', 'none')
            } else {
                this.data.commonQuery.forEach((item) => {
                    this.el.find('.common-search-list').append(`<li class="common-search-item" fieldId="${item.id}">${item.name}<span class="item-delete icon-expert-error-msg"></span></li>`);
                })
            }
            this.actions.rendSearchItem();
            this.itemDeleteChecked = false;
            this.isEdit = false;
            if(this.data.bi) {
                this.el.find('.common-search').css('display', 'none');
                this.el.find('.save-button').css('display', 'none');
                this.el.find('.save-img').css('display', 'none');
                if(this.data.commonQuery.length != 0){
                    this.name = this.data.commonQuery[0].name;
                    this.id = this.data.commonQuery[0].id;
                    this.itemChecked = true;
                    this.data.searchInputList = JSON.parse(this.data.commonQuery[0]['queryParams']);
                    this.actions.showSearchData(JSON.parse(this.data.commonQuery[0]['queryParams']));
                    if (this.itemDeleteChecked) {
                        this.isEdit = true;
                    }
                }
            }
            let _this = this;
            this.el.on('click','.condition-search-add',function() {
                // this.append(new expertCondition({expertItemData:this.data.fieldsData}), this.el.find('.condition-search-container'));
                let epCondition = new expertCondition({data:{expertItemData:this.data.fieldsData}});
                let Dom = document.createElement('div');
                Dom.className = 'condition-search-choice';
                _this.append(epCondition, $(Dom));
                $(this).parent().parent().parent('.condition-search-choice').after($(Dom));
                // _this.data.searchInputAry.push(epCondition.data);
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
            }).on('click','.cancel-button',()=>{
                this.actions.cancelSearch()
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
                    _this.el.find('.common-search-compile').html(`<span class="img icon-expert-edit"></span>`);
                    _this.itemDeleteChecked = !_this.itemDeleteChecked;
                    _this.isEdit = false;
                }
            }).on('click','.export', function(){
                if(_this.data.commonQuery.length == 0){
                    msgBox.alert('常用查询为空不能导出')
                } else {
                    searchExport.export(_this.data.tableId,_this.el);
                }
            }).on('click','.import', function(){
                let choice = 1;
                if(_this.el.find('.common-search-title .choice-input').eq(1).hasClass('active')){
                    choice = 0
                }
                let obj={
                    tableId: _this.data.tableId,
                    parentKey: window.config.key,
                    choice : choice,
                };
                PMAPI.openDialogByIframe(`/iframe/searchImport/`,{
                    width:500,
                    height:400,
                    title:`常用查询导入`,
                    modal:true,
                },{obj}).then(res=>{
                    if(res.type == 1) {
                        _this.actions.getExpertSearchData();
                    }
                })
                // searchImport.import(window.config.key,_this.data.tableId,choice);
            }).on('click','.common-search-title .choice-input', function(){
                _this.el.find('.common-search-title .choice-input').removeClass('active');
                $(this).addClass('active')
            });
            this.hideLoading();
            this.actions.setConditionHeight()
        }
    },
    afterRender: function() {
        this.showLoading();
        PMAPI.getIframeParams(window.config.key).then((res) => {
            for (let item in res.data.d) {
                this.data[item] = res.data.d[item]
            }
            this.actions.afterGetMsg();
        })
    }

};
class expertSearch extends Component {
    constructor(data,newConfig){
        super($.extend(true,{},config,newConfig,{data:data||{}}));
        console.log(this.data)
    }
}
export default expertSearch