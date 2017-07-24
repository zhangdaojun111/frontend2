
import '../assets/scss/main.scss';

import 'jquery-ui/ui/widgets/button.js';
import 'jquery-ui/ui/widgets/dialog.js';

import Login from '../components/login/login';

$('#login').button({
    label: '点击登录'
}).on('click', function() {
    Login.show();
});

$('#active').button().on('click', function() {

});

$('#silent').button().on('click', function() {

})