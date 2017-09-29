import template from './search.html';
import {Base} from '../base';
import './search.scss';
import {PMAPI,PMENUM} from '../../../../../lib/postmsg';
import {dgcService} from '../../../../../services/dataGrid/data-table-control.service';
let config = {
    template: template,
    data: {
        fields: [],
        value: {}
    },
    actions: {
        /**
         * 显示高级查询dialog
         * @param data{tableId: 数据源，fieldsData： x轴字段，commonQuery: 查询条件}
         */
        showAdvancedDialog(data) {
            this.data.fields = data.fieldsData;
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
                    let filterValues = _.cloneDeep(res).value.map(item => {
                        if (item.cond.keyword.indexOf('1970-07-01') !== -1) {
                            item.cond.keyword = this.actions.filterDate(item) ? '%date%' : item.cond.keyword;
                        };
                        return item;
                    });
                    let params = {};
                    params['filter'] = filterValues;
                    let result = dgcService.returnQueryParams(params);
                    this.data.value = {
                        filter: result.filter,
                        filter_source: {
                            id:1987,
                            name: '高级查询数据',
                            queryParams: JSON.stringify(res.value)
                        }
                    };
                }
            })
        },
        /**
         * 当时间字段设置为1970-07-01 00：00：00 替换格式为%date%
         * @param data = 查询字段的名字
         */
        filterDate(value) {
            let isDateColumn;
            for(let field of this.data.fields) {
                if (value.cond.searchBy === field.dfield && (field.type == 3 || field.type == 5 || field.type == 12 || field.type == 30)) {
                    isDateColumn = true
                    break;
                };
            }
            return isDateColumn;
        },
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