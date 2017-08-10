
// import 'jquery-ui/themes/base/base.css';
// import 'jquery-ui/themes/base/theme.css';
import '../assets/scss/main.scss';
import '../services/main/socket';

import {IframeInstance} from '../components/main/iframes/iframes';
import {HeaderInstance} from '../components/main/header/header';
import {AsideInstance} from '../components/main/aside/aside';

_.defaultsDeep(AsideInstance.data, {
    systemName: window.config.sysConfig.logic_config.sap_login_system_name,
    avatar: window.config.sysConfig.userInfo.avatar,
    avatar_content:window.config.sysConfig.userInfo.avatar_content,
    username: window.config.sysConfig.userInfo.username,
    role: window.config.sysConfig.userInfo.is_superuser === 1 ? '管理员' : '普通用户'
})
import Login from '../components/login/login';
import {HTTP} from '../lib/http';
import TreeView from "../components/util/tree/tree";
import "../tree1.scss";
import "../tree2.scss";

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
                text: "Child 2",
                nodes: [
                    {
                        text: "Grandchild 1"
                    },
                    {
                        text: "Grandchild 2"
                    }
                ]
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
    console.log("选中节点："+selectedNode.text);
    // console.dir(selectedNode);
},'SINGLE_SELECT',false,'tree1');
treeComp.render($('#treeSingle'));
var treeComp1 = new TreeView(tree,function (event,selectedNode) {
    console.log("选中节点："+selectedNode.text);
    // console.dir(selectedNode);
},'MENU',false,'tree2');
treeComp1.render($('#treeMenu'));

//多选树
var treeComp2 = new TreeView(tree,{
    callback: function (event,selectedNode) {
        console.log(event +"："+selectedNode.text);
        // console.dir(selectedNode);
    },
    treeType:'MULTI_SELECT',
    isSearch: true,
    withButtons:true
});
treeComp2.render($('#treeMulti'));

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

AsideInstance.render($('#aside'));
IframeInstance.render($('#content'));
HeaderInstance.render($('#header'));

HTTP.flush();


// window.setTimeout(function () {
//     socket.close()
// }, 1000)

// socket.close()

