import template from './edit.html';

let css =`
    
`;
export let config = {
    template:template,
    data: {
        css:css.replace(/(\n)/g, ''),
    },
    actions: {},
    afterRender() {
        //添加样式
        $(`<style>${this.data.css}</style>`).appendTo(this.el);
    },
};