/**
 * Created by Yunxuan Yan on 2017/8/18.
 */
import template from './contract-editor.html';
import Component from "../../../../lib/component";
import {PMAPI,PMENUM} from '../../../../lib/postmsg';
import {Storage} from "../../../../lib/storage";
import {HTTP} from "../../../../lib/http";
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
                if (this.el.find('.edit_or_save').text() == '编辑') {
                    let butStates = this.data.buttonStates[this.data['current_tab']];
                    butStates.edit_or_save_text = '确定';
                    butStates.display.save_n_close = 'none';
                    butStates.display.download_all = 'none';
                    butStates.display.download_current = 'none';
                    this.actions.loadButtons(this.data['current_tab']);
                    this.data.editingK2v = JSON.parse(JSON.stringify(this.data.local_data[this.data['current_tab']].k2v));
                    this.actions.editContract(this.data.editingK2v);
                } else {
                    this.el.find('.contract-template-anchor').find('span').removeAttr('contenteditable');
                    let butStates = this.data.buttonStates[this.data['current_tab']];
                    butStates.edit_or_save_text = '编辑';
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
                this.actions.addTab();
            }
        }, {
            event: 'click',
            selector: '.delete-tab-button',
            callback: function () {
                let currentIndex = this.data['current_tab'];
                this.data.local_data.splice(currentIndex, 1);
                //删除标签
                this.el.find('.contract-tab').get(currentIndex).remove();
                //如果右边有标签，当前标签向右移，没有则向左移
                currentIndex = currentIndex == this.data.local_data.length ? currentIndex - 1 : currentIndex;
                if (currentIndex == -1) {
                    this.actions.addTab();
                } else {
                    this.actions._loadTemplateByIndex(currentIndex,true,false);
                }
                if(this.el.find('.contract-tab').length < 10){//仅允许最多有五个标签
                    this.el.find('.add-tab-button').show();
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
        }
    ],
    data: {
        local_data: [],
        buttonStates:[],
        elementKeys: [],
        editingk2v: {},
    },
    actions: {
        //加载各数据源选项
        _loadDataSource: function (elements) {
            if (elements) {
                //数据源
                let dataSourcesEle = this.el.find('.contract-data-source-anchor');

                elements.forEach(element => {
                    let select = $('<select class="data-source" id="'+element.table.table_id+'" style="width: 240px;height: 30px ;margin-top: 5px;"><option value="0">请选择</option></select>');
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
                            this.el.find('.contract-template-anchor').html('<p>尚未选择模板。</p>');
                        } else {
                            currentTab['elements'][(element.table.table_id) + ''] = valueSource;
                            if (!this.actions._isElementFull(currentTab['elements'])) {
                                this.el.find('.contract-template-anchor').html('<p>请选择所有数据源。</p>');
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
                });
            }
        },
        getElement: function (json) {
            //在componentDialog中使用HTTP则报找不到_http的错误
            return HTTP.postImmediately('/customize/rzrk/get_element/', json);
        },
        addTab: function () {
            let tabEle = $('<li class="contract-tab active">新建</li>');
            $(this.el.find('.contract-tab').get(this.data['current_tab'])).removeClass('active');
            let length = this.el.find('.contract-tab').length;
            this.el.find('.contract-tabs').append(tabEle);
            this.el.find('.contract-model').val(0).removeAttr('disabled');
            this.el.find('.data-source').val(0).removeAttr('disabled');
            this.data.local_data.push({name: '新建', elements: {}, model_id: '', mode: 'edit'});
            this.data['current_tab'] = length;
            this.actions.initButtonStates(this.data['current_tab']);
            this.actions.loadButtons(this.data['current_tab']);
            this.el.find('.contract-template-anchor').html('<p>请选择模板和数据源。</p>');
            //监听tab
            tabEle.on('click', () => {
                this.actions.loadTab(length, true);
            })
            if(this.el.find('.contract-tab').length >= 10){//仅允许最多有十个标签
                this.el.find('.add-tab-button').hide();
            }
        },
        loadTab: function (i, isLoadCache,disabled) {
            if (i == this.data['current_tab']) {
                return;
            }
            $(this.el.find('.contract-tab').get(this.data['current_tab'])).removeClass('active');
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
                    },
                    edit_or_save_text:'编辑'
                });
            } else {
                this.data.buttonStates.push({
                    display:{
                        save_n_close:'none',
                        download_all:'inline',
                        download_current:'inline',
                        edit_or_save:'none',
                    },
                    edit_or_save_text:'编辑'
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

            if (!hasModelId) {
                this.el.find('.contract-template-anchor').html('<p>请选择模板。</p>');
                return;
            }
            if (!this.actions._isElementFull(tab['elements'])) {
                this.el.find('.contract-template-anchor').html('<p>请选择所有数据源。</p>');
                return;
            }

            if (isLoadCache && tab['content']) {
                $(this.el.find('.contract-tab').get(i)).text(tab['name']);
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
                        $(this.el.find('.contract-tab').get(i)).text(tab['name']);
                    }
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
            this.data.historyList.forEach((item) => {
                let html = `<p value="${item.id}">${item.name}</p>`
                this.el.find('.history-template-list').append(html);
            })
        },
        editContract: function (k2v) {
            this.el.find('.contract-template-anchor').find('span').attr('contenteditable', 'true');
            this.el.find('.contract-template-anchor').find('span').on('input', _.debounce(event => {
                let changedColor = 'pink';
                let changedValue = event.target.innerHTML;
                let title = event.target.title;
                k2v["##"+title+"##"]=changedValue;
                if(changedValue == ''){
                    changedValue = ' ';
                    $(event.target).text(changedValue);
                    changedColor = 'yellow'
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
            window.parent.postMessage({
                type: PMENUM.close_dialog,
                key: this.key,
                data: this.data.value
            }, location.origin);
        },
        afterGetMsg: function () {
            this.actions.showHistoryList();
            if(this.data['mode']=='view'){
                this.el.find('.contract-settings').css('display','none');
                this.el.find('.add-tab-button').css('display','none');
                this.el.find('.delete-tab-button').css('display','none');
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
            this.data.local_data = this.data.local_data || JSON.parse(JSON.stringify(this.data.value));
            // this.data.local_data = JSON.parse(JSON.stringify(this.data.value));
            this.actions.getElement(obj).then(res => {
                if (res.success) {
                    this.actions._loadDataSource(res.data.elements);
                    this.actions._loadTmplOptions(res.data.model_files);
                    if (this.data.local_data == '') {
                        this.data.local_data = [];
                        this.actions.addTab();
                    }
                    this.actions._loadTemplateByIndex(0,true,false);
                }
            });

            //加载tab
            let tabsEle = this.el.find('.contract-tabs');
            for (let i = 0, length = this.data.local_data.length; i < length; i++) {
                let tabEle = $('<li class="contract-tab">'+this.data.local_data[i].name+'</li>');
                tabsEle.append(tabEle);
                this.actions.initButtonStates(i);
                this.actions.loadButtons(0);
                tabEle.on('click', ()=>{
                    this.actions.loadTab(i,true,false);
                })
            }
            $(this.el.find('.contract-tab').get(this.data.local_data.length-1)).addClass('active');
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
