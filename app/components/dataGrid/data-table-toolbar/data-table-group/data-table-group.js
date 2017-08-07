import Component from "../../../../lib/component";
import template from './data-table-group.html';
import {HTTP} from "../../../../lib/http"
import {dataTableService} from "../../../../services/dataGrid/data-table.service";
import './data-table-group.scss';

let config = {
    template: template,
    data: {
        tableId: null,
        gridoptions: null,
        fields: [],
        myGroup:[],
    },
    group:[],
    actions: {

    },
    afterRender: function (){
        $('.group-data-list, .grouping-data-list').sortable({
            connectWith: ".connectedSortable",
            stop: function() {
                let dom = $('.grouping-data-list').find('.group-data-item');
                for (let i = 0; i < dom.length; i++) {
                    config.group.push(dom[i].attributes['field'].nodeValue);
                }
                dataTableService.savePreference({
                    action: 'group',
                    table_id: config.data.tableId,
                    group: JSON.stringify(config.group)
                });
                HTTP.flush();
            }
        }).disableSelection();
        // $('.grouping-data-list').bind('.sortstop',function(event) {
        //     console.log('11111')
        // })
        console.log(this.data)
    }
}

class groupGrid extends Component {
    constructor(data) {
        for (let d in data) {
            config.data[d] = data[d]
        }
        super(config);
    }
}

export default groupGrid;