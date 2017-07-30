import Component from '../../../lib/component';
import template from './menu.full.html';
import './menu.full.scss';

import {FullMenuItem} from './item/item';

let config = {
    template: template,
    data: {
        list: [
            {
                name: '工作流',
                children: [
                    {
                        name: '工作创建',
                        children: [
                            {
                                name: '工作创建',
                                children: [
                                    {
                                        name: '工作创建',
                                        children: [
                                            {
                                                name: '工作创建'
                                            }, {
                                                name: '已完成的工作'
                                            }
                                        ]
                                    }, {
                                        name: '已完成的工作'
                                    }
                                ]
                            }, {
                                name: '已完成的工作'
                            }
                        ]
                    }, {
                        name: '已完成的工作',
                        id: '123123',
                        url: './iframe.html'
                    }
                ]
            }, {
                name: '工作流2',
                id: '3333',
                url: './iframe.html'
            }
        ]
    },
    actions: {
        search: function() {

        }
    },
    afterRender: function () {
        this.data.list.forEach((data) => {
            this.append(new FullMenuItem(_.defaultsDeep({}, data, {root: true, offset: 0})), this.el.find('.root'));
        });

        this.el.css({
            height: 'calc(100% - 230px)',
            overflow: 'auto'
        })
    },
    beforeDestory: () => {

    }
}


export const FullMenuInstance = new Component(config);