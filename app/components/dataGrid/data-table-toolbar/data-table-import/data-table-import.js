import template from './data-table-import.html';
let css = `
`
let importSetting = {
    template: template,
    data: {
    },
    actions: {
    },
    afterRender: function () {
        console.log( "导入数据--" )
        console.log( "导入数据--" )
    },
    beforeDestory: function () {

    }
};
export default importSetting;
