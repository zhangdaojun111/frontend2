import template from './history.html';
let css = ``;
css = css.replace(/(\n)/g, '')
let History = {
    template: template.replace(/\"/g, '\''),
    data: {
    },
    actions:{

    },
    firstAfterRender:function(){
        console.log(this.data);
    },
}
export default History