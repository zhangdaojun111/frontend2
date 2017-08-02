import {BiBaseComponent} from '../bi.base.component';
import {CanvasCellComponent} from './cell/canvas.cell';

import template from './canvas.cells.html';
import './canvas.cells.scss';
import {canvasCellService} from '../../../services/bisystem/canvas.cell.service';
import {router} from '../bi.router';

let config = {
    template: template,
    data: {
        views: window.config.bi_views,
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
        /**
         * 渲染cells
         */
        loadCells() {
            this.data.cells.forEach((val, index) => {
                let cell = {
                    val:val,
                    cellIndex: index
                }
                let cellComponent = new CanvasCellComponent(cell);
                this.append(cellComponent, this.el.find('.cells'));
            })
        },
    },

    afterRender() {
        let self = this;
        // 匹配导航的视图id
        if (self.viewId) {
            for(let [index,view] of self.data.views.entries()) {
                if (view.id == self.viewId) {
                    $('.nav-tabs a').eq(index).addClass('active');
                }
            }
        } else {
            $('.nav-tabs a').eq(0).addClass('active');
        };

        // 切换视图
        // this.el.on('click', '.nav-tabs a', function() {
        //     $(this).addClass('active');
        //     $(this).siblings('a').removeClass('active');
        //     // let view = self.data.views[$(this).index()];
        //     // router.navigate('views/'+view.id,{trigger: true, replace: true});
        //     console.log(router)
        //     // return false;
        // });
    },

    /**
     * 初始化加载cell(仅加载一次)
     */
    firstAfterRender() {
        this.actions.loadCells();
    },


};

export class CanvasCellsComponent extends BiBaseComponent{
    constructor(id) {
        super(config);
        this.viewId = id;
    }
}