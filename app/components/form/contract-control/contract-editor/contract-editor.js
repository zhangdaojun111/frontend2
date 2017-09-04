/**
 * Created by Yunxuan Yan on 2017/8/18.
 */
import template from './contract-editor.html';
import './contract-editor.scss';
import {PMENUM} from '../../../../lib/postmsg';

export const contractEditorConfig = {
    template:template,
    binds:[
        {
           event:'click',
           selector:'.save-n-close',
           callback:function () {
               //删除local_data中的合同信息，此数据不跟随data上传
               for(let data of this.data.local_data){
                   delete data['content'];
               }
               this.data.value = this.data.local_data;
               this.actions.closeMe();
           }
        },{
            event:'click',
            selector:'.download-all',
            callback:function () {
                this.actions.downloadTemplate(0,true);
            }
        },{
            event:'click',
            selector:'.download-current',
            callback:function () {
                this.actions.downloadTemplate(this.data['current_tab'],false);
            }
        },{
            event:'click',
            selector:'.edit-or-save',
            callback:function () {
                if(this.el.find('.edit-or-save').text() == '编辑'){
                    this.el.find('.edit-or-save').text('保存');
                    this.el.find('.save-n-close').css('display','none');
                    this.el.find('.download-all').css('display','none');
                    this.el.find('.download-current').css('display','none');
                    this.data.editingK2v = JSON.parse(JSON.stringify(this.data.local_data[this.data['current_tab']].k2v));
                    this.actions.editContract(this.data.editingK2v);
                } else {
                    this.el.find('.contract-template-anchor').find('span').removeAttr('contenteditable');
                    this.el.find('.edit-or-save').text('编辑');
                    this.el.find('.save-n-close').css('display','inline');
                    this.el.find('.download-all').css('display','inline');
                    this.el.find('.download-current').css('display','inline');
                    this.data.local_data[this.data['current_tab']].k2v = this.data.editingK2v;
                }
            }
        },{
            event:'click',
            selector:'.add-tab-button',
            callback:function () {
                this.actions.addTab();
            }
        },{
            event:'click',
            selector:'.delete-tab-button',
            callback:function () {
                let currentIndex = this.data['current_tab'];
                this.data.local_data.splice(currentIndex,1);
                //删除标签
                this.el.find('.contract-tab').get(currentIndex).remove();
                //如果右边有标签，当前标签向右移，没有则向左移
                currentIndex = currentIndex==this.data.local_data.length?currentIndex-1:currentIndex;
                if(currentIndex == -1){
                    this.actions.addTab();
                } else {
                    this.actions._loadTemplateByIndex(currentIndex);
                }
            }
        }
    ],
    data:{
        local_data:[],
        elementKeys:[],
        editingk2v:{},
    },
    actions:{
        loadData(res){
            this.actions._loadDataSource(res.data.elements);
            this.actions._loadTmplOptions(res.data.model_files);
        },
        //加载各数据源选项
        _loadDataSource:function (elements) {
            if(elements){
                //数据源
                let dataSourcesEle = this.el.find('.contract-data-source-anchor');
                elements.forEach(element=>{
                    let select = $('<select></select>');
                    select.addClass('data-source');
                    select.attr('id',element.table.table_id);
                    select.css('width','200px');
                    let defaultOption = $('<option>请选择</option>');
                    defaultOption.attr('value','0');
                    select.append(defaultOption);
                    this.data.elementKeys.push(element.table.table_id);
                    element.values.forEach(value=>{
                        let option = $('<option></option>');
                        option.attr('value',value.id);
                        option.text(value.name);
                        select.append(option);
                    });
                    let ele = $('<div></div>');
                    ele.text(element.table.table_name);
                    ele.append(select);
                    dataSourcesEle.append(ele);
                    ele.on('change',(event)=>{
                        let valueSource = event.target.value;
                        let currentTab = this.data.local_data[this.data['current_tab']];
                        if(currentTab['model_id']==undefined){
                            this.el.find('.contract-template-anchor').html('<p>尚未选择模板。</p>');
                        } else {
                            currentTab['elements'][element.table.table_id]=valueSource;
                            if(!this.actions._isElementFull(currentTab['elements'])){
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
        _loadTmplOptions:function (model_files) {
            if(model_files){
                let options = this.el.find('.contract-model');
                //模板选择
                model_files.forEach(model=>{
                    let optionEle = $('<option></option>');
                    optionEle.attr('value',model.file_id);
                    optionEle.text(model.file_name);
                    options.append(optionEle);
                });
                options.on('change',(event)=>{
                    this.data.local_data[this.data['current_tab']]['model_id']=event.target.value;
                    this.actions._loadTemplateByIndex(this.data['current_tab']);
                });
            }
        },
        getElement:function (json) {
            //在componentDialog中使用HTTP则报找不到_http的错误
            return $.post('/customize/rzrk/get_element/',json);
        },
        addTab:function(){
            this.el.find('.edit-or-save').css('display','none');
            let tabEle = $('<li>新建</li>');
            let length = this.el.find('.contract-tab').length;
            tabEle.addClass('contract-tab');
            this.el.find('.contract-tabs').append(tabEle);
            this.el.find('.contract-model').val(0);
            this.el.find('.data-source').val(0);
            this.data.local_data.push({name:'新建',elements:{},model_id:''});
            this.data['current_tab'] = length;
            this.el.find('.contract-template-anchor').html('<p>请选择模板和数据源。</p>');
            //监听tab
            tabEle.on('click',()=>{
                this.actions.loadTab(length);
            })
        },
        loadTab:function (i) {
            if(i == this.data['current_tab']){
                return;
            }
            this.actions._loadTemplateByIndex(i);
        },
        _loadTemplateByIndex:function (i) {
            this.el.find('.edit-or-save').css('display','none');
            this.data['current_tab']=i;
            console.log("current tab "+i);
            let tab = this.data.local_data[i];
            if(tab==undefined){
                console.log('tab['+i+'] is undefined');
                return;
            }
            if(!tab['model_id']||tab['model_id']==''){
                this.el.find('.contract-model').val(0);
                this.el.find('.contract-template-anchor').html('<p>请选择模板。</p>');
                return;
            }
            if(!this.actions._isElementFull(tab['elements'])){
                this.el.find('.contract-template-anchor').html('<p>请选择所有数据源。</p>');
                return;
            }

            let currentTabData = this.data.local_data[i];
            this.el.find('.contract-model').val(currentTabData['model_id']);
            let keys = Object.keys(currentTabData['elements']);
            for(let key of keys){
                this.el.find('#'+key).val(currentTabData['elements'][key]);
            }

            this.actions.getElement({
                table_id:this.data.table_id,
                real_id:this.data.real_id,
                field_id:this.data.id,
                model_id:currentTabData.model_id,
                elements:JSON.stringify(currentTabData.elements||{}),
                type:'show',
                index:0
            }).then(res=>{
               if(res.success && this.data['current_tab'] == i){
                    this.el.find('.contract-template-anchor').html(res.data.content);
                    this.data.local_data[i]['content']=res.data.content;
                    this.data.local_data[i]['k2v']=res.data.k2v;
                    this.el.find('.edit-or-save').css('display','inline');
                    let tabName =[];
                    if(Object.keys(this.data.local_data[i].elements).length != 0){
                        for(let key of this.data.elementKeys){
                            let selectEle = this.el.find('#'+key)[0];
                            tabName.push(selectEle.selectedOptions[0].label);
                        }
                        tab['name']=tabName.join(' ');
                        $(this.el.find('.contract-tab').get(i)).text(tab['name']);
                    }
                }
            })
        },
        _isElementFull:function (elements) {
            if(Object.keys(elements).length == 0){
                return true;
            }
            for(let key of this.data.elementKeys){
                let value = elements[key];
                if(!value||value==0 || value == ''){
                    return false;
                }
            }
            return true;
        },
        downloadTemplate:function (i,isAll) {
            let contractData = this.data.local_data[i];
            $.post('/customize/rzrk/download_contract/', {
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
                    if(isAll){
                        this.actions.downloadTemplate(i+1,isAll);
                    }
                }
            })
        },
        editContract:function (k2v) {
            this.el.find('.contract-template-anchor').find('span').attr('contenteditable','true');
            this.el.find('.contract-template-anchor').find('span').on('input',event=>{
                let changedValue = event.target.textContent;
                let title = event.target.title;
                k2v["##"+title+"##"]=changedValue;
                this.el.find('span[title="'+title+'"]').text(changedValue);
            })
        },
        closeMe:function () {
            window.parent.postMessage({
                type:'1',
                key:this.key,
                data:this.data.value
            },location.origin);
        }
    },
    afterRender:function () {
        if(this.data['mode']=='view'){
            this.el.find('.contract-settings').css('display','none');
            this.el.find('.save-n-close').css('display','none');
            this.el.find('.edit-or-save').css('display','none');
        }

        //初始化各控件
        let obj = {
            table_id:this.data.table_id,
            real_id:this.data.real_id,
            field_id:this.data.id
        };
        this.data.local_data = JSON.parse(JSON.stringify(this.data.value));
        this.actions.getElement(obj).then(res=>{
            if(res.success){
                this.actions.loadData(res);
                if(this.data.local_data==''){
                    this.data.local_data = [];
                    this.actions.addTab();
                }
                this.actions._loadTemplateByIndex(0);
            }
        })

        //加载tab
        let tabsEle = this.el.find('.contract-tabs');
        for(let i = 0, length = this.data.local_data.length; i < length; i++){
            let tabname = this.data.local_data[i].name;
            let tabEle = $('<li></li>');
            tabEle.addClass('contract-tab');
            tabEle.text(tabname);
            tabsEle.append(tabEle);
            tabEle.on('click',event=>{
                this.actions.loadTab(i);
            })
        }

    }
}
