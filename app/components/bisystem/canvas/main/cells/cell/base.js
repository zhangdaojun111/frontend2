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

    /**
     *自定义设置精度
     */
    customAccuracy(cellChart){
        if(cellChart.customAccuracy) {
            if(cellChart.assortment == "multilist"){
                cellChart.data.multillist.forEach((val,index)=>{
                    val.yAxis[0]['data'].forEach((val_y,index)=>{
                        val.yAxis[0]['data'][index] = parseFloat(val_y).toFixed(parseInt(cellChart.customAccuracy));
                    });
                })
            } else if(cellChart.assortment == "radar") {
                cellChart.data.rows.forEach((parentVal, index) => {
                    parentVal.forEach((val, index) => {
                        parentVal[index] = val.toFixed(parseInt(cellChart.customAccuracy));
                    })
                })
            } else {
                cellChart.data.yAxis.forEach((parentVal, index) => {
                    parentVal['data'].forEach((val, index) => {
                        parentVal['data'][index] = parseFloat(val).toFixed(parseInt(cellChart.customAccuracy));
                    })
                })
            }
        }
    }

    /**
     * 当message服务有推送时更新
     * @param data = 后台返回的chart data
     */
    updateCellDataFromMessage(res) {
        if (res['success'] === 1) {
            if (res['data'].assortment === 'table') {
                if (res['data']['single'] === 1) {
                    this.data.rows = this.actions.singleTable(res['data']);
                } else {
                    this.data.chart = res['data'];
                }
                this.reload();
            } else if (
                res['data'].assortment === 'normal' ||
                res['data'].assortment === 'pie' ||
                res['data'].assortment === 'radar' ||
                res['data'].assortment === 'multilist' ||
                res['data'].assortment === 'stylzie' ||
                res['data'].assortment === 'map'
            ) {
                this.data.chart = this.data.cellChart.chart = res['data'];
                this.actions.updateChart(res['data'].assortment === 'multilist' ? this.data.cellChart : {'chart':res['data']});
            } else if (res['data'].assortment === 'nineGrid') {
                this.data = this.actions.reassemble({'chart':res['data']});
                this.reload();
            }

        }
    }
}