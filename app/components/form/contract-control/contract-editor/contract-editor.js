/**
 * Created by Yunxuan Yan on 2017/8/18.
 */
import template from './contract-editor.html';
import {AutoSelect} from "../../../util/autoSelect/autoSelect"
import {PMENUM} from '../../../../lib/postmsg';

let css = `
   .contract-editor{       
        width: 880px;
        height: 550px;
        position: relative;
        display: flex;
        overflow: hidden;
        margin: 0 auto;
        margin-top: 10px;
    } 
    .contract-editor-widget{
        margin: 0 auto;
        width: 850px;
        height: 510px;
        display: flex;
        flex: 1;
        border: 1px solid #e4e4e4;  
    }
  .contract-tabs {
    display: inline-block;
    max-width: 1700px;
  }

  .contract-tab {
    display: inline-block;
    padding: 0 15px;
    border-left: 1px solid #D7D7D7;
    border-right: 1px solid #D7D7D7;
  }
  .contract-container{
      border: 1px solid #D7D7D7;     
      width: 100%;
      margin: 4px;
  }
  .select-template{
    margin-bottom: 20px;
  }
  .contract-container-title{
    border-bottom: 1px solid #D7D7D7;
    color: #999999;
    height: 30px;
    line-height: 30px;
    background: #F2F2F2;
  }
  .contract-settings {
     border: 1px solid #D7D7D7;     
      width: 30%;
      margin-top: 4px;
      margin-bottom: 4px;
      margin-left: 4px;
  }
  .contract-settings-title{
    border-bottom: 1px solid #D7D7D7;
    color: #999999;
    display: inline-block;
    background: #F2F2F2;
    height: 30px;
    line-height: 30px;
    width: 100%;
  }
  .contract-container-content{
      overflow: auto;
      height: 460px;
      border: 1px solid #D7D7D7;  
      margin: 4px;
  }
  .contract-tab-container {
    height: 30px;
    line-height: 30px;
    background: #F2F2F2;
    width: 100%;
    border-bottom: 1px solid #D7D7D7;
  }
  .contract-tab{
    cursor: pointer;
  }
  .contract-template-anchor span{
        color: #0088FF;
        background-color: none !important;
  }
    .contract-editor-button{
        position: absolute;
        bottom: 0;
        right: 0;
    }
    .contract-editor-button button{
        margin-left: 10px;
        width: 100px;
        height: 31px;
        background: inherit;
        background-color: #08f;
        border: none;
        border-radius: 4px;
        font-weight: 400;
        font-style: normal;
        font-size: 12px;
        color: #fff;
        cursor: pointer;
    }
  .add-tab-button {
    display:inline-block;
    width: 10px;
    height: 10px;
    background:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAAAVlpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KTMInWQAAAMNJREFUGBmNUDkOwkAQ8yQLFc+gQ0hpeQgNP6FLF15Cw2do0vGM0CRaBnuWQEpW2h3L9hw7gM7R64gX36PzZ1zhhZbCtEONGzIqxhdWYRDWkQZHws1ymERmDDCyM1ZsbVRIUAtly1ShIWcS+DYcAVQ27JKNxoH0mtcpql5pbZiIVV2JY8Xnr5PoOnxbq53h+sk8sd7913pZr/MtjX1Qzv+e7THLVayndc1YBi8zWVQSJ417LuuJmUnyd4ST9MCKPTmu8A2pxEh6XTDHawAAAABJRU5ErkJggg==') no-repeat;
    margin: 0 10px;
    cursor: pointer;
  }

  .delete-tab-button {
    display:inline-block;
    width: 10px;
    height: 10px;
    background:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAACXBIWXMAAAGKAAABigEzlzBYAAABWWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgpMwidZAAABBUlEQVQYGVWQ3U7CQBSEv1OkSBXfrKAmJMolxkcQXgE08QVQL9XYRI3c+Vb+Fasp65y1N+xm09np7JlzxrgMXSquabFkYncMQwtfhdXMwkgoJ2W8xQ9X7HLMFwPmoWJqj1E4D4cEFuyQURKM8zBkzQ3bkn+rNhxEITyJ64j7JGFskbwIOTX3ssjk8BG5lJ5wicltai8JD+rpzJbqcaAfb3rdi8excxK5JqFojGraQklz808iF+c0GCrs67/xW1l3VPU9cil7wpUUIx/QmggWajxT4yvV2Y/CNc/iuuJK3U/dKo8RrDSdcaQsX+Nx7BNn2oG+xcB/FbgpjokVG4F7dEFxtTn5AzxdXK/Y1PcdAAAAAElFTkSuQmCC') no-repeat;
    margin: 0 16px;
    cursor: pointer;
  }
`;

export const contractEditorConfig = {
    template: template,
    binds: [
        {
            event: 'click',
            selector: '.save-n-close',
            callback: function () {
                //删除local_data中的合同信息，此数据不跟随data上传
                for (let data of this.data.local_data) {
                    delete data['content'];
                    delete data['mode'];
                }
                this.data.value = this.data.local_data;
                console.dir(this.data.local_data);
                this.actions.closeMe();
            }
        }, {
            event: 'click',
            selector: '.download-all',
            callback: function () {
                this.actions.downloadTemplate(0, true);
            }
        }, {
            event: 'click',
            selector: '.download-current',
            callback: function () {
                this.actions.downloadTemplate(this.data['current_tab'], false);
            }
        }, {
            event: 'click',
            selector: '.edit-or-save',
            callback: function () {
                if (this.el.find('.edit-or-save').text() == '编辑') {
                    this.el.find('.edit-or-save').text('保存');
                    this.el.find('.save-n-close').css('display', 'none');
                    this.el.find('.download-all').css('display', 'none');
                    this.el.find('.download-current').css('display', 'none');
                    this.data.editingK2v = JSON.parse(JSON.stringify(this.data.local_data[this.data['current_tab']].k2v));
                    this.actions.editContract(this.data.editingK2v);
                } else {
                    this.el.find('.contract-template-anchor').find('span').removeAttr('contenteditable');
                    this.el.find('.edit-or-save').text('编辑');
                    this.el.find('.save-n-close').css('display', 'inline');
                    this.el.find('.download-all').css('display', 'inline');
                    this.el.find('.download-current').css('display', 'inline');
                    this.data.local_data[this.data['current_tab']].k2v = this.data.editingK2v;
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
                    this.actions._loadTemplateByIndex(currentIndex);
                }
            }
        }
    ],
    data: {
        local_data: [],
        elementKeys: [],
        editingk2v: {},
        css: css.replace(/(\n)/g, '')
    },
    actions: {
        loadData(res) {
            this.actions._loadDataSource(res.data.elements);
            this.actions._loadTmplOptions(res.data.model_files);
        },
        //加载各数据源选项
        _loadDataSource: function (elements) {
            if (elements) {
                //数据源
                let dataSourcesEle = this.el.find('.contract-data-source-anchor');

                elements.forEach(element => {
                    let select = $('<select></select>');
                    select.addClass('data-source');
                    select.attr('id', element.table.table_id);
                    select.css({width:'200px',marginTop:'5px'});
                    let defaultOption = $('<option>请选择</option>');
                    defaultOption.attr('value', '0');
                    select.append(defaultOption);
                    this.data.elementKeys.push(element.table.table_id);
                    element.values.forEach(value => {
                        let option = $('<option></option>');
                        option.attr('value', value.id);
                        option.text(value.name);
                        select.append(option);
                    });
                    let ele = $('<div style="margin-top: 10px; margin-left: 5px;"></div>');
                    ele.text(element.table.table_name);
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
                    let optionEle = $('<option></option>');
                    optionEle.attr('value', model.file_id);
                    optionEle.text(model.file_name);
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
            return $.post('/customize/rzrk/get_element/', json);
        },
        addTab: function () {
            this.el.find('.edit-or-save').css('display', 'none');
            let tabEle = $('<li>新建</li>');
            let length = this.el.find('.contract-tab').length;
            tabEle.addClass('contract-tab');
            this.el.find('.contract-tabs').append(tabEle);
            this.el.find('.contract-model').val(0);
            this.el.find('.data-source').val(0);
            this.data.local_data.push({name: '新建', elements: {}, model_id: '', mode: 'edit'});
            this.data['current_tab'] = length;
            this.el.find('.contract-template-anchor').html('<p>请选择模板和数据源。</p>');
            //监听tab
            tabEle.on('click', () => {
                this.actions.loadTab(length, true);
            })
        },
        loadTab: function (i, isLoadCache) {
            if (i == this.data['current_tab']) {
                return;
            }
            this.actions._loadTemplateByIndex(i, isLoadCache);
        },
        //只有在切换tab的时候才会用缓存加载合同
        _loadTemplateByIndex: function (i, isLoadCache) {
            this.el.find('.edit-or-save').css('display', 'none');
            this.data['current_tab'] = i;
            console.log("current tab " + i);
            let tab = this.data.local_data[i];
            if (tab == undefined) {
                console.log('tab[' + i + '] is undefined');
                return;
            }

            //加载选项
            let hasModelId = tab['model_id'] && tab['model_id'] != '';
            this.el.find('.contract-model').val(hasModelId ? tab['model_id'] : 0);
            for (let key of this.data.elementKeys) {
                this.el.find('#' + key).val(tab['elements'][key] || 0);
            }

            if (!hasModelId) {
                this.el.find('.contract-template-anchor').html('<p>请选择模板。</p>');
                return;
            }
            if (!this.actions._isElementFull(tab['elements'])) {
                this.el.find('.data-source').val(0);
                this.el.find('.contract-template-anchor').html('<p>请选择所有数据源。</p>');
                return;
            }


            if (isLoadCache && tab['content']) {
                $(this.el.find('.contract-tab').get(i)).text(tab['name']);
                this.el.find('.contract-template-anchor').html(tab['content']);
                if (this.data.mode == 'edit') {
                    this.el.find('.edit-or-save').css('display', 'inline');
                }
                return;
            }
            let type = tab['mode'] || 'show';
            let index = tab['mode'] ? 0 : i;
            this.actions.getElement({
                table_id: this.data.table_id,
                real_id: this.data.real_id,
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
                    if (this.data.mode == 'edit') {
                        this.el.find('.edit-or-save').css('display', 'inline');
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
                    if (isAll) {
                        this.actions.downloadTemplate(i + 1, isAll);
                    }
                }
            })
        },
        editContract: function (k2v) {
            this.el.find('.contract-template-anchor').find('span').attr('contenteditable', 'true');
            this.el.find('.contract-template-anchor').find('span').on('input', event => {
                let changedValue = event.target.textContent;
                let title = event.target.title;
                k2v["##"+title+"##"]=changedValue;
                this.el.find('span[title="'+title+'"]').text(changedValue);
                this.data.local_data[this.data['current_tab']]['content']=this.el.find('.contract-template-anchor').html();
            })
        },
        closeMe: function () {
            window.parent.postMessage({
                type: '1',
                key: this.key,
                data: this.data.value
            }, location.origin);
        }
    },
    afterRender: function () {
        this.data.style = $('<style type="text/css"></style>').text(this.data.css).appendTo($("head"));

        if(this.data['mode']=='view'){
            this.el.find('.contract-settings').css('display','none');
            this.el.find('.save-n-close').css('display','none');
            this.el.find('.edit-or-save').css('display','none');
            this.el.find('.add-tab-button').css('display','none');
            this.el.find('.delete-tab-button').css('display','none');

        }

        //初始化各控件
        let obj = {
            table_id: this.data.table_id,
            real_id: this.data.real_id,
            field_id: this.data.id
        };
        this.data.local_data = JSON.parse(JSON.stringify(this.data.value));
        this.actions.getElement(obj).then(res => {
            if (res.success) {
                this.actions.loadData(res);
                if (this.data.local_data == '') {
                    this.data.local_data = [];
                    this.actions.addTab();
                }
                this.actions._loadTemplateByIndex(0);
            }
        })

        //加载tab
        let tabsEle = this.el.find('.contract-tabs');
        for (let i = 0, length = this.data.local_data.length; i < length; i++) {
            let tabname = this.data.local_data[i].name;
            let tabEle = $('<li></li>');
            tabEle.addClass('contract-tab');
            tabEle.text(tabname);
            tabsEle.append(tabEle);
            tabEle.on('click', event => {
                this.actions.loadTab(i, true);
            })
        }

    },
    beforeDestory() {
        this.data.style.remove();
    }
}
