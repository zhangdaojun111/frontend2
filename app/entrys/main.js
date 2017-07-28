
import '../assets/scss/main.scss';

import 'jquery-ui/ui/widgets/button.js';
import 'jquery-ui/ui/widgets/dialog.js';

import Login from '../components/login/login';
import {HTTP} from '../lib/http';

$('#login').button({
    label: '点击登录'
}).on('click', function() {
    Login.show();
});

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
}
wait();

$('#active').button().on('click', function() {

});

$('#silent').button().on('click', function() {

})

HTTP.get('user', {name: '123123'}).then(function() {
});

HTTP.post('dept', {did: 123123}).then(function() {
});

HTTP.post('dept2', {did: 123123}).then(function() {
});

HTTP.get('dept3', {did: 123123}).then(function() {
});

HTTP.flush();