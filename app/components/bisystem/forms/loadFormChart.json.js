/**
 * Created by birdyy on 2017/8/14.
 */
import {FormNormalComponent} from './normal/normal';
import {FormTableComponent} from './table/table';
import {FormRadarComponent} from './radar/radar';
import {FormMultiComponent} from './multi/multi';
import {FormNineGridComponent} from './nine.grid/nine.grid';
import {FormFunnelComponent} from './funnel/funnel';
import {FormCommentComponent} from './comment/comment';
import {FormPieComponent} from './pie/pie';

export let componentsJson = {
    'normal': {
        'entry': 'normal',
        'name': '折线柱状图',
        'component': FormNormalComponent
    },
    'table': {
        'entry': 'table',
        'name': '表格图',
        'component': FormTableComponent
    },
    'radar': {
        'entry': 'radar',
        'name': '雷达图',
        'component': FormRadarComponent
    },
    'multi': {
        'entry': 'multi',
        'name': '多表图',
        'component': FormMultiComponent
    },
    'ninegrid': {
        'entry': 'ninegrid',
        'name': '九宫图',
        'component': FormNineGridComponent
    },
    'funnel': {
        'entry': 'funnel',
        'name': '漏斗图',
        'component': FormFunnelComponent
    },
    'comment': {
        'entry': 'comment',
        'name': '注释图',
        'component': FormCommentComponent
    },
    'pie': {
        'entry': 'pie',
        'name': '饼图',
        'component': FormPieComponent
    }
}
