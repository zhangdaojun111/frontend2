import template from './search.html';
import {Base} from '../base';
import './search.scss';
import {PMAPI,PMENUM} from '../../../../../lib/postmsg';
import {dgcService} from '../../../../../services/dataGrid/data-table-control.service';
let config = {
    template: template,
    data: {
    },
    actions: {
        /**
         * 显示高级查询dialog
         * @param data{tableId: 数据源，fieldsData： x轴字段，commonQuery: 查询条件}
         */
        showAdvancedDialog(data) {
            console.log(data);
            let fieldsData = _.cloneDeep(data.fieldsData).map(item => {
                item['field'] = item['dfield'];
                item['real_type'] = item['type'];
                return item;
            });

            let d = {
                tableId: data.tableId ? data.tableId : '',
                fieldsData: data.fieldsData ? dgcService.createNeedFields(fieldsData).search : [],
                commonQuery: data.commonQuery ? data.commonQuery : [],
            };
            PMAPI.openDialogByIframe(`/iframe/expertSearch/`,{
                width:950,
                height:600,
                title:`高级查询`,
                modal:true,
            },{d}).then(res=>{
                if (res.onlyclose) {
                    this.data.value = {}
                } else {
                    console.log(res);
                    let params = {};
                    params['filter'] = res.value;
                    let result = dgcService.returnQueryParams(params);
                    this.data.value = {
                        filter: result.filter,
                        filter_source: {
                            id:1987,
                            name: '高级查询数据',
                            queryParams: JSON.stringify(res.value)
                        }
                    };
                    console.log(this.data.value);
                }
            })
        }
    },

    binds: [
        {
            event: 'click',
            selector: '.advanced-search-btn',
            callback: function (context) {
                this.trigger('onShowAdvancedSearchDialog');
            }
        }
    ],
    afterRender(){
    }
};

class Search extends Base {
    constructor(data, event) {
        super(config, data, event)
    }

    /**
     * 设置高级查询条件值
     * @param value = 高级查询条件值
     */
    setValue(value) {
        this.data.value = value['filter'] ? value : null;
    }
}

export {Search}