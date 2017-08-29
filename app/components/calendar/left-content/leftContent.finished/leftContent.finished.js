/**
 * Created by lipengfei.
 * 已完成内容
 */
import Component from "../../../../lib/component";
import template from './leftContent.finished.html';
import './leftContent.finished.scss';
import {PMAPI} from '../../../../lib/postmsg';
import {CalendarService} from '../../../../services/calendar/calendar.service';
import Mediator from '../../../../lib/mediator';
let config = {
    template:template,
    data:{
    },
    actions:{
    },
    events:{
        // onChange:function(){},
    },
    binds:[
        {
            event: 'click',
            selector: '.has-finished',
            callback: function () {
            }
        }
    ],
    afterRender: function() {
        this.el.on('click', '.finished-content', () => {
            PMAPI.openDialogByIframe(
                `/wf/approval/?record_id=${this.data['id']}&form_id=${this.data['form_id']}&table_id=${this.data['table_id']}&flow_id=${this.data['flow_id']}`,
                {
                    width: "100%",
                    height: '900',
                    modal: true,
                    customSize: true,
                })
        })
    },
}
class leftContentFinished extends Component {
    constructor(data){
        config.data= data;
        super(config);
    }
}
export default leftContentFinished;