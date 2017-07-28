import Component from '../../../lib/component';
import template from './menu.full.html';
import './menu.full.scss';

import ItemComponent from './item/item';

let config = {
    template: template,
    data: {
        list: [
            {
                name: '工作流',
                children: [
                    {name:'工作创建'},
                    {name: '已完成的工作'},
                    {name: '工作审批'},
                    {name: '进行中的工作'},
                    {name: '我的工作'}
                ]
            }
        ]
    },
    actions: {},
    afterRender: function() {
        this.data.list.forEach((data) => {
            this.append(new ItemComponent(data), this.el.find('.root'));
        })
    },
    beforeDestory: () => {

    }
}

class FullMenu extends Component {
    constructor() {
        super(config);
    }
}

export { FullMenu };