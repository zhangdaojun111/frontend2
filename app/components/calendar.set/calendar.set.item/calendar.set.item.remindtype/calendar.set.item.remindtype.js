import Component from "../../../../lib/component";
import template from "./calendar.set.item.remindtype.html";
import "./calendar.set.item.remindtype.scss";
import {CalendarService} from '../../../../services/calendar/calendar.service';
import {PMAPI} from '../../../../lib/postmsg';
import Mediator from '../../../../lib/mediator';

let config = {
    template: template,
    data: {
        data_list:[{"id": "7095_WgkZ3DcNTNv4FzVSjWSVLT","name": "创建时间"},{"id": "7233_3UbNhthmokGtEEUUo8a9nG","name": "更新时间"},{"id": "483_s6mZoCtd49F63udAzMXtX5","name": "创建人"}],
    },
    actions: {
    },
    afterRender: function () {
        this.el.css("width", "100%");
    },
};
class CalendarSetItemremindtype extends Component {
    constructor(data) {
        config.data = data;
        super(config);
    }
}
export default CalendarSetItemremindtype;