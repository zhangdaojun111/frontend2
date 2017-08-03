
import '../assets/scss/main.scss';

import 'jquery-ui/ui/widgets/button.js';
import 'jquery-ui/ui/widgets/dialog.js';

import Login from '../components/login/login';
import {HTTP} from '../lib/http';
import TreeView from "../components/util/tree";

$('#login').button({
    label: '点击登录'
}).on('click', function() {
    Login.show();
});

///tree demo
var tree = [
    {
        text: "Parent 1",
        nodes: [
            {
                text: "Child 1",
                nodes: [
                    {
                        text: "Grandchild 1"
                    },
                    {
                        text: "Grandchild 2"
                    }
                ]
            },
            {
                text: "Child 2"
            }
        ]
    },
    {
        text: "Parent 2"
    },
    {
        text: "Parent 3"
    },
    {
        text: "Parent 4"
    },
    {
        text: "Parent 5"
    }
];
var treeComp = new TreeView(tree,function (event,selectedNode) {
    console.dir(selectedNode);
},'MENU');
treeComp.render($('#treeTest'));
///tree demo

async function wait() {
    let data = await HTTP.ajaxImmediately({
        async:false,
        url: 'https://api.asilu.com/weather/',
        type: "GET",
        dataType: 'jsonp',
        jsonp: 'callback',
        data: {
            city: '济宁'
        },
        timeout: 5000
    });
    console.log(data);
    console.log('hello world 123123');
}
wait();

$('#active').button().on('click', function() {

});

$('#silent').button().on('click', function() {

})

HTTP.get('user', {name: '123123'}).then(function() {
    console.log(arguments);
});

HTTP.post('dept', {did: 123123}).then(function() {
    console.log(arguments);
});

HTTP.post('dept2', {did: 123123}).then(function() {
    console.log(arguments);
});

HTTP.get('dept3', {did: 123123}).then(function() {
    console.log(arguments);
});

HTTP.flush();
