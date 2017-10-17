                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             /**
 * Created by zhr
 */
import Component from "../../../../lib/component";
import template from './data-table-group.html';
import {HTTP} from "../../../../lib/http"
import {dataTableService} from "../../../../services/dataGrid/data-table.service";
import './data-table-group.scss';
import 'jquery-ui/ui/widgets/sortable.js';

let config = {
    template: template,

    data: {
        initialGroup:[],
        group:[],
        pregroup:[],
        tableId: null,
        gridoptions: null,
        changeChecked: false,
        fields: [],
        myGroup:[],
        groupField:[],
        close: function () {}
    },
    actions: {
        onGroupChange: function (group) {
        },
        //搜索事件
        inputSearch: function () {
            this.el.find( '.group-search-input' ).on( 'input',_.debounce( ()=>{
                let val = this.el.find( '.group-search-input' )[0].value;
                let lis = this.el.find( '.group-data-list' ).find( 'li' );
                for( let li of lis ){
                    li.style.display = li.attributes.name.value.indexOf( val ) == -1 && val!='' ? 'none':'block'
                }
            },1000))
        },
    },
    afterRender: function (){
        this.data.group = this.data.groupFields;
        this.el.find('.group-data-list, .grouping-data-list').sortable({
            connectWith: ".connectedSortable",
            stop: ()=> {
                this.data.changeChecked = false;
                this.data.group = [];
                let dom = $('.grouping-data-list').find('.group-data-item');
                for (let i = 0; i < dom.length; i++) {
                    this.data.group.push(dom[i].attributes['field'].nodeValue);
                }

                if(this.data.group && this.data.groupFields && this.data.group.toString() == this.data.groupFields.toString()) {
                    this.el.find('.resetGroup').css('color','#999999');
                } else if(!this.data.group && !this.data.groupFields){
                    this.el.find('.resetGroup').css('color','#999999');
                } else {
                    this.el.find('.resetGroup').css('color','#0F79EF');
                }
                if(this.data.group.toString() != this.data.pregroup.toString()){
                    this.data.changeChecked = true;
                }
                dataTableService.savePreference({
                    action: 'group',
                    table_id: this.data.tableId,
                    group: JSON.stringify(this.data.group)
                });
                HTTP.flush();
                this.actions.onGroupChange( this.data.group, this.data.changeChecked );
                this.data.pregroup = this.data.group;
            }
        }).disableSelection();
        this.actions.inputSearch();

        //关闭
        this.el.find( '.closeGroup' ).on( 'click',()=>{
            this.data.close();
        } )

        //重置
        this.el.find( '.resetGroup' ).on( 'click',()=>{
            this.reload();
            this.actions.onGroupChange( this.data.groupFields,this.data.changeChecked );
        })

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