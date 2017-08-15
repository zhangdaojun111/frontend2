import Component from "../../../../lib/component";
import template from './leftContent.finished.html';
import './leftContent.finished.scss'
import {CalendarService} from '../../../../services/calendar/calendar.service';
import Mediator from '../../../../lib/mediator';
let config = {
    template:template,
    data:{
    },
    actions:{
    },
    afterRender: function() {
        this.el.css("padding","2px 10px 5px 10px");
    },
}
class leftContentFinished extends Component {
    constructor(){
        super(config);
    }
}
export default leftContentFinished;