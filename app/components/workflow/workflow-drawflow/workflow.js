import Component from '../../../lib/component';
import template from './workflow.html';
import './workflow.scss';

let config = {
    template: template,
    data: {
        title:'this is workflow',
    },
    actions: {
        init(){
            //jsplumb initial config
            this.data.jsPlumbInstance = jsPlumb.getInstance({
                DragOptions: { cursor: 'pointer', zIndex: 2000 },
                EndpointStyles: [{ fill: 'transparent' }, { fill: 'transparent' }],
                Endpoints: [["Dot", { radius: 4 }], ["Dot", { radius: 4 }]],
                Container: $('#workflow-draw-box'),
                ConnectionsDetachable: false
            });
            this.actions.drawWorkFlow();
        },
        drawWorkFlow(){
            let __this=this;
            //draw block
            $.each(this.data.node, function (key, value) {
                if (value.hasOwnProperty("positionleft") && value.hasOwnProperty("positiontop") && value.hasOwnProperty("startPoint") && value.hasOwnProperty("endPoint")) {
                    value.startPoint=value.startPoint.split(",");
                    value.endPoint=value.endPoint.split(",");
                    value.state=value.state||0;
                    value.is_add_handler=value.is_add_handler||0;
                    value.add_handler_info=value.add_handler_info||[];
                    value.can_reject=value.can_reject;
                    let {id,text,positionleft:left,positiontop:top,startPoint,endPoint,state,is_add_handler,add_handler_info,can_reject}=value,
                        style = "STATE_STYLE_" + state,
                        theBestTop = __this.actions.getTheBestTop(),
                        theBestLeft = __this.actions.getTheBestLeft() - 150,
                        isMaodian = id.indexOf("maodian") != -1,
                        styleClass = "",
                        css = {},
                        attachment = "",
                        myTitle = '',
                        handlerType = "Handler_Type";
                    //具有handler_type属性的审批中或已审批的节点，需要title里面添加handler_type类型
                    if (value["handler_type"] && state != 0) {
                        handlerType = "Handler_Type_" + value["handler_type"];
                    }
                    //handler_type属性为3，4的未审批的节点，需要显示部门负责人或者部门直辖
                    if (value["handler_type"] && state == 0 && value["handler_type"] == 3) {
                        text = text + '部门负责人';
                    }
                    if (isMaodian) {
                        styleClass += " draged-item draged-maodian";
                        css = {
                            top: top - theBestTop,
                            left: left - theBestLeft,
                        };
                        if (value.hasOwnProperty("info")) {
                            //前置锚点
                            text = value["info"];
                            myTitle = text;
                            let arr = ["并行", "会签"];
                            if (arr.indexOf(text) == -1) {
                                text = "条";
                            }
                            else {
                                text = text.toString().charAt(0);
                            }
                        }
                        else {
                            //后置锚点
                            text = '';
                        }
                    }
                    else {
                        styleClass += " draged-item";
                        css = {
                            top: top - theBestTop,
                            left: left - theBestLeft,
                            width: __this.data.node_width+'px',
                        };
                        myTitle = __this[handlerType] + text;
                        if (value['handler_relation']) {
                            text = value['handler_relation'] == 0 ? '临时(会签)' : '临时(并行)';
                        }
                        if (value['multi_handlers']) {
                            myTitle = value['multi_handlers'];
                        }
                    }
                        //如果节点有附件
                        // if (__this.hasAttachmentNodeList.indexOf(id) != -1) {
                        //     attachment = '<span class="has-attachment-span">+</span>';
                        //     styleClass += ' has-attachment';
                        // }
                        // //判断流程节点图片
                        // if(value.id.indexOf('start') != -1){
                        //     __this[style]['backgroundImage']= 'url("' + __this.imgNodeStart + '")';
                        // }else if(value.id.indexOf('end') != -1){
                        //     __this[style]['backgroundImage']= 'url("' + __this.imgNodeEnd + '")';
                        // }else if(value.id.indexOf('maodian') != -1){
                        //     __this[style]['background']= 'transparent';
                        // }else if(value.state== 0){
                        //     __this[style]['backgroundImage']= 'url("' + __this.imgNode0 + '")';
                        // }else if(value.state== 1){
                        //     __this[style]['backgroundImage']= 'url("' + __this.imgNode1 + '")';
                        // }else if(value.state== 2){
                        //     __this[style]['backgroundImage']= 'url("' + __this.imgNode2 + '")';
                        // }
                        //赋值属性
                        // let event_name = __this.frontendid2eventname[id] || text;
                    let html = $("<div>").attr({
                            id: id,
                            class: styleClass,
                            startPoint: startPoint,
                            endPoint: endPoint,
                            title: myTitle,
                            state: state,
                            canreject: can_reject,
                            eventname: '',//event_name,
                            originaltitle: myTitle,
                            originaltext: attachment + text
                    }).css(css).html(attachment + text)//.css(__this[style]);
                        //如果有加签
                    if (is_add_handler == 1) {
                            // let addHandlerInfo = "";
                            // for (let dict of add_handler_info) {
                            //     addHandlerInfo += `${dict["add_handler_type"]}：${dict["add_handler_name"]}\n`;
                            // }
                            // let span = $("<span>")
                            //     .attr({ title: addHandlerInfo })
                            //     .css({
                            //     display: 'inline-block',
                            //     width: '10px',
                            //     height: '10px',
                            //     borderRadius: '50%',
                            //     border: '1px solid #ddd',
                            //     verticalAlign: 'middle',
                            //     margin: '0 5px',
                            //     background: 'rgb(14, 122, 239)'
                            // });
                            // $(html).prepend(span);
                    }
                        //如果是驳回任意节点模式
                    if (__this.rejectMode) {
                            // console.log( $("#container2") )
                            // $("#container2").append(html);
                        $(__this.el.nativeElement.querySelector('#container2')).append(html);
                    }
                    else {
                            // $("#container").append(html);
                        $('#workflow-draw-box').append(html);
                    }
                    __this.actions.AddEndpoints(id, startPoint, endPoint);
                }
            });

            //draw connecting lines
            $.each(this.data.node, function (key, value) {
                    var source2target = value["source2target"];
                    if (source2target != undefined) {
                        $.each(source2target, function (key, value) {
                            __this.data.jsPlumbInstance.connect({ uuids: value, editable: false });
                        });
                    }
                });

            this.containerheight = __this.actions.getTheBestBottom() - __this.actions.getTheBestTop() + 100 + 'px';
            this.containerwidth = __this.actions.getTheBestRight() - __this.actions.getTheBestLeft() + 250 + 'px';
        },

        //add mark points
        AddEndpoints(toId, sourceAnchors, targetAnchors) {
            var connectorPaintStyle = {
                "stroke-width": 10,
                stroke: "#ddd",
                joinstyle: "round"
            }, 
            connectorHoverStyle = {
                "stroke-width": 10,
                stroke: "#ddd"
            };
            var sourceEndpoint = {
                endpoint: "Dot",
                paintStyle: { fill: "transparent", radius: 4 },
                isSource: true,
                connector: ["Flowchart", { stub: 40 }],
                connectorStyle: connectorPaintStyle,
                hoverPaintStyle: connectorHoverStyle,
                connectorHoverStyle: connectorHoverStyle,
                maxConnections: 10
            };
            var targetEndpoint = {
                endpoint: "Rectangle",
                paintStyle: { fill: "transparent", width: 8, height: 8 },
                hoverPaintStyle: connectorHoverStyle,
                maxConnections: -1,
                dropOptions: { hoverClass: "hover", activeClass: "active" },
                isTarget: true,
                allowLoopback: true
            };
            var allSourceEndpoints = [], allTargetEndpoints = [];
            for (var i = 0; i < sourceAnchors.length; i++) {
                var sourceUUID = toId + sourceAnchors[i];
                allSourceEndpoints.push(this.data.jsPlumbInstance.addEndpoint(toId, sourceEndpoint, { anchor: sourceAnchors[i], uuid: sourceUUID }));
            }
            for (var j = 0; j < targetAnchors.length; j++) {
                var targetUUID = toId + targetAnchors[j];
                allTargetEndpoints.push(this.data.jsPlumbInstance.addEndpoint(toId, targetEndpoint, { anchor: targetAnchors[j], uuid: targetUUID }));
            }
        },
        //zoomIn paint
        zoomInNodeflow($event) {
            let container = this.el.find('#workflow-draw-box')[0];
            this.data.nodeflowSize += 0.1;
            container.style.width = (+this.data.containerwidth.split('px')[0]) * (+this.data.nodeflowSize) + 'px';
            container.style.height = ((+this.data.containerheight.split('px')[0]) * (+this.data.nodeflowSize)) + 'px';
            container.style.transformOrigin = '0 0';
            container.style.transform = 'scale(' + this.data.nodeflowSize + ')';
        },
        //zoomOut paint
        zoomOutNodeflow($event) {
            let container = this.el.find('#workflow-draw-box')[0];
            this.data.nodeflowSize -= 0.1;
            container.style.transformOrigin = '0 0';
            container.style.transform = 'scale(' + this.data.nodeflowSize + ')';
            container.style.width = (+this.data.containerwidth.split('px')[0]) * (+this.data.nodeflowSize) + 'px';
            container.style.height = ((+this.data.containerheight.split('px')[0]) * (+this.data.nodeflowSize)) + 'px';
        },
        //open paint in new window
        maximizeNodeflow($event) {
            let container = this.el.find('#workflow-draw-box')[0];
            container.style.transform = 'scale(1)';
            this.nodeflowSize = 1;
            let e = document.documentElement, g = document.getElementsByTagName('body')[0], w = window.innerWidth || e.clientWidth || g.clientWidth, h = window.innerHeight || e.clientHeight || g.clientHeight;
            container.style.position = "fixed";
            container.style.top = "0";
            container.style.left = "0";
            container.style.right = "0";
            container.style.bottom = "0";
            container.style.backgroundColor = "#fff";
            container.style.width = w + 'px';
            container.style.height = h + 'px';
            container.style.marginTop = 0;
            container.style.margin = 0;
            container.style.zIndex = '100';
            container.style.overflow = 'auto';
            let ocloseSpan = document.createElement('span');
            ocloseSpan.className = 'closeSpan';
            ocloseSpan.style['float'] = 'right';
            ocloseSpan.style.cursor = 'pointer';
            ocloseSpan.style.fontSize = '30px';
            ocloseSpan.style.border = '1px solid #ddd';
            ocloseSpan.innerHTML = '&nbsp;×&nbsp;';
            ocloseSpan.addEventListener('click', (event) => {
                container.style.height = this.data.containerheight;
                container.style.width = this.data.containerwidth;
                container.style.position = "relative";
                container.style.zIndex = '0';
                container.style.overflow = 'visible';
                ocloseSpan.style.display = 'none';
            });
            container.appendChild(ocloseSpan);
        },

        //获取画布中最高节点的y坐标
        getTheBestTop() {
            let theBestTop = 999999999;
            for (let key in this.data.node) {
                let dict = this.data.node[key];
                if (dict["positiontop"] && (dict["positiontop"] < theBestTop)) {
                    theBestTop = dict["positiontop"];
                }
            }
            return theBestTop;
        },
        //获取画布中最低节点的y坐标
        getTheBestBottom() {
            let theBestbottom = 0;
            for (let key in this.data.node) {
                let dict = this.data.node[key];
                if (dict["positiontop"] && (dict["positiontop"] > theBestbottom)) {
                    theBestbottom = dict["positiontop"];
                }
            }
            return theBestbottom;
        },
        //获取画布中最左侧节点的x坐标
        getTheBestLeft() {
            let theBestLeft = 999999999;
            for (let key in this.data.node) {
                let dict = this.data.node[key];
                if (dict["positionleft"] && (dict["positionleft"] < theBestLeft)) {
                    theBestLeft = dict["positionleft"];
                }
            }
            return theBestLeft;
        },
        //获取画布中最右侧节点的x坐标
        getTheBestRight() {
            let theBestRight = 0;
            for (let key in this.data.node) {
                let dict = this.data.node[key];
                if (dict["positionleft"] && (dict["positionleft"] > theBestRight)) {
                    theBestRight = dict["positionleft"];
                }
            }
            return theBestRight;
        }

    },
    afterRender: function() {
        this.actions.init();

        this.el.on('click', '#zoomIn', () => {
            this.actions.zoomInNodeflow();
        });
        this.el.on('click', '#zoomOut', () => {
            this.actions.zoomOutNodeflow();
        });
        this.el.on('click', '#newWin', () => {
            this.actions.maximizeNodeflow();
        });
        this.el.on('click', '#addFocus', () => {
            console.log(123);
        });
    },
    beforeDestory: function(){

    }
}

class WorkFlow extends Component {
    constructor(data){
        super(config, data);
    }
}

export default {
    show(data) {
        let workFlowData = _.defaultsDeep({}, data, {
            nodeflowSize: 1,
            containerwidth: '100%',
            containerheight: '100px',
            // nodesWidth: '60px'
        });
        let component = new WorkFlow(workFlowData);
        let el = $('#drowflow');
        component.render(el);
    }
};