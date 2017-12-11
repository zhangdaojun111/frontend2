/**
 * @author yangxiaochuan
 * 我的工作定制表
 */
import Component from "../../../lib/component";
import template from './my-workflow.html';
import './my-workflow.scss';
import workflowPage from '../workflow-page/workflow-page';

let myWorkflow = Component.extend({
    template: template,
    data: {
        pageArr: []
    },
    actions: {
        renderGrid: function () {
            let as = this.el.find( '.tab-title li a' );
            let pages = this.el.find( '.page-contener div' );
            let select = '';
            for( let a of as ){
                if( a.className == 'select' ){
                    select = a.id;
                    break;
                }
            }
            if( this.data.pageArr.indexOf( select ) == -1 ){
                this.data.pageArr.push( select );
                let div = document.createElement( 'div' );
                div.className = select;
                let json = {tableId:select};
                let work = new workflowPage({data: json});
                this.el.find( '#page-contener' ).append( div );
                work.render( this.el.find( '.' + select ) );
            }
            for( let a of this.data.pageArr ){
                let aaa = this.el.find( '.' + a );
                if( a == select ){
                    this.el.find( '.' + a )[0].style.display = 'block';
                }else {
                    this.el.find( '.' + a )[0].style.display = 'none';
                }
            }
        },
        liClick: function () {
            this.el.find( '.tab-title li a' ).on( 'click',($event)=>{
                let as = this.el.find( '.tab-title li a' );
                for( let a of as ){
                    a.className = a.id == $event.target.id?'select':'';
                }
                this.actions.renderGrid();
            } )
        }
    },
    afterRender: function (){
        this.actions.renderGrid();
        this.actions.liClick();
    }
})

// class myWorkflow extends Component {
//     constructor(data,newConfig){
//         for (let d in data) {
//             config.data[d] = data[d];
//         }
//         super($.extend(true,{},config,newConfig,{data:data||{}}));
//     }
// }

export default myWorkflow;