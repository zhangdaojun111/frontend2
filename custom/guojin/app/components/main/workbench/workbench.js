/**
 * Created by zj on 2017/11/30.
 */
import Component from "../../../../../../app/lib/component";
import template from './workbench.html';
import './workbench.scss';
import Mediator from '../../../../../../app/lib/mediator';

let config = {
    template: template,
    data: {
        data: [],
    },
    actions: {
        workCreate: function () {
            Mediator.emit('menu:item:openiframe', {
                id: 'start-workflow',
                name: '发起工作流',
                url: window.config.sysConfig.create_wf
            });
        },

        openMyWork: function () {

        }
    },
    binds: [
        {
            event: 'click',
            selector: '.work-create',
            callback: function () {
                this.actions.workCreate();
            }
        }, {
            event: 'click',
            selector: '.my-work',
            callback: function () {
                Mediator.emit('menu:item:openiframe', {
                    id: 'my-workflow',
                    name: '我的工作',
                    url: '/datagrid/custom_index/?table_id=0&folder_id=6&custom_id=my-workflow'
                });
            }
        },
    ],
    afterRender: function() {
    }
};

class WorkbenchComponent extends Component {
    constructor(newconfig = {}) {
        super($.extend(true ,{}, config, newconfig));
    }
}

export default WorkbenchComponent;