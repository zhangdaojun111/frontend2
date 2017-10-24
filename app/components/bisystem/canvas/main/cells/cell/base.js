/**
 * Created by birdyy on 2017/9/12.
 * cell基类组件 (comment funnel multi.chart nine.grid normal original.data pie radar table) 父类组件
 */

import Component from '../../../../../../lib/component';
import {CanvasOriginalDataComponent} from './original.data/original.data';

export class CellBaseComponent extends Component {
    constructor(config,data,event,extendConfig) {
        super($.extend(true,{},config,extendConfig),data,event)
    }

    /**
     *显示原始数据
     * @param data = 原始数据数据,container = 原始数据放置容器
     */
    showCellDataSource(data = null,container) {
        let me = this;
        let dataSource = new CanvasOriginalDataComponent(data, {

            onUpdateOriginal: (data) => {
                this.updateOriginal(data)
            },

            onUpdateDeepOriginal: async function(name){
                let res = await me.updateOriginalDeep(name);
                this.actions.updateOriginal(res);
            },

            onDeepSort: async function(sort) {
               let res = await me.deepSort(sort);
               this.actions.updateOriginal(res);
            }
        });
        this.append(dataSource,container);
    }

    /**
     * 当原始数据改变时，更新画布块数据
     * @data 需要更新的数据
     */
    updateOriginal(data) {}

    /**
     * 当原始数据下穿动作
     * @name 下穿x轴字段名称
     */
    updateOriginalDeep(name) {}

    /**
     * 当原始数据下穿排序
     * @param sort = {type: 'asc', filed:y轴字段对象}
     */
    deepSort(sort) {}
}