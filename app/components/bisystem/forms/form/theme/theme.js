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
        colors:['#4474F0','#E8BD55','#F28E1B','#FF0000','#A264E1','#00AE66',
            '#0061FF','#52FFFF','#EF46FF','#74B33D','#0042C6','#00C1B1', '#C10000']
    },
    actions: {
        createColor:function(){
            this.el.find('.form-theme').empty();
            this.data.colors.forEach((val,index)=>{
                this.el.find('.form-theme').append('<span id="'+val+'"><b style="background:'+val+'"></b><i class="minus-btn" id="'+val+'">-</i></span>');
        });
            this.data.value = this.data.colors;
        }
    },
    binds: [
        {
            event: 'click',
            selector: '.add-color',
            callback: function (context, event){
                this.el.find('.minus-btn').css({"display":'none'})
                this.el.find('.add-color-box').empty()
                this.el.find('.add-color-box').append("<input type='color' class='add-color-input'>")
                this.el.find('.add-color-box').append("<span class='save-color'>确定</span>")
            }
        },
        {
            event: 'click',
            selector: '.save-color',
            callback: function (context, event){
                let length = this.el.find('.add-color-input').length
                for (let i = 0; i< length ;i++) {
                    let col = this.el.find('.add-color-input').eq(i).val()
                    this.data.colors.push(col)
                }
                this.actions.createColor()
            }
        },
        {
            event: 'click',
            selector: '.minus-color',
            callback: function (context, event) {
                this.el.find('.minus-btn').css({"display":'block'})
                this.el.find('.add-color-box').empty()
                this.el.find('.add-color-box').append("<span class='minus-color-save'>确定</span>")
            }
        },
        {
            event: 'click',
            selector: '.minus-color-save',
            callback: function (context, event) {
                this.el.find('.minus-btn').css({"display":'none'})
            }
        },
        {
            event: 'click',
            selector: '.minus-btn',
            callback: function (context, event){
                console.log(event.target.id)
                this.data.colors.splice(this.data.colors.indexOf(event.target.id), 1)
                this.actions.createColor();
                this.el.find('.minus-btn').css({"display":'block'})
            }
        },
    ],
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
        if (Array.isArray(value)&&value!==''&&value!==undefined && value.length > 0) {
            this.data.colors = value;
            // this.el.find('.form-theme').empty();
            // this.data.colors.forEach((val,index)=>{
            //     this.el.find('.form-theme').append('<span id="'+val+'"><b style="background:'+val+'"></b></span>');
            // });
            this.data.value = this.data.colors;
            this.reload();
        }
    }
}

export {Theme}