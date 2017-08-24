/**
 * Created by Yunxuan Yan on 2017/8/18.
 */
/**
 * Created by Yunxuan Yan on 2017/8/18.
 */
import template from './contract-editor.html';
import './contract-editor.scss';

export const contractEditorConfig = {
    template:template,
    data:{
        local_data:[],
        elementKeys:[],
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
            let elements = {};
            for(let key of this.data.elementKeys){
                elements[key]=0
            }
            this.data.local_data.push({name:'新建',elements:elements,model_id:''});
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
            let modelFlag = !tab['model_id']||tab['model_id']=='';
            let dataSourceFlag = !this.actions._isElementFull(tab['elements']);
             if(modelFlag){
                this.el.find('.contract-model').val(0);
            }
            if(modelFlag || dataSourceFlag){
                this.el.find('.contract-template-anchor').html('<p>请选择模板及所有数据源。</p>');
                return;
            }

            let currentTabData = this.data.local_data[this.data['current_tab']];
            this.el.find('.contract-model').val(currentTabData['model_id']);
            let keys = Object.keys(currentTabData['elements']);
            for(let key of keys){
                this.el.find('#'+key).val(currentTabData['elements'][key]);
            }

            if(this.data.local_data[i]['content']){
                this.el.find('.contract-template-anchor').html(this.data.local_data[i]['content']);
                return;
            }

            this.actions.getElement({
                table_id:this.data.table_id,
                real_id:this.data.temp_id,
                field_id:this.data.id,
                model_id:this.data.local_data[i].model_id,
                elements:JSON.stringify(this.data.local_data[i].elements||{}),
                type:this.data['mode'],
                index:0
            }).then(res=>{
               if(res.success && this.data['current_tab'] == i){
                    this.el.find('.contract-template-anchor').html(res.data.content);
                    this.data.local_data[i]['content']=res.data.content;
                    this.data.local_data[i]['k2v']=res.data.k2v;
                    this.el.find('.edit-or-save').css('display','inline');
                }
            })
        },
        _isElementFull:function (elements) {
            for(let value of Object.values(elements)){
                if(value==0 || value == ''){
                    return false;
                }
            }
            return true;
        },
        downloadTemplate:function (i,isAll) {
            let contractData = this.data.local_data[i];
            $.post('/customize/rzrk/download_contract/',{
                table_id:this.data.table_id,
                real_id:this.data.data.temp_id,
                field_id:this.data.id,
                model_id:contractData.model_id,
                k2v:contractData.k2v,
                file_name:contractData.name
            }).then(res=>{
                if(res.success){
                    if(isAll){
                        this.actions.downloadTemplate(i++,isAll);
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
            real_id:this.data.temp_id,
            field_id:this.data.id
        };
        this.data.local_data = JSON.parse(JSON.stringify(this.data.value));
        this.actions.getElement(obj).then(res=>{
            if(res.success){
                this.actions.loadData(res);
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

        let t = this;
        let editingK2v={};
        this.el.on('click','.save-n-close',()=>{
            //删除local_data中的合同信息，此数据不跟随data上传
            for(let data of this.data.local_data){
                delete data['content'];
            }
            this.data.value = this.data.local_data;
            delete this.data.local_data;
            delete this.data.elementKeys;
            this.actions.closeMe();
        }).on('click','.download-all',()=>{
            this.actions.downloadTemplate(0,true);
        }).on('click','.download-current',()=>{
            this.actions.downloadTemplate(this.data['current_tab'],false);
        }).on('click','.edit-or-save',function () {
            if($(this).text() == '编辑'){
                $(this).text('保存');
                t.el.find('.save-n-close').css('display','none');
                t.el.find('.download-all').css('display','none');
                t.el.find('.download-current').css('display','none');
                t.data.local_data[t.data['current_tab']].k2v = {
                    test:'test'
                }
                editingK2v = JSON.parse(JSON.stringify(t.data.local_data[t.data['current_tab']].k2v));
                t.actions.editContract(editingK2v);
            } else {
                $(this).text('编辑');
                t.el.find('.save-n-close').css('display','inline');
                t.el.find('.download-all').css('display','inline');
                t.el.find('.download-current').css('display','inline');
                t.data.local_data[t.data['current_tab']].k2v = editingK2v;
            }
        }).on('click','.add-tab-button',()=>{
            this.actions.addTab();
        }).on('click','.delete-tab-button',()=>{
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
        })
    }
}
