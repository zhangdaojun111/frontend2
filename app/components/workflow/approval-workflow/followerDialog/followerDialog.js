/**
 * Created by zj on 2017/11/1.
 */
import Component from '../../../../lib/component';
import template from './followerDialog.html';
import './followerDialog.scss';
import {PMAPI} from '../../../../lib/postmsg';
import Mediator from '../../../../lib/mediator';

let config = {
    template: template,
    data: {
    },
    actions: {
        
    },
    afterRender: function () {
        PMAPI.getIframeParams(window.config.key).then(res => {
            let htmlStr=[];
            for(let k in res.data.focus_users){
                htmlStr.push(`<span class="selectSpan">${res.data.focus_users[k]}</span>`);
            }
            this.el.find('#addFollowerList').html(htmlStr);
        });
        Mediator.on('followerDialog: focus-users', data => {
            let htmlStr=[];
            for(let k in data.data.focus_users){
                htmlStr.push(`<span class="selectSpan">${data.data.focus_users[k]}</span>`);
            }
            this.el.find('#addFollowerList').html(htmlStr);
        })
    }
};

let FollowerDialog = Component.extend(config);
export default FollowerDialog