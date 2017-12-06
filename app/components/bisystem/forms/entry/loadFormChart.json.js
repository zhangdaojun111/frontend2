/**
 * Created by birdyy on 2017/8/14.
 * 入口配置文件，form图表组件都从这进入
 */
import {LineBarEditor as FormNormalComponent} from '../editors/normal/linebar';
import {TableEditor as FormTableComponent} from '../editors/table/table';
import {RadarEditor as FormRadarComponent} from '../editors/radar/radar';
import {MultiEditor as FormMultiComponent} from '../editors/multi/multi';
import {NineGridEditor as FormNineGridComponent} from '../editors/nine.grid/nine.grid';
// import {FormFunnelComponent} from '../charts.types/funnel/funnel';
import {CommentEditor as FormCommentComponent} from '../editors/comment/comment';
import {PieEditor as FormPieComponent} from '../editors/pie/pie';
import {StylizeEditor as FormStylizeComponent} from '../editors/stylzie/stylize';
import {MapEditor as FormMapComponent} from '../editors/map/map'
import {GaugeEditor as FormGaugeComponent} from '../editors/gauge/gauge';
import {ApprovalEditor as FormApprovalComponent} from '../editors/approval/approval';
import {CalendarEditor as FormCalendarComponent} from '../editors/calendar/calendar';


export let componentsJson = {
    'normal': {
        'entry': 'normal',
        'name': '折线柱状图',
        'icon':'chart-barline-icon',
        'component': FormNormalComponent
    },
    'table': {
        'entry': 'table',
        'name': '表格图',
        'icon':'chart-table-icon',
        'component': FormTableComponent
    },
    'radar': {
        'entry': 'radar',
        'name': '雷达图',
        'icon':'chart-radar-icon',
        'component': FormRadarComponent
    },
    'multilist': {
        'entry': 'multilist',
        'name': '多表图',
        'icon':'chart-multip-icon',
        'component': FormMultiComponent
    },
    'nineGrid': {
        'entry': 'nineGrid',
        'name': '九宫图',
        'icon':'chart-ninegrid-icon',
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
        'icon':'chart-comment-icon',
        'component': FormCommentComponent
    },
    'pie': {
        'entry': 'pie',
        'name': '饼图',
        'icon':'chart-pie-icon',
        'component': FormPieComponent
    },
    'stylzie': {
        'entry': 'stylzie',
        'name': '风格箱',
        'icon':'chart-stylize-icon',
        'component': FormStylizeComponent
    },
    'map': {
        'entry': 'map',
        'name': '地图',
        'icon':'chart-map-icon',
        'component': FormMapComponent
    },
    'gauge': {
        'entry': 'gauge',
        'name': '仪表盘',
        'icon':'chart-gauge-icon',
        'component': FormGaugeComponent
    },
    'approval': {
        'entry': 'approval',
        'name': '审批',
        'icon':'chart-approval-icon',
        'component': FormApprovalComponent
    },
    'calendar': {
        'entry': 'calendar',
        'name': '日程',
        'icon':'chart-calendar-icon',
        'component': FormCalendarComponent
    }
};
