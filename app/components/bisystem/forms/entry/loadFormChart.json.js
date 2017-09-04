/**
 * Created by birdyy on 2017/8/14.
 * 入口配置文件，form图表组件都从这进入
 */
import {FormNormalComponent} from '../charts.types/normal/normal';
import {TableEditor as FormTableComponent} from '../../test/editors/table/table';
import {RadarEditor as FormRadarComponent} from '../../test/editors/radar/radar';
import {FormMultiComponent} from '../charts.types/multi/multi';
import {NineGridEditor as FormNineGridComponent} from '../../test/editors/nine.grid/nine.grid';
import {FormFunnelComponent} from '../charts.types/funnel/funnel';
import {CommentEditor as FormCommentComponent} from '../../test/editors/comment/comment';
import {PieEditor as FormPieComponent} from '../../test/editors/pie/pie';

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
    'multilist': {
        'entry': 'multilist',
        'name': '多表图',
        'component': FormMultiComponent
    },
    'nineGrid': {
        'entry': 'nineGrid',
        'name': '九宫图',
        'component': FormNineGridComponent
    },
    // 'funnel': {
    //     'entry': 'funnel',
    //     'name': '漏斗图',
    //     'component': FormFunnelComponent
    // },
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
