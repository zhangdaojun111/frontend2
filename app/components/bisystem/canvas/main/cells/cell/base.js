/**
 * Created by birdyy on 2017/9/12.
 * cell基类组件 (comment funnel multi.chart nine.grid normal original.data pie radar table) 父类组件
 */

import Component from '../../../../../../lib/component';
import {CanvasOriginalDataComponent} from './original.data/original.data';

export class CellBaseComponent extends Component {
    constructor(config,data, event) {
        super(config,data,event)
    }

    /**
     *显示原始数据
     * @param data = 原始数据数据,container = 原始数据放置容器
     */
    showCellDataSource(data = null,container) {
        let dataSource = new CanvasOriginalDataComponent(data, {
            onUpdateOriginal: (data) => {
                this.UpdateOriginal(data)
            }
        });
        this.append(dataSource,container);
    }

    /**
     * 当原始数据改变时，更新画布块数据
     * @data 需要更新的数据
     */
    UpdateOriginal(data) {}
}