/**
 * Created by birdyy on 2017/10/10.
 * 字段数据范围展示
 */
import template from './range.html';
import Component from '../../../../../../../../lib/component';
import './range.scss';
import {canvasCellService} from '../../../../../../../../services/bisystem/canvas.cell.service';

let config = {
    template: template,
    data: {},
    actions: {
        /**
         * 根据type==3/5/12/30 判断可选范围
         */
        rangeChoose(type){
            switch (type){
                case '3':
                    this.el.find('input').prop('disabled',false);
                    break;
                case '5':
                    this.el.find('input').prop('disabled',false);
                    break;
                case '12':
                    this.el.find('.week b').addClass('option-disabled');
                    this.el.find('.month b').addClass('option-disabled');
                    this.el.find('.half-year b').addClass('option-disabled');
                    this.el.find('.week input').prop('disabled',true);
                    this.el.find('.month input').prop('disabled',true);
                    this.el.find('.half-year input').prop('disabled',true);
                    break;
                case '30':
                    this.el.find('.week b').addClass('option-disabled');
                    this.el.find('.week input').prop('disabled',true);
                    break;
            }

        },
        /**
         *设置时间范围
         */
        setDateValue(names){
            const dateStart = _.first(names);
            const dateEnd = _.last(names);
            this.el.find('.date-start').val(dateStart);
            this.el.find('.date-end').val(dateEnd);
        }
    },
    binds:[
        {   //选中状态
            event:'change',
            selector:'.normal-date-options input',
            callback:function (context,event) {
                if(!$(context).parent().next().is('.option-disabled')){
                    $(context).parents('label').addClass('option-active');
                    $(context).parents('label').siblings().removeClass('option-active');
                }
            }
        }
    ],
    afterRender() {},
    firstAfterRender() {
        //默认选中全部
        this.el.find('.normal-date-options .all-year input').prop('checked', true);
    },
    beforeDestory() {}
};

export class NormalRangeComponent extends Component {
    constructor(data,event) {
        super(config,data,event)
    }
}
