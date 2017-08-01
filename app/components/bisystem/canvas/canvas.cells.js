import {BiBaseComponent} from '../bi.base.component';
import {CanvasCellComponent} from './cell/canvas.cell';

import template from './canvas.cells.html';
import './canvas.cells.scss';

let config = {
    template: template,
    data: {
        title: 'hello world',
        cells:[
            {
                'width':550,
                'height':533,
                'left':50,
                'top':50
            },
            {
                'width':550,
                'height':533,
                'left':50,
                'top':550
            },
            {
                'width':550,
                'height':500,
                'left':50,
                'top':1050
            },
            {
                'width':550,
                'height':533,
                'left':50,
                'top':1550
            },
            {
                'width':550,
                'height':533,
                'left':50,
                'top':2050
            }
        ]
    },
    actions: {
        loadCells() {
            this.data.cells.forEach(val => {
                let cell = new CanvasCellComponent('table', val);
                this.append(cell, this.el.find('.canvas-cells-container'));
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