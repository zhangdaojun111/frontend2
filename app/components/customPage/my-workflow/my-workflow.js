import Component from "../../../lib/component";
import template from './my-workflow.html';
import './my-workflow.scss';
import workflowPage from '../workflow-page/workflow-page';

let config = {
    template: template,
    data: {},
    actions: {
        renderGrid: function () {
            let as = this.el.find( '.tab-title li a' );
            let pages = this.el.find( '.page-contener div' );
            let pageArr = [];
            let select = '';
            for( let p of pages ){
                pageArr.push( p.tableId )
            }
            for( let a of as ){
                if( a.className == 'select' ){
                    select = a.id;
                    break;
                }
            }
            if( pageArr.indexOf( select ) == -1 ){
                var div = document.createElement( 'div' )
                div.attributes['tableId'] = select;
                div.innerHTML = '<iframe frameborder="0" src="/datagrid/custom_index/?table_id=0&folder_id=2&custom_id='+select+'"></iframe>';
                this.el.find( '#page-contener' ).append( div );
            }

        }
    },
    afterRender: function (){
        this.actions.renderGrid();
    }
}

class myWorkflow extends Component {
    constructor( data ) {
        for( let d in data ){
            config.data[d] = data[d];
        }
        super(config);
    }
}

export default myWorkflow;