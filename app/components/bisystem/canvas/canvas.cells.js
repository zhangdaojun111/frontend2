import {BiBaseComponent} from '../bi.base.component';
import {CanvasCellComponent} from './cell/canvas.cell';

import template from './canvas.cells.html';
import './canvas.cells.scss';

let config = {
    template: template,
    data: {
        cells:[
            {
                'name': '王亮是sb1',
                'assortment': 'normal',
                'layout': {
                    'width':550,
                    'height':533,
                    'left':50,
                    'top':50,
                }
            },
            {
                'name': '王亮是sb2',
                'assortment': 'table',
                'layout': {
                    'width':550,
                    'height':533,
                    'left':650,
                    'top':50,
                }

            },
            {
                'name': '王亮是sb3',
                'assortment': 'multilist',
                'layout': {
                    'width':550,
                    'height':533,
                    'left':1250,
                    'top':50,
                }
            },
            {
                'name': '王亮是sb4',
                'assortment': 'radar',
                'layout': {
                    'width':550,
                    'height':533,
                    'left':50,
                    'top':620,
                }
            },
            {
                'name': '王亮是sb5',
                'assortment': 'nineGrid',
                'layout': {
                    'width':550,
                    'height':533,
                    'left':650,
                    'top':620
                }
            },
            {
                'name': '王亮是sb6',
                'assortment': 'funnel',
                'layout': {
                    'width':550,
                    'height':533,
                    'left':1250,
                    'top':620
                }
            },
            {
                'name': '王亮是sb7',
                'assortment': 'comment',
                'layout': {
                    'width':550,
                    'height':533,
                    'left':50,
                    'top':1190
                }

            },
            {
                'name': '王亮是sb8',
                'assortment': 'pie',
                'layout': {
                    'width':550,
                    'height':533,
                    'left':650,
                    'top':1190
                }

            }
        ]
    },
    actions: {
        loadCells() {
            this.data.cells.forEach((val, index) => {
                let cell = {
                    val:val,
                    cellIndex: index
                }
                let cellComponent = new CanvasCellComponent(cell);
                this.append(cellComponent, this.el.find('.canvas-cells-container'));
            })
        }
    },

    /**
     * 初始化加载cell(仅加载一次)
     */
    firstAfterRender() {
        this.actions.loadCells()
    }
};

export class CanvasCellsComponent extends BiBaseComponent{
    constructor() {
        super(config);
    }
}