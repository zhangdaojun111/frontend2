
import '../assets/scss/main.scss';

import 'jquery-ui/ui/widgets/button.js';
import 'jquery-ui/ui/widgets/dialog.js';

import Comment from '../components/comment/comment';

let myComment =  new Comment();
myComment.render($('#dialog'));

function getData() {
    return new Promise((resolve) => {
        setTimeout(()=>{
            resolve(true);
        }, 2000);
    });
};
$("input").button({
    label: 'xxxxx'
}).on('click', function() {
    myComment.clean();
});

$('#dialog').dialog({
    title: '评论'
})
async function wait() {
    await getData();
    console.log('hello world 123123');
}
wait();