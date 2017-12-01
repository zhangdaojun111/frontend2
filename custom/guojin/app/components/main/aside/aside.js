/**
 * Created by zj on 2017/12/1.
 */
import {AsideComponent as AsideComponentOld} from '../../../../../../app/components/main/aside/aside'
import WorkbenchComponent from '../workbench/workbench';
import Mediator from '../../../../../../app/lib/mediator';
import template from './aside.html';
import './aside.scss';
let config = {
    template: template,
    data: {
    },
    actions: {


    },
    afterRender: function () {

    },
    firstAfterRender: function() {
        Mediator.on('tool-bar: workbench', () => {
            this.el.find('.menu').css('display','none');
            this.el.find('.menu-setting').css('display','none');
            this.append(new WorkbenchComponent(), this.el.find('.workbench'));
        });
        Mediator.on('tool-bar: folder', () => {
            this.el.find('.menu').css('display', 'inline');
            this.el.find('.workbench').empty();
            this.el.find('.menu-setting').css('display','inline');
            this.actions.showAllMenu();
        })
    },
    beforeDestory: function() {
        Mediator.removeAll('aside');
        Mediator.removeAll('tool-bar');
    }
};

class AsideComponent extends AsideComponentOld{
    constructor(){
        super(config);
    }
}
export {AsideComponent};
