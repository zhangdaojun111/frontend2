/**
 * Created by Yunxuan Yan on 2017/8/18.
 */
import template from './contract-editor.html';
import Component from "../../../../lib/component";
import {PMAPI,PMENUM} from '../../../../lib/postmsg';
import {Storage} from "../../../../lib/storage";
import {HTTP} from "../../../../lib/http";
import History from '../../history/history';
import './contract-editor.scss';

/**
 * logic的get_element调用规则：
 *  table_id: 对应数据表的TableID，可从data.table_id获得
 *  real_id: 数据记录的ID，可从data.real_id获得
 *  field_id: 数据列的ID，可从data.id获得
 *        只写以上三者，get_element将返回合同模板选项（model_id）和数据源选项(elements)
 *  model_id: 合同模板ID，可从data.value[i].model_id或者通过合同模板选项的value获得
 *        只写以上四者，将获得未填写数据源的合同模板
 *  elements: 一个键值对象，用于填充合同模板的数据源（某表的某行数据），可从data.value[i].elements或者通过数据源选项的value获得
 *  type: 可填"show"和"edit"，注意在获得已提交的合同用show，新增数据用edit
 *  index: 索引，对应tab页索引，从0开始，但是新增数据时用0
 *        上述七个参数均填对即可获得带有内容的合同数据
 *
 *  如果修改了合同中的数据，在向上提数据的时候一定加上k2v用于存已修改的数据
 *
 **/
let contractEditor = Component.extend({
    template: template,
    binds: [
        {
            event: 'click',
            selector: '.save_n_close',
            callback: function () {
                Storage.init(this.data.iframe_key);
                Storage.setItem(this.data.local_data,'contractCache-'+this.data.real_id+'-'+this.data.id+'-'+this.data.temp_id+'-'+this.data.field_id,Storage.SECTION.FORM);
                //删除local_data中的合同信息，此数据不跟随data上传
                for (let data of this.data.local_data) {
                    delete data['content'];
                    delete data['mode'];
                }
                this.data.value = this.data.local_data;
                this.actions.closeMe();
            }
        }, {
            event: 'click',
            selector: '.download_all',
            callback: function () {
                this.actions.downloadTemplate(0, true);
            }
        }, {
            event: 'click',
            selector: '.download_current',
            callback: function () {
                this.actions.downloadTemplate(this.data['current_tab'], false);
            }
        }, {
            event: 'click',
            selector: '.edit_or_save',
            callback: function () {
                if (this.el.find('.edit_or_save').text() == '临时编辑') {
                    this.el.find('.contract-template-anchor span').css({'cursor':'text'})
                    let butStates = this.data.buttonStates[this.data['current_tab']];
                    butStates.edit_or_save_text = '确定';
                    butStates.display.save_n_close = 'none';
                    butStates.display.download_all = 'none';
                    butStates.display.download_current = 'none';
                    this.actions.loadButtons(this.data['current_tab']);
                    this.data.editingK2v = JSON.parse(JSON.stringify(this.data.local_data[this.data['current_tab']].k2v));
                    this.actions.editContract(this.data.editingK2v);
                } else {
                    this.el.find('.contract-template-anchor').find('span').removeAttr('contenteditable').css({'cursor':'pointer'});
                    let butStates = this.data.buttonStates[this.data['current_tab']];
                    butStates.edit_or_save_text = '临时编辑';
                    butStates.display.save_n_close = 'inline';
                    butStates.display.download_all = 'inline';
                    butStates.display.download_current = 'inline';
                    this.actions.loadButtons(this.data['current_tab']);
                    this.data.local_data[this.data['current_tab']].k2v = this.data.editingK2v;
                    console.dir(this.data.editingK2v);
                    //将修改缓存到本地，如果需要编辑即保存，将下一行放到editContract的input事件回调中
                    Storage.init(this.data.iframe_key);
                    Storage.setItem(this.data.local_data,'contractCache-'+this.data.real_id+'-'+this.data.id+'-'+this.data.temp_id+'-'+this.data.field_id,Storage.SECTION.FORM);
                }
            }
        }, {
            event: 'click',
            selector: '.add-tab-button',
            callback: function () {
                if(this.data['mode'] =='edit') {
                    this.actions.addTab();
                }
            }
        }, {
            event: 'click',
            selector: '.delete-tab-btn',
            callback: function (event) {
                if (this.data['mode'] == 'edit') {
                    // let currentIndex = this.data['current_tab'];
                    let currentIndex = $(event).parent('.contract-tab').index();
                    this.data.local_data.splice(currentIndex, 1);
                    //删除标签
                    this.el.find('.contract-tab').get(currentIndex).remove();
                    // //如果右边有标签，当前标签向右移，没有则向左移
                    // currentIndex = currentIndex == this.data.local_data.length ? currentIndex - 1 : currentIndex;
                    // if (currentIndex == -1) {
                    //     this.actions.addTab();
                    // } else {
                    //     this.actions._loadTemplateByIndex(currentIndex,true,false);
                    // }
                    if (this.el.find('.contract-tab').length < 10) {//仅允许最多有五个标签
                        this.el.find('.add-tab-button').show();
                    }
                    this.el.find('.contract-tab').removeClass('active')
                    if (this.data['current_tab'] == currentIndex) {
                        this.actions.loadTab(0, true);
                        this.data['current_tab'] = 0;
                    } else {
                        this.actions.loadTab(this.data.local_data.length - 1, true);
                        this.data['current_tab'] = this.data.local_data.length - 1;
                    }
                    return false;
                }
            }
        },{
            event:'mouseover',
            selector:'.contract-tabs',
            callback:function () {
                this.el.find('.contract-tabs').css('overflow-x','auto');
            }
        },{
            event:'mouseout',
            selector:'.contract-tabs',
            callback:function () {
                this.el.find('.contract-tabs').css('overflow-x','hidden');
            }
        },{
            event:'click',
            selector:'.instrument-line-height',
            callback:function (event) {
                this.el.find('.instrument-line-height input').removeClass('active');
                $(event).find('input').addClass('active');
                let size = $(event).find('input').attr('title');
                this.actions.changeStyle('line-height', size)
            }
        },{
            event:'click',
            selector:'.instrument-font-size',
            callback:function (event) {
                this.el.find('.instrument-font-size input').removeClass('active');
                $(event).find('input').addClass('active');
                let size = $(event).find('input').attr('title');
                this.actions.changeStyle('font-size', size)
            }
        },{
            event:'click',
            selector:'.instrument-template-btn',
            callback:function (event) {
                let size = $(event).attr('title');
                this.actions.changeStyle('back-ground', size)
            }
        },{
            event:'click',
            selector:'.change_edit',
            callback:function () {
                this.data['mode'] ='edit';
                this.data.buttonStates.forEach((item) => {
                    item['display']['edit_or_save'] = 'inline'
                    item['display']['change_edit'] = 'none'
                });
                this.data.local_data.forEach((item) => {
                    item['mode'] == 'edit';
                });
                this.el.find('.contract-template-anchor span').addClass('active');
                // this.data.first = 1;
                this.actions.showHistoryList();
                this.actions.showDifPattern();
            }
        }
    ],
    data: {
        local_data: [],
        buttonStates:[],
        elementKeys: [],
        editingk2v: {},
        first: 1,
        check: 1,
        fontSize: 12,
        lineHeight:15,
    },
    actions: {
        //加载各数据源选项
        _loadDataSource: function (elements) {
            if (elements) {
                //数据源
                let dataSourcesEle = this.el.find('.contract-data-source-anchor');

                elements.forEach(element => {
                    let select = $('<select class="data-source" disabled="disabled" id="'+element.table.table_id+'" style="width: 240px;height: 30px ;margin-top: 5px;"><option value="0">请选择</option></select>');
                    this.data.elementKeys.push(element.table.table_id);
                    element.values.forEach(value => {
                        let option = $('<option value="'+value.id+'">'+value.name+'</option>');
                        select.append(option);
                    });
                    let ele = $('<div style="margin-top: 10px; margin-left: 5px;">'+element.table.table_name+'</div>');
                    ele.append(select);
                    dataSourcesEle.append(ele);
                    ele.on('change', (event) => {
                        let valueSource = event.target.value;
                        let currentTab = this.data.local_data[this.data['current_tab']];
                        if (currentTab['model_id'] == undefined) {
                            this.el.find('.contract-template-anchor').html('<p>尚未选择模板</p>');
                        } else {
                            currentTab['elements'][(element.table.table_id) + ''] = valueSource;
                            if (!this.actions._isElementFull(currentTab['elements'])) {
                                this.el.find('.contract-template-anchor').html('<p>请选择所有数据源</p>');
                                return;
                            }
                            this.actions._loadTemplateByIndex(this.data['current_tab']);
                        }
                    });
                });
            }
        },
        //加载模板选项
        _loadTmplOptions: function (model_files) {
            if (model_files) {
                let options = this.el.find('.contract-model');
                //模板选择
                model_files.forEach(model => {
                    let optionEle = $('<option value="'+model.file_id+'">'+model.file_name+'</option>');
                    options.append(optionEle);
                });
                options.on('change', (event) => {
                    this.data.local_data[this.data['current_tab']]['model_id'] = event.target.value;
                    this.actions._loadTemplateByIndex(this.data['current_tab']);
                    // if(this.el.find('.contract-model').val() != 0){
                    //     this.el.find('.data-source').removeAttr('disabled');
                    // }
                });
            }
        },
        getElement: function (json) {
            //在componentDialog中使用HTTP则报找不到_http的错误
            return HTTP.postImmediately('/customize/rzrk/get_element/', json);
        },
        getHistoryModel: function (json) {
            return HTTP.postImmediately('/customize/rzrk/show_lastest_history/', json);
        },
        getEditorHistory: function (json) {
            return HTTP.postImmediately('/customize/rzrk/contract_history/', json);
        },
        addTab: function () {
            let _this = this;
            let tabEle = $(`<li class="contract-tab active"><span>新建</span><span class="delete-tab-btn"></span></li>`);
            $(this.el.find('.contract-tab').get(this.data['current_tab'])).removeClass('active');
            let length = this.el.find('.contract-tab').length;
            this.el.find('.contract-tabs').append(tabEle);
            this.el.find('.contract-model').val(0).removeAttr('disabled');
            // this.el.find('.data-source').val(0).removeAttr('disabled');
            this.data.local_data.push({name: '新建', elements: {}, model_id: '', mode: 'edit',field:[]});
            this.data['current_tab'] = length;
            this.actions.initButtonStates(this.data['current_tab']);
            this.actions.loadButtons(this.data['current_tab']);
            this.el.find('.contract-template-anchor').html('<p class="blank">请选择模板和数据源。</p>');

            // tabEle.on('click', () => {
            //     debugger
            //     this.actions.loadTab(length, true);
            // })
            if(this.el.find('.contract-tab').length >= 10){//仅允许最多有十个标签
                this.el.find('.add-tab-button').hide();
            }
            //监听tab
            this.actions.tabClick();
        },
        loadTab: function (i, isLoadCache,disabled) {
            if (i == this.data['current_tab']) {
                return;
            }
            this.el.find('.contract-tab').removeClass('active');
            $(this.el.find('.contract-tab').get(i)).addClass('active');
            this.actions._loadTemplateByIndex(i, isLoadCache,disabled);
        },
        initButtonStates:function (i) {
            if(this.data.mode == 'edit'){
                this.data.buttonStates.push({
                    display:{
                        save_n_close:'inline',
                        download_all:'inline',
                        download_current:'inline',
                        edit_or_save:'none',
                        change_edit:'none'
                    },
                    edit_or_save_text:'临时编辑'
                });
            } else {
                this.data.buttonStates.push({
                    display:{
                        save_n_close:'none',
                        download_all:'inline',
                        download_current:'inline',
                        edit_or_save:'none',
                        change_edit:'inline'
                    },
                    edit_or_save_text:'临时编辑'
                });
            }
        },
        loadButtons:function (i) {
            let butStates = this.data.buttonStates[i];
            for(let key of Object.keys(butStates.display)){
                this.el.find('.'+key).css('display',butStates.display[key]);
            }
            this.el.find('.edit_or_save').text(butStates.edit_or_save_text);
        },
        //只有在切换tab的时候才会用缓存加载合同
        _loadTemplateByIndex: function (i, isLoadCache,disabled) {
            this.actions.loadButtons(i);
            this.data['current_tab'] = i;
            console.log("current tab " + i);
            let tab = this.data.local_data[i];
            if (tab == undefined) {
                console.log('tab[' + i + '] is undefined');
                return;
            }

            //加载选项
            let hasModelId = tab['model_id'] && tab['model_id'] != '';
            let model = hasModelId ? tab['model_id'] : 0;
            this.el.find('.contract-model').val(model);
            if(disabled && model != 0){    //已提交的合同并且选项已选则锁住选项
                this.el.find('.contract-model').attr('disabled','disabled');
            } else {
                this.el.find('.contract-model').removeAttr('disabled');
            }
            for (let key of this.data.elementKeys) {
                let value = tab['elements'][key] || 0;
                this.el.find('#' + key).val(value);
                if(disabled && value != 0){
                    this.el.find('#' + key).attr('disabled','disabled');
                } else {
                    this.el.find('#' + key).removeAttr('disabled');
                }
            }
            if(this.el.find('.contract-model').val() == 0) {
                this.el.find('.data-source').attr('disabled','disabled');
            }

            if (!hasModelId) {
                if(!this.data.isAdd) {
                    this.hideLoading()
                }
                this.el.find('.contract-template-anchor').html('<p class="blank">请选择模板</p>');
                return;
            }
            if (!this.actions._isElementFull(tab['elements'])) {
                this.el.find('.contract-template-anchor').html('<p class="blank">请选择所有数据源</p>');
                return;
            }

            if (isLoadCache && tab['content']) {
                // $(this.el.find('.contract-tab').get(i)).text(tab['name']);
                $(this.el.find('.contract-tab').get(i)).html(`<span>${tab['name']}</span><span class="delete-tab-btn"></span>`);
                this.el.find('.contract-template-anchor').html(tab['content']);
                if (this.data.mode == 'edit' && Object.keys(tab['elements']).length != 0) {
                    this.el.find('.edit_or_save').css('display', 'inline');
                    this.data.buttonStates[i].display.edit_or_save = 'inline';
                }
                return;
            }
            let type = tab['mode'] || 'show';
            let index = tab['mode'] ? 0 : i;
            this.actions.getElement({
                table_id: this.data.table_id,
                real_id: this.data.real_id,
                temp_id: this.data.temp_id,
                field_id: this.data.id,
                model_id: tab.model_id,
                elements: JSON.stringify(tab.elements),
                type: type,
                index: index
            }).then(res => {
                if (res.success && this.data['current_tab'] == i) {
                    this.el.find('.contract-template-anchor').html(res.data.content);
                    tab['content'] = res.data.content;
                    tab['k2v'] = res.data.k2v;
                    if (this.data.mode == 'edit' && Object.keys(tab['elements']).length != 0) {
                        this.el.find('.edit_or_save').css('display', 'inline');
                        this.data.buttonStates[i].display.edit_or_save = 'inline';
                    }
                    let tabName = [];
                    if (Object.keys(tab.elements).length != 0) {
                        for (let key of this.data.elementKeys) {
                            let selectEle = this.el.find('#' + key)[0];
                            tabName.push(selectEle.selectedOptions[0].label);
                        }
                        tab['name'] = tabName.join(' ');
                        // $(this.el.find('.contract-tab').get(i)).text(tab['name']);
                        $(this.el.find('.contract-tab').get(i)).html(`<span>${tab['name']}</span><span class="delete-tab-btn"></span>`);
                    }
                    this.actions.textClick();
                    if(this.data.first) {
                        this.actions.showDifPattern();
                    }
                    this.data.first = 0;
                }
                if(!this.data.isAdd) {
                    this.hideLoading();
                }
            })
        },
        _isElementFull: function (elements) {
            if (Object.keys(elements).length == 0) {
                return true;
            }
            for (let key of this.data.elementKeys) {
                let value = elements[key];
                if (!value || value == 0 || value == '') {
                    return false;
                }
            }
            return true;
        },
        downloadTemplate: function (i, isAll) {
            let contractData = this.data.local_data[i];
            HTTP.postImmediately('/customize/rzrk/download_contract/', {
                table_id: this.data.table_id,
                real_id: this.data.real_id,
                field_id: this.data.id,
                model_id: contractData.model_id,
                k2v: JSON.stringify(contractData.k2v),
                file_name: contractData.name
            }).then(res => {
                if (res.success) {
                    let url = '/download_attachment/?file_id=' + JSON.parse(res.data).file_id + "&download=1";
                    window.open(url);
                    if (isAll) {
                        this.actions.downloadTemplate(i + 1, isAll);
                    }
                }
            })
        },
        showHistoryList: function(){
            let obj = {
                dfield: this.data.dfield,
                table_id: this.data.table_id
            }
            // obj = [
            //     {'5a177b18d8e9e4419a03114f':'上海银行基金合同模版-0623'},
            //     {'5a177adfd8e9e44197031134':'招商银行基金合同模板-0623'},
            //     {'5a177b84d8e9e4419a031151':'恒泰证券基金合同模板-0623 (2)'},
            //     {'5a177c32d8e9e4418d031128':'东方证券基金合同模版-0623 (1)'},
            //     {'5a1783cdd8e9e4419a031153':'恒泰证券基金合同模板-0623 (1) (1)'},
            //     {'5a25da23d8e9e454ff19c3d0':'投资者类型及风险匹配告知书及投资者确认函（普通自然人投资者适用） (3) (1)'}
            // ]
            // for(let item of obj) {
            //     for(let i in item) {
            //         let html = `<p class="history-template-list-item" value="${i}">${item[i]}</p>`
            //         this.el.find('.history-template-list').append(html);
            //     }
            // }
            this.actions.getHistoryModel(obj).then(res=> {
                for(let item of res.data) {
                    for(let i in item) {
                        let html = `<p class="history-template-list-item" value="${i}">${item[i]}</p>`
                        this.el.find('.history-template-list').append(html);
                    }
                }
            })
        },
        historyListClick: function() {
            let _this = this;
            this.el.on('click','.history-template-list-item',function() {
                _this.el.find('.contract-model').val($(this).html());
                _this.data.local_data[_this.data['current_tab']]['model_id'] = $(this).attr('value')
                _this.actions._loadTemplateByIndex(_this.data['current_tab']);
            })
        },
        editContract: function (k2v) {
            this.el.find('.contract-template-anchor').find('span').attr('contenteditable', 'true');
            this.el.find('.contract-template-anchor').find('span').on('input', _.debounce(event => {
                let changedColor = '#ff9933';
                let changedValue = event.target.innerHTML;
                let title = event.target.title;
                if(k2v["##"+title+"##"] != changedValue){
                    // this.data.local_data[this.data['current_tab']]['field'] = [];
                    this.data.local_data[this.data['current_tab']]['field'].push('##'+ title +'##');
                }
                k2v["##"+title+"##"]=changedValue;
                if(changedValue == ''){
                    changedValue = ' ';
                    $(event.target).text(changedValue);
                    changedColor = '#99FF33'
                }
                let eles = this.el.find('span[title="'+title+'"]');
                for(let i=0;i<eles.length;i++){
                    if(eles[i] != event.target){//绕开本span，如果本span改变，则光标会挪到首位
                        $(eles[i]).html(changedValue);
                    }
                }
                this.data.local_data[this.data['current_tab']]['content']=this.el.find('.contract-template-anchor').html();
                this.el.find('span[title="'+title+'"]').css('background-color',changedColor);
            },500));
        },
        closeMe: function () {
            // window.parent.postMessage({
            //     type: PMENUM.close_dialog,
            //     key: this.key,
            //     data: this.data.value
            // }, location.origin);
            PMAPI.closeIframeDialog(window.config.key,this.data.value,);
        },
        changeStyle: function (name, size) {
            switch (name) {
                case 'line-height':
                    if(size == 'big') {
                        this.data.lineHeight = 20;
                        this.el.find('.contract-template-anchor').css({'line-height':`${this.data.fontSize + this.data.lineHeight}px`});
                    } else if( size == 'normal') {
                        this.data.lineHeight = 15;
                        this.el.find('.contract-template-anchor').css({'line-height':`${this.data.fontSize + this.data.lineHeight}px`});
                    }
                    break;
                case 'font-size':
                    if(size == 'mid') {
                        this.data.fontSize = 14;
                        this.el.find('.contract-template-anchor').css({'font-size':'14px'});
                        this.el.find('.contract-template-anchor').css({'line-height':`${this.data.fontSize + this.data.lineHeight}px`});
                    } else if( size == 'big') {
                        this.data.fontSize = 16;
                        this.el.find('.contract-template-anchor').css({'font-size':'16px'});
                        this.el.find('.contract-template-anchor').css({'line-height':`${this.data.fontSize + this.data.lineHeight}px`});
                    } else if( size == 'normal') {
                        this.data.fontSize = 12;
                        this.el.find('.contract-template-anchor').css({'font-size':'12px'});
                        this.el.find('.contract-template-anchor').css({'line-height':`${this.data.fontSize + this.data.lineHeight}px`});
                    }
                    break;
                case 'back-ground':
                    if(size == 'brown') {
                        this.el.find('.contract-template-anchor').css({'background-color':'#FBF0D9'});
                    } else if( size == 'normal') {
                        this.el.find('.contract-template-anchor').css({'background-color':'#ffffff'});
                    }
                    break;
            }

        },
        textClick() {
            let _this = this;
            this.el.find('.contract-template-anchor span').on('click', (event) => {
                if(event.type == 'click' && this.el.find('.edit_or_save').text() == '临时编辑' && this.data.check) {
                    this.data.check = 0;
                    let name = JSON.parse(JSON.stringify(this.data.local_data[this.data['current_tab']].k2v))[`##${event.target.title}##`];
                    let obj = {
                        table_id: _this.data.table_id,
                        real_id: _this.data.real_id,
                        field_id: _this.data.id,
                        k2v: `##${event.target.title}##`,
                        is_save: 'search'
                    }
                    _this.actions.getEditorHistory(obj).then(res => {
                        if(res.data && res.data.length != 0) {
                            let historyAry = []
                            for(let i = 0; i<res.data.length; i++) {
                                let obj = {};
                                obj['index'] = i;
                                obj['old_value'] = res.data[i]['historyValue'];
                                obj['new_value'] = res.data[i]['editValue'];
                                obj['update_user'] = res.data[i]['editor'];
                                obj['update_time'] = res.data[i]['time'];
                                obj['update_ip'] = res.data[i]['ip'];
                                historyAry.push(obj)
                            }
                            History.data.history_data = historyAry;
                            PMAPI.openDialogByComponent(History, {
                                width: 800,
                                height: 600,
                                title: `${name}历史修改记录`,
                                modal: true
                            })
                            this.data.check = 1;
                        }
                    })
                }
            })
        },
        showDifPattern: function () {
            if(this.data['mode']=='view'){
                // this.el.find('.contract-container').css({'width':'100%'});
                this.el.find('.add-tab-button').removeClass('active');
                this.el.find('.contract-template-anchor span').removeClass('active');
                this.el.find('.delete-tab-btn').css('display','none');
                this.el.find('.history-template').css({'height':'150px'});
                this.el.find('.change_edit').css({'display':'inline-block'});
                this.el.find('.contract-model').attr('disabled','disabled');
                this.el.find('.data-source').attr('disabled','disabled');
            } else {
                this.el.find('.delete-tab-btn').css('display','inline-block');
                this.el.find('.add-tab-button').addClass('active');
                this.el.find('.save_n_close').css('display','inline-block');
                this.el.find('.edit_or_save').css('display','inline-block');
                this.el.find('.history-template').css({'height':'auto'});
                this.el.find('.change_edit').css({'display':'none'});
                this.el.find('.contract-model').removeAttr('disabled','disabled');
                this.el.find('.data-source').removeAttr('disabled','disabled');
            }
        },
        tabClick: function () {
            let _this = this;
            this.el.on('click','.contract-tab',function(){
                _this.actions.loadTab($(this).index(), true);
            })
        },
        afterGetMsg: function () {
            this.showLoading();
            if(this.data['mode']=='edit') {
                this.actions.showHistoryList();
            }
            if(this.data.isAdd) {
                this.actions.showDifPattern();
            }
            //初始化各控件
            let obj = {
                table_id: this.data.table_id,
                real_id: this.data.real_id,
                field_id: this.data.id,
                temp_id: this.data.temp_id
            };
            Storage.init(this.data.iframe_key);
            this.data.local_data = Storage.getItem('contractCache-'+this.data.real_id+'-'+this.data.id+'-'+this.data.temp_id+'-'+this.data.field_id,Storage.SECTION.FORM);

            if(this.data.value.data) {
                this.data.local_data = this.data.local_data || JSON.parse(JSON.stringify(this.data.value.data));
            } else {
                this.data.local_data = this.data.local_data || JSON.parse(JSON.stringify(this.data.value));
            }
            if(!this.data.isAdd && this.data['mode'] == 'edit') {
                this.data.local_data[0]['mode'] = 'edit';
            }
            this.data.local_data[0]['field']
            // this.data.local_data = JSON.parse(JSON.stringify(this.data.value));
            this.actions.getElement(obj).then(res => {
                if (res.success) {
                    console.log(this.data.local_data)
                    this.actions._loadDataSource(res.data.elements);
                    this.actions._loadTmplOptions(res.data.model_files)
                    this.actions.historyListClick();
                    if (this.data.local_data == '') {
                        this.data.local_data = [];
                        this.actions.addTab();
                    }
                    this.actions._loadTemplateByIndex(0,true,false);
                }
                if(this.data.isAdd) {
                    this.hideLoading();
                }
            });
            //加载tab
            let tabsEle = this.el.find('.contract-tabs');
            for (let i = 0, length = this.data.local_data.length; i < length; i++) {
                let tabEle = $(`<li class="contract-tab"><span>${this.data.local_data[i].name}</span><span class="delete-tab-btn"></span></li>`);
                tabsEle.append(tabEle);
                this.actions.initButtonStates(i);
                this.actions.loadButtons(0);

            }
            $(this.el.find('.contract-tab').get(this.data.local_data.length-1)).addClass('active');
            this.actions.tabClick();
        }
    },
    afterRender: function () {
        PMAPI.getIframeParams(window.config.key).then((res) => {
            this.data = _.defaultsDeep(this.data,res.data.data)
            this.actions.afterGetMsg();
        })
    },
    beforeDestroy() {
        this.data.style.remove();
    }
});
export default contractEditor;
