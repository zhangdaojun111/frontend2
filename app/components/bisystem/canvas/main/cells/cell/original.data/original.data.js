/**
 * Created by birdyy on 2017/8/30.
 * 数据源画布
 */
import Component from '../../../../../../../lib/component';
import template from './original.data.html';
import './original.data.scss';

let config = {
    template: template,
    actions: {
        /**
         *选中处理
         */
        checkedBox(self = this) {
            let allChecked = true;
            this.el.find('input[name="custom-checkbox"]:checkbox').each( function() {
                if(!$(this).is(':checked')){
                    allChecked = false;
                    return;
                }
            });
            if(allChecked){
                self.el.find('input[name="custom-checkbox-all"]:checkbox').prop("checked",true);
            }else{
                self.el.find('input[name="custom-checkbox-all"]:checkbox').prop("checked",false);
            }
        }

    },
    data: {
        showData:true,
    },
    binds:[
        {
            event:'click',
            selector:'.bi-origin-data-close',
            callback:function () {
                this.destroySelf();
            }
        },
        {
            event:'click',
            selector:'input[name="custom-checkbox"]:checkbox',
            callback:function () {
                this.actions.checkedBox()
            }
        },
        {
            event:'click',
            selector:'input[name="custom-checkbox-all"]:checkbox',
            callback:function (self = this) {
                if ($(self).is(':checked')){
                    this.el.find('input[name="custom-checkbox"]:checkbox').prop("checked",true);
                }else{
                    this.el.find('input[name="custom-checkbox"]:checkbox').prop("checked",false);
                }
            }
        },
    ],
    afterRender() {},
    firstAfterRender() {},
    beforeDestory() {}
};

export class CanvasOriginalDataComponent extends Component {
    constructor(data,events) {
        super(config,data,events)
    }
}
