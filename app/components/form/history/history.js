/**
 *@author yudeping
 *历史值
 */

import template from './history.html';
let css = `.history td{
                  line-height: 1.42857143;
                  padding: 8px;
                  vertical-align: middle;
                  border: 1px solid #F2F2F2;
                  white-space: nowrap;
                  width: auto;
            }
            .table-history{
                    display: table;
                    border: 1px solid #E4E4E4;
                    min-width: 780px;
                    width: auto;
                    margin: 10px;
                    text-align: left;
                    margin-bottom: 50px;
            }
            .history-title{
                font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑'; 
                font-weight: 700;
            }
            table{
                position: relative;
                margin: 0 auto;
                width: 99%;
                max-width: 100%;
                margin: 5px 3px 5px 4px;             
            }
            table tr:nth-child(odd){
                background: #FFFFFF;
            }
            table tr:nth-child(even){
                background: #FAFAFA;
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