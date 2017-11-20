import Component from '../../../../lib/component';
import {Text} from '../form/text/text';
import {Select} from '../form/select/select';
import {AutoComplete} from '../form/autocomplete/autocomplete';
import {Radio} from '../form/radio/radio';
import {Checkbox} from '../form/checkbox/checkbox';
import {Choosed} from '../form/choosed/choosed';
import {Button} from '../form/button/button';
import {Theme} from '../form/theme/theme';
import {TableSingle} from '../form/single/single';
import {Deep} from '../form/deep/deep';
import {YaXis} from '../form/linebar.yAxis/yAxis';
import msgbox from "../../../../lib/msgbox";
import {ChartFormService} from '../../../../services/bisystem/chart.form.service';
import {canvasCellService} from "../../../../services/bisystem/canvas.cell.service"
import Mediator from '../../../../lib/mediator';
import {router} from '../../bi.manage.router';
import {AdvancedCompute} from '../form/advanced.compute/advanced.compute';
import {Textarea} from '../form/textarea/textarea';
import {Search} from '../form/advanced.search/search';

let formItemTypes = {
    'text': Text,
    'select': Select,
    'autocomplete': AutoComplete,
    'radio': Radio,
    'checkbox': Checkbox,
    'choosed':Choosed,
    'button': Button,
    'theme': Theme,
    'table_single': TableSingle,
    'deep': Deep,
    'yAxis': YaXis,
    'advancedCompute': AdvancedCompute,
    'textarea': Textarea,
    'search': Search
};

class Base extends Component {
    constructor(config, data, event,extendConfig){
        super($.extend(true,{},config,extendConfig), data, event);
    }
    drawForm(container){
        let options = this.data.options;
        this.formItems = {};
        options.forEach((item) => {
            let clazz = formItemTypes[item.type];
            let instance = new clazz({
                value: item.defaultValue,
                label: item.label,
                name: item.name,
                list: item.list,
                class: item.class,
                rules: item.rules,
                placeholder: item.placeholder,
                required: item.required,
                category: item.category, // 用于input输入框类型 number text
                textTip: item.textTip,
            }, item.events);
            this.append(instance, this.el.find(container ? container : '.form-group'));
            this.formItems[item.name] = instance;
        });
    }
    /**
     * 获取所有字段数据
     */
    getData(){
        let chart = {};
        if (this.formItems) {
            Object.keys(this.formItems).map(name =>{
                chart[name] = this.formItems[name].getValue();
            })
        }
        return chart;
    }

    /**
     * 传送图表数据
     */
    async save(chart){
        let res = await ChartFormService.saveChart(JSON.stringify(chart));
        this.el.find('.save-btn').each((index,val)=>{
            if(index===0){
                $(val).prop('disabled',true);
            }
        });
        if (res['success'] == 1) {
            //清除缓存
            canvasCellService.refreshCache();
            msgbox.showTips('保存成功');
            setTimeout( ()=> {
                this.el.find('.save-btn').each((index,val)=>{
                    if(index===0){
                        $(val).prop('disabled',false);
                    }
                });
            },5000);
            if (!chart['chartName']['id']) {
                this.reload();
            } else {
                let isBackCanvas = location.hash.indexOf('viewId=');
                if (isBackCanvas !== -1) {
                    let viewId = location.hash.slice(isBackCanvas+7);
                    router.navigate(`/canvas/${viewId}`,{trigger: true, replace: true});
                }
            }
            Mediator.publish('bi:aside:update',{type: chart['chartName']['id'] ? 'update' :'new', data:res['data']})
        } else {
            msgbox.showTips(res['error'])
        }
    }

    reset(chart) {
        this.data.chart_id = chart.id ? chart.id : null;
        this.data.id = chart.id ? chart.id : null;
        this.data.chart = null;
    }
}
export {Base}