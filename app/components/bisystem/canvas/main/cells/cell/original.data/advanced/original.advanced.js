/**
 * Created by birdyy on 2017/9/18.
 * 数据源高级计算
 */
import Component from '../../../../../../../../lib/component';
import template from './original.advanced.html';
import handlebars from 'handlebars';
import msgbox from '../../../../../../../../lib/msgbox';

let config = {
    template: template,
    actions: {
    },
    data: {

    },
    binds:[
        {  //保存
            event:'click',
            selector:'.submit-area submit',
            callback:function () {

            }
        },
        { //返回
            event:'click',
            selector:'.submit-area button:last-child',
            callback:function () {

            }
        },
        { //附加字段命名
            event:'input',
            selector:'input[type=text]',
            callback:function (context) {
                let val = $(context).val();
                if(val.length>=2){
                    $(context).siblings('p').html('');
                }else{
                    $(context).siblings('p').html('必须输入附加字段命名(至少2个)');
                }
            }
        },
        { //字段模块
            event:'change',
            selector:'select',
            callback:function (context) {
               if(context.value !== ''){
                   $(context).siblings('p').html('');
               }else{
                   $(context).siblings('p').html('必须输入附加字段模板');
               }
            }
        },
    ],
    afterRender() {
    },
    firstAfterRender() {},
    beforeDestory() {}
};

export class CanvasOriginalAdvancedComponent extends Component {
    constructor(data,events) {
        super(config,data,events);
    }
}