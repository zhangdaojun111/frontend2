import Component from '../../lib/component';
import template from './workflow.html';
import './workflow.scss';

let config = {
    template: template,
    data: {
        title:'this is workflow'
    },
    actions: {
        
    },
    afterRender: function() {
        this.el.on('click', '.dialog', () => {
           
        });
    },
    beforeDestory: function(){

    }
}

class WorkFlow extends Component {
    constructor(res,el){
        super(config);
        this.el=document.getElementById('workflow');
        console.log(el);
        this.nodesData=res.data[0].node;
        this.nodesWidth = res["data"][0]["node_width"];
        this.frontendid2eventname = res["data"][0]["frontendid2eventname"];
        this.hasAttachmentNodeList = res["data"][0]["node_attachments"];
        this.requiredfieldsNodeList = res["data"][0]["frontendid2requiredfields"];


        this.nodeflowSize = 1;
        this.containerwidth = '100%';
        this.containerheight = '100px';
        this.nodesWidth='60px';
        this.init();
    }

    init(){
        this.jsPlumbInstance = jsPlumb.getInstance({
            // default drag options
            DragOptions: { cursor: 'pointer', zIndex: 2000 },
            // default to blue at one end and #61b7cf at the other
            EndpointStyles: [{ fill: 'transparent' }, { fill: 'transparent' }],
            // blue endpoints 7 px; #61b7cf endpoints 11.
            Endpoints: [["Dot", { radius: 4 }], ["Dot", { radius: 4 }]],
            // the overlays to decorate each connection with.  note that the label overlay uses a function to generate the label text; in this
            // case it returns the 'labelText' member that we set on each connection in the 'init' method below.
            // ConnectionOverlays: [
            //     ["Arrow", { location: 0.9}],
            //     ["Label", {
            //         location: 0.1,
            //         id: "label",
            //         cssClass: "aLabel"
            //     }]
            // ],
            // Container: "container",
            Container: $('#workflow-draw-box'),
            ConnectionsDetachable: false //Connections是否可通过鼠标分离
        });
    }

    drawWorkFlow(){
        let __this=this;
        
        //画block
        $.each(this.nodesData, function (key, value) {
            if (value.hasOwnProperty("positionleft") && value.hasOwnProperty("positiontop") && value.hasOwnProperty("startPoint") && value.hasOwnProperty("endPoint")) {
                    let id = value["id"];
                    let text = value["text"];
                    let left = value["positionleft"];
                    let top = value["positiontop"];
                    let startPoint = value["startPoint"].split(",");
                    let endPoint = value["endPoint"].split(",");
                    let state = value["state"] || 0;
                    let is_add_handler = value["is_add_handler"] || 0;
                    let add_handler_info = value["add_handler_info"] || [];
                    let handlerType = "Handler_Type";
                    //具有handler_type属性的审批中或已审批的节点，需要title里面添加handler_type类型
                    if (value["handler_type"] && state != 0) {
                        handlerType = "Handler_Type_" + value["handler_type"];
                    }
                    //handler_type属性为3，4的未审批的节点，需要显示部门负责人或者部门直辖
                    if (value["handler_type"] && state == 0 && value["handler_type"] == 3) {
                        text = text + '部门负责人';
                    }
                    let style = "STATE_STYLE_" + state;
                    let can_reject = value["can_reject"];
                    let theBestTop = __this.getTheBestTop();
                    let theBestLeft = __this.getTheBestLeft() - 150;
                    let isMaodian = id.indexOf("maodian") != -1;
                    let styleClass = "";
                    let css = {};
                    let attachment = "";
                    let myTitle = '';
                    if (isMaodian) {
                        styleClass += " draged-item draged-maodian";
                        css = {
                            top: top - theBestTop,
                            left: left - theBestLeft,
                            position: 'absolute',
                            width: '20px',
                            height: '20px',
                            background: 'tranparent',
                            border: '1px solid rgb(225,225,225)',
                            borderRadius: '50%',
                            textAlign: 'center',
                            cursor: 'pointer'
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
                            position: 'absolute',
                            width: __this.nodesWidth,
                            height: '30px',
                            textAlign: 'center',
                            // paddingLeft:'24px',
                            // lineHeight:'26px',
                            lineHeight: '30px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            cursor: 'pointer',
                            border: '1px solid rgb(225,225,225)',
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
                    __this.AddEndpoints(id, startPoint, endPoint);
            }
        });

        //连线
        $.each(this.nodesData, function (key, value) {
                var source2target = value["source2target"];
                if (source2target != undefined) {
                    $.each(source2target, function (key, value) {
                        __this.jsPlumbInstance.connect({ uuids: value, editable: false });
                    });
                }
            });



        this.containerheight = __this.getTheBestBottom() - __this.getTheBestTop() + 100 + 'px';
        this.containerwidth = __this.getTheBestRight() - __this.getTheBestLeft() + 250 + 'px';
    }

    AddEndpoints(toId, sourceAnchors, targetAnchors) {
        var connectorPaintStyle = {
            "stroke-width": 10,
            stroke: "#ddd",
            joinstyle: "round"
        }, 
        // .. and this is the hover style.
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
            allSourceEndpoints.push(this.jsPlumbInstance.addEndpoint(toId, sourceEndpoint, { anchor: sourceAnchors[i], uuid: sourceUUID }));
        }
        for (var j = 0; j < targetAnchors.length; j++) {
            var targetUUID = toId + targetAnchors[j];
            allTargetEndpoints.push(this.jsPlumbInstance.addEndpoint(toId, targetEndpoint, { anchor: targetAnchors[j], uuid: targetUUID }));
        }
    }
    //放大工作流节点
    zoomInNodeflow($event) {
        console.log(1);
        let container = document.querySelector('#workflow-draw-box');
        this.nodeflowSize += 0.1;
        container.style.width = (+this.containerwidth.split('px')[0]) * (+this.nodeflowSize) + 'px';
        container.style.height = ((+this.containerheight.split('px')[0]) * (+this.nodeflowSize)) + 'px';
        container.style.transformOrigin = '0 0';
        container.style.transform = 'scale(' + this.nodeflowSize + ')';
    }
    //缩小工作流节点
    zoomOutNodeflow($event) {
        let container = document.querySelector('#workflow-draw-box');
        this.nodeflowSize -= 0.1;
        container.style.transformOrigin = '0 0';
        container.style.transform = 'scale(' + this.nodeflowSize + ')';
        container.style.width = (+this.containerwidth.split('px')[0]) * (+this.nodeflowSize) + 'px';
        container.style.height = ((+this.containerheight.split('px')[0]) * (+this.nodeflowSize)) + 'px';
    }

    //获取画布中最高节点的y坐标
    getTheBestTop() {
        let theBestTop = 999999999;
        for (let key in this.nodesData) {
            let dict = this.nodesData[key];
            if (dict["positiontop"] && (dict["positiontop"] < theBestTop)) {
                theBestTop = dict["positiontop"];
            }
        }
        return theBestTop;
    }
    //获取画布中最低节点的y坐标
    getTheBestBottom() {
        let theBestbottom = 0;
        for (let key in this.nodesData) {
            let dict = this.nodesData[key];
            if (dict["positiontop"] && (dict["positiontop"] > theBestbottom)) {
                theBestbottom = dict["positiontop"];
            }
        }
        return theBestbottom;
    }
    //获取画布中最左侧节点的x坐标
    getTheBestLeft() {
        let theBestLeft = 999999999;
        for (let key in this.nodesData) {
            let dict = this.nodesData[key];
            if (dict["positionleft"] && (dict["positionleft"] < theBestLeft)) {
                theBestLeft = dict["positionleft"];
            }
        }
        return theBestLeft;
    }
    //获取画布中最右侧节点的x坐标
    getTheBestRight() {
        let theBestRight = 0;
        for (let key in this.nodesData) {
            let dict = this.nodesData[key];
            if (dict["positionleft"] && (dict["positionleft"] > theBestRight)) {
                theBestRight = dict["positionleft"];
            }
        }
        return theBestRight;
    }
}

export default WorkFlow;