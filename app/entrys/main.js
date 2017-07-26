
import '../assets/scss/main.scss';

import 'jquery-ui/ui/widgets/button.js';
import 'jquery-ui/ui/widgets/dialog.js';

import Login from '../components/login/login';
import http from '../lib/http';

$('#login').button({
    label: '点击登录'
}).on('click', function() {
    Login.show();
});

async function wait() {
    let data = await $.ajax({
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