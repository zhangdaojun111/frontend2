import Component from '../../../../lib/component';
import template from './drag-bar.html';
import './drag-bar.scss';

let config = {
    template:template,
    actions:{
        initBar(){
            let status = this.data.status.toString();
            let checked;
            if(status.length === 1){
                checked = status === '1';
            }else{
                //首页的status为多位数，最后一位表示开关
                checked = status.substring(status.length - 1, status.length) === '1';
            }
            this.el.find('input').prop('checked',checked);
        }
    },
    afterRender(){
        this.actions.initBar();
    }
};

export let dragBar = Component.extend(config);