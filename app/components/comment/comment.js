import Component from "../../lib/component";
import template from './comment.html';
import './comment.scss';

import Item from './item/item';

import Mediator from '../../lib/mediator';

window.M = Mediator;

let config = {
    template: template,
    data: {
        title: '这里是评论区',
        comments: [
            {text: '大哥说得好1'},
            {text: '大哥说得好2'},
            {text: '大哥说得好3'},
            {text: '大哥说得好4'},
            {text: '大哥说得好5'}
        ]
    },
    actions: {
        loadMore: function() {
            [{text: '这是加载更多1'},{text: '这是加载更多2'}].forEach((row) => {
                console.log(row);
                this.append(new Item(row), this.el.find('.list'));
            });
        },
        reload: function() {
            this.destroyChildren();
            this.data.comments.forEach((row) => {
                this.append(new Item(row), this.el.find('.list'));
            });
        },
        removeChannel: function() {
            Mediator.removeAll('comment');
        }
    },
    afterRender: function() {

        this.data.comments.forEach((row) => {
            this.append(new Item(row), this.el.find('.list'));
        });

        this.el.on('click', '.loadmore', () => {
            this.actions.loadMore();
        }).on('click', '.reload', () => {
            this.actions.reload();
        }).on('click', '.unsubscribe', () => {
            this.actions.removeChannel();
        }).on('click', '.dialog', () => {
            $('<div>123123123123</div>').appendTo(document.body).dialog({
                title: 'iframe内弹出'
            })
        });

        Mediator.subscribe('comment:get', function(msg) {
            console.log(msg);
        })
    }
}

class Comment extends Component {
    constructor() {
        super(config);
    }
}

export default Comment;