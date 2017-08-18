/**
 *@author yudeping
 *历史值
 */

import template from './history.html';
let css = `.history td{
                  line-height: 1.42857143;
                  padding: 8px;
                  vertical-align: middle;
                  border: 1px solid rgb(240,240,240);
                  white-space: nowrap;
                  width: auto;
            }
    `;
let History = {
    template: template.replace(/\"/g, '\''),
    data: {
        css: css.replace(/(\n)/g, ''),
    },
    actions:{

    },
    firstAfterRender(){
        this.data.style = $("<style></style>").text(this.data.css).appendTo($("head"));
    },
}
export default History