/**
 * Created by birdyy on 2017/10/13.
 * 主题颜色
 */

import template from './theme.html';
import {Base} from '../base';
import './theme.scss';
import handlebars from 'handlebars';
import 'jquery-ui/ui/widgets/sortable.js';

//自定义theme_background 拼接背景颜色style="background:"
handlebars.registerHelper('theme_background', function(colors,options) {
    let bgs = `style="background:${colors}"`;
    return bgs;
});

let config = {
    template: template,
    data: {
        colors:['#BC80D7','#6FDCAC','#E46F72','#69E3D8','#E46F72','#8799DB','#80E9D1','#9A87E2','#7DC878','#F19181','#A6D776','#80DFA3',
                '#D8E476','#F0A576','#8DD97B','#79CDA4','#B7A4F5','#F0C78B','#E07FE0','#EC6FAA','#7FC7E8','#E1B87B','#CDE07B','#75BEFD'],
    },
    actions: {},
    binds: [],
    afterRender(){
        //设置初始值
        this.data.value = this.data.colors;

        //保存拖拽排序
        this.el.find('.form-theme').sortable({
            revert:true,
            update: ()=> {
                let themes = this.el.find('.form-theme').sortable( "toArray");
                this.data.value = themes;
            }
        })
        
    }
};

class Theme extends Base {
    constructor(data, event,extendConfig){
        super($.extend(true,{},config,extendConfig), data, event)
    }


    /**
     * 设置value
     * @param value
     */
    setValue(value){
        if (Array.isArray(value)&&value!==''&&value!==undefined) {
            this.data.colors = value;
            this.el.find('.form-theme').empty();
            this.data.colors.forEach((val,index)=>{
                this.el.find('.form-theme').append('<span id="'+val+'"><b style="background:'+val+'"></b></span>');
            });
            this.data.value = this.data.colors;
        }
        this.data.firstDo = true;
    }
}

export {Theme}