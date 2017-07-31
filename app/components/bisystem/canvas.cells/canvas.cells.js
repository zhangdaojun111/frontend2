import {BiBaseComponent} from '../bi.base.component';
import {CanvasCellTableComponent} from './cell/table/cell.table';

import template from './canvas.cells.html';
import './canvas.cells.scss';

let CanvasConfig = {
    template: template,
    actions: {
        loadComponent() {
           let cell = new CanvasCellTableComponent();
           cell.render($('.cell-chart'));
        }
    },
    afterRender() {
        this.actions.loadComponent()
    }
};

class CanvasCellComponent extends BiBaseComponent{
    constructor() {
        super(CanvasConfig)
    }
}

export default CanvasCellComponent;