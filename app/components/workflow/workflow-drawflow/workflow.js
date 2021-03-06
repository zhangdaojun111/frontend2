/**
 *@author qiumaoyun
 *画流程节点图
 */
import Component from '../../../lib/component';
import template from './workflow.html';
import './workflow.scss';
import '../../../assets/scss/workflow/workflow-base.scss';
import msgBox from '../../../lib/msgbox';
import Mediator from '../../../lib/mediator';
import {workflowService} from '../../../services/workflow/workflow.service';
import jsplumb from 'jsplumb';
import approvalOpinion from '../approval-opinion/approval-opinion'
import {PMAPI, PMENUM} from '../../../lib/postmsg';
import Attachment from '../../form/attachment-list/attachment-list';

let config = {
	template: template,
	data: {

		title: 'this is workflow',
		nodeflowSize: 1,
		containerwidth: '100%',
		containerheight: '100px',
	},
	actions: {
		init() {
			//jsplumb initial config
			// this.showLoading();
			this.data.jsPlumbInstance = jsPlumb.getInstance({
				DragOptions: {cursor: 'pointer', zIndex: 2000},
				EndpointStyles: [{fill: 'transparent'}, {fill: 'transparent'}],
				Endpoints: [["Dot", {radius: 4}], ["Dot", {radius: 4}]],
				Container: this.el.find('.workflow-draw-box'),
				ConnectionsDetachable: false,

			});
			this.actions.drawWorkFlow();
		},
		drawWorkFlow() {
			this.requiredfieldsNodeList = this.data["frontendid2requiredfields"];
			let __this = this;
			//draw block
			$.each(this.data.node, function (key, value) {
				if (value.hasOwnProperty("positionleft") && value.hasOwnProperty("positiontop") && value.hasOwnProperty("startPoint") && value.hasOwnProperty("endPoint")) {
					value.startPoint = value.startPoint.split(",");
					value.endPoint = value.endPoint.split(",");
					value.state = value.state || 0;
					value.is_add_handler = value.is_add_handler || 0;
					value.add_handler_info = value.add_handler_info || [];
					value.can_reject = value.can_reject;
					value.complex_node_id = value.complex_node_id || '';
					let {id, text, positionleft: left, positiontop: top, startPoint, endPoint, state, is_add_handler, add_handler_info, can_reject,complex_node_id} = value,
						style = "STATE_STYLE_" + state,
						theBestTop = __this.actions.getTheBestTop() - 10,
						theBestLeft = __this.actions.getTheBestLeft() - 10,
						isMaodian = id.indexOf("maodian") != -1,
						styleClass = "",
						css = {},
						attachment = "",
						myTitle = '',
						condition = '',
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
								condition = value["info"];
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
							width: __this.data.node_width + 'px',
						};
						if (__this[handlerType]) {
							myTitle = __this[handlerType] + text;
						} else {
							myTitle = text;
						}
						if (value['handler_relation']) {
							text = value['handler_relation'] == 0 ? '临时(会签)' : '临时(并行)';
						}
						if (value['multi_handlers']) {
							condition = value['multi_handlers'];
							myTitle = value['multi_handlers'];
						}
					}
					//如果节点有附件
					if (__this.data.node_attachments.indexOf(id) != -1) {
						attachment = '<span class="has-attachment-span">+</span>';
						styleClass += ' has-attachment';

					}
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
					let event_name = __this.data.frontendid2eventname[id] || text;
					let html = $("<div>").attr({
						id: id,
						class: styleClass,
						startPoint: startPoint,
						endPoint: endPoint,
						title: condition || text,
						state: state,
						canreject: can_reject,
                        complex_node_id: complex_node_id,
						eventname: event_name,//event_name,
						originaltitle: myTitle,
						originaltext: attachment + text
					}).css(css).html(attachment + text);//.css(__this[style]);
					//如果有加签
					if (is_add_handler == 1) {
						let addHandlerInfo = "";
						for (let dict of add_handler_info) {
							addHandlerInfo += `${dict["add_handler_type"]}：${dict["add_handler_name"]}\n`;
						}
						let span = $("<span>")
						.attr({title: addHandlerInfo})
						.css({
							display: 'inline-block',
							width: '10px',
							height: '10px',
							borderRadius: '50%',
							border: '1px solid #ddd',
							verticalAlign: 'middle',
							margin: '0 5px',
							background: 'rgb(14, 122, 239)'
						});
						$(html).prepend(span);
					}
					//如果是驳回任意节点模式
					if (__this.rejectMode) {
						// $("#container2").append(html);
						$(__this.el.nativeElement.querySelector('#container2')).append(html);
					}
					else {
						// $("#container").append(html);
						__this.el.find('.workflow-draw-box').append(html);
					}
					__this.actions.AddEndpoints(id, startPoint, endPoint);
				}
			});

			//draw connecting lines
			$.each(this.data.node, function (key, value) {
				let source2target = value["source2target"];
				if (source2target != undefined) {
					$.each(source2target, function (key, value) {
						__this.data.jsPlumbInstance.connect({uuids: value, editable: false});
					});
				}
			});
			//第一次进入时默认选中自己的节点
			let haveState1 = false;
			$.each(this.data.node, function (key, value) {
				let is_add_handler = value["is_add_handler"] || 0;
				let add_handler_info = value["add_handler_info"] || [];
				if (value['state'] == 1) {
					haveState1 = true;
					//判断当前节点是否包含登陆人
					if (value["text"].indexOf(window.config.name) != -1) {
						// for(let a of __this.requiredfieldsNodeList['frontendid2field'][value.id]){
						//     $('*[requiredField='+a+']').css({border:'1px solid transparent',boxShadow: 'rgba(14, 122, 239, .8) 0px 0px 1px 1px',transition: 'border-color .15s ease-in-out,box-shadow .15s ease-in-out'});
						// }
						if (__this.requiredfieldsNodeList['frontendid2fieldid'][value.id]) {
							for (let b of __this.requiredfieldsNodeList['frontendid2fieldid'][value.id]) {
								$('span[data-id=' + b + ']').css({color: 'rgb(14,122,239)'});
							}
						}

					}
				}
				else if (is_add_handler == 1) {
					haveState1 = true;
					let haveAddUser = false;
					//判断被加签人是否包含登陆人
					for (let dict of add_handler_info) {
						if (dict["add_handler_name"].indexOf(window.config.name) != -1) {
							haveAddUser = true;
							break;
						}
					}
					//判断当前加签节点（节点和被加签人）是否包含登陆人
					if (value["text"].indexOf(window.config.name) != -1 || haveAddUser == true) {
						if(__this.requiredfieldsNodeList['frontendid2field'][value.id]){
                            for (let a of __this.requiredfieldsNodeList['frontendid2field'][value.id]) {
                                $('*[requiredField=' + a + ']').css({
                                    border: '1px solid transparent',
                                    boxShadow: 'rgba(14, 122, 239, .8) 0px 0px 1px 1px',
                                    transition: 'border-color .15s ease-in-out,box-shadow .15s ease-in-out'
                                });
                            }
						}
						if(__this.requiredfieldsNodeList['frontendid2fieldid'][value.id]){
                            for (let b of __this.requiredfieldsNodeList['frontendid2fieldid'][value.id]) {
                                $('span[data-id=' + b + ']').css({color: 'rgb(14,122,239)'});
                            }
						}

					}
				}
			});
			if (haveState1 == false) {
				$.each(this.nodesData, function (key, value) {
					if (value.id.indexOf('start') != -1) {
						// for(let a of __this.requiredfieldsNodeList['frontendid2field'][value.id]){
						//     $('*[requiredField='+a+']').css({border:'1px solid transparent',boxShadow: 'rgba(14, 122, 239, .8) 0px 0px 1px 1px',transition: 'border-color .15s ease-in-out,box-shadow .15s ease-in-out'});
						// }
						for (let b of __this.requiredfieldsNodeList['frontendid2fieldid'][value.id]) {
							$('span[data-id=' + b + ']').css({color: 'rgb(14,122,239)'});
						}

					}
				});
			}
			// __this.actions.requiredFields();


			this.el.find('.workflow-draw-box').css({
				'height': __this.actions.getTheBestBottom() - __this.actions.getTheBestTop() + 100 + 'px',
				'width': __this.actions.getTheBestRight() - __this.actions.getTheBestLeft() + 250 + 'px',
				// 'border-top':'1px solid #e4e4e4'
			});
			this.el.find('.workflow-draw-box').addClass('draw-box-border');
			this.data.containerheight = __this.actions.getTheBestBottom() - __this.actions.getTheBestTop() + 100 + 'px';
			this.data.containerwidth = __this.actions.getTheBestRight() - __this.actions.getTheBestLeft() + 250 + 'px';
			// this.hideLoading();
		},

		//add mark points
		AddEndpoints(toId, sourceAnchors, targetAnchors) {
			let connectorPaintStyle = {
					"stroke-width": 10,
					stroke: "#ddd",
					joinstyle: "round"
				},
				connectorHoverStyle = {
					"stroke-width": 10,
					stroke: "#ddd"
				};
			let sourceEndpoint = {
				endpoint: "Dot",
				paintStyle: {fill: "transparent", radius: 4},
				isSource: true,
				connector: ["Flowchart", {stub: 40}],
				connectorStyle: connectorPaintStyle,
				hoverPaintStyle: connectorHoverStyle,
				connectorHoverStyle: connectorHoverStyle,
				maxConnections: 10
			};
			let targetEndpoint = {
				endpoint: "Rectangle",
				paintStyle: {fill: "transparent", width: 8, height: 8},
				hoverPaintStyle: connectorHoverStyle,
				maxConnections: -1,
				dropOptions: {hoverClass: "hover", activeClass: "active"},
				isTarget: true,
				allowLoopback: true
			};
			let allSourceEndpoints = [], allTargetEndpoints = [];
			for (let i = 0; i < sourceAnchors.length; i++) {
				let sourceUUID = toId + sourceAnchors[i];
				allSourceEndpoints.push(this.data.jsPlumbInstance.addEndpoint(toId, sourceEndpoint, {
					anchor: sourceAnchors[i],
					uuid: sourceUUID
				}));
			}
			for (let j = 0; j < targetAnchors.length; j++) {
				let targetUUID = toId + targetAnchors[j];
				allTargetEndpoints.push(this.data.jsPlumbInstance.addEndpoint(toId, targetEndpoint, {
					anchor: targetAnchors[j],
					uuid: targetUUID
				}));
			}
		},
		//驳回节点
		rejectNode(e) {
			// if (this.rejectMode) {
			let can_reject = e.getAttribute("canreject");
			let text = e.getAttribute("title");
			this.rejectId = e.getAttribute("id");
			//会签节点驳回
			if(e.getAttribute('originaltitle')=='会签'){
                this.rejectId = e.getAttribute('complex_node_id');
			}
			if (can_reject === '1') {
				// PMAPI.openDialogByComponent(approvalOpinion,{
				//     width: 450,
				//     height: 300,
				//     title: '提示'
				// }).then(res=>{
				//     if(res.determine){
				//         this.comment = res.comment;
				//         Mediator.publish('workflow:comment',res.comment);
				//         Mediator.publish('approval:rejToAny',this.rejectId);
				//     }
				// })

				PMAPI.openDialogByIframe(
					'/iframe/approvalOpinion/',
					{
						width: 540,
						height: 530,
						title: '提示'
					}
				).then(res => {
					if (res.determine) {
						// this.comment = res.comment;
						// Mediator.publish('workflow:comment',res.comment);
						// Mediator.publish('approval:rejToAny',this.rejectId);
						Mediator.publish('approvalRejToAny: data', {rejectId: this.rejectId, data: res});
					}
				})
			}
			// }
		},
		//工作流节点负责性字段变色
		requiredFields(e) {
			let items = this.el.find('.draged-item');
			items = Array.prototype.slice.call(items);
			items.forEach((thisDom) => {
				if (thisDom.className.match("draged-item")) {
					for (let key in this.requiredfieldsNodeList['frontendid2field']) {
						if (thisDom.id == key) {
							for (let a of this.requiredfieldsNodeList['frontendid2field'][key]) {
								$('*[requiredField=' + a + ']').css({
									border: '1px solid transparent',
									boxShadow: 'rgba(14, 122, 239, .8) 0px 0px 1px 1px',
									transition: 'border-color .15s ease-in-out,box-shadow .15s ease-in-out'
								});
							}
						}
					}
					for (let key in this.requiredfieldsNodeList['frontendid2fieldid']) {
						if (thisDom.id == key) {
							for (let b of this.requiredfieldsNodeList['frontendid2fieldid'][key]) {
								$('span[data-id=' + b + ']').css({color: 'rgb(14,122,239)'});
							}
						}
					}
				}
			}, this);
		},
		//zoomIn paint
		zoomInNodeflow($event) {
			let container = this.el.find('.workflow-draw-box')[0];
			this.data.nodeflowSize += 0.1;
			container.style.width = (+this.data.containerwidth.split('px')[0]) * (+this.data.nodeflowSize) + 'px';
			container.style.height = ((+this.data.containerheight.split('px')[0]) * (+this.data.nodeflowSize)) + 'px';
			container.style.transformOrigin = '0 0';
			container.style.transform = 'scale(' + this.data.nodeflowSize + ')';
		},
		//zoomOut paint
		zoomOutNodeflow($event) {
			let container = this.el.find('.workflow-draw-box')[0];
			this.data.nodeflowSize -= 0.1;
			container.style.transformOrigin = '0 0';
			container.style.transform = 'scale(' + this.data.nodeflowSize + ')';
			container.style.width = (+this.data.containerwidth.split('px')[0]) * (+this.data.nodeflowSize) + 'px';
			container.style.height = ((+this.data.containerheight.split('px')[0]) * (+this.data.nodeflowSize)) + 'px';
		},
		//open paint in new window
		maximizeNodeflow($event) {
			this.el.find('.closeSpan').remove();
			let container = this.el.find('.workflow-draw-box')[0];
			container.style.transform = 'scale(1)';
			this.nodeflowSize = 1;
			let e = document.documentElement, g = document.getElementsByTagName('body')[0],
				w = window.innerWidth || e.clientWidth || g.clientWidth,
				h = window.innerHeight || e.clientHeight || g.clientHeight;
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
			container.style.zIndex = '111';
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
		},
		//切换流程图
		togglePicture() {
			let that = this;
			if (this.data.pictureOption == '事务图') {
				this.data.pictureOption = '节点图';
				this.el.find(".togglePic-text").text('节点图');
				let arr = that.data.draged.reverse();
				this.el.find(".draged-item").each(function () {
					let $this = $(this);
					if (!$this.hasClass('draged-maodian')) {
						let originaltext = $this.attr("originaltext");
						let originaltitle = $this.attr("originaltitle");
						let html = arr.pop();
						$this.html(html).attr("title", originaltitle);
					}
				});
			}
			else {
				this.data.pictureOption = '事务图';
				this.el.find(".togglePic-text").text('事务图');
				this.el.find(".draged-item").each(function () {
					let $this = $(this);
					if (!$this.hasClass('draged-maodian')) {
						let html = $this.html();
						let eventName = $this.attr("eventname");
						that.data.draged.push(html);
						$this.html(eventName).attr("title", eventName);
					}
				});

			}
		},
		/**
		 * 查看附件
		 * 点击节点弹出附件弹出框
		 */
		async fj(e) {
			let filename = /\.(png|PNG|gif|GIF|JPG|jpg|jpeg|JPEG)$/;
			let nodeId = $(e).parent().attr('id');
			let res = await workflowService.nodeAttachment({
				type: 'single',
				node: nodeId,
				workflow_id: this.data.id,
			});
			for (let i in res.node_attachments) {
				if (filename.test(res.node_attachments[i].file_name)) {
					res.node_attachments[i].isImg = true;
					res.node_attachments[i].isPreview = true;
				} else {
					res.node_attachments[i].isImg = false;
					res.node_attachments[i].isPreview = false;
				}
			}

			Attachment.data['list'] = res.node_attachments;
			Attachment.data['is_view'] = 1;
			PMAPI.openDialogByComponent(Attachment, {
				width: 600,
				height: 400,
				title: '附件查看',
				modal: true
			}).then((res) => {
				this.data.showfj = true;
			})
		}

	},
	binds: [
		{
			event: 'click',
			selector: '.has-attachment-span',
			callback: _.debounce(function (e) {
				if (this.data.showfj) {
					this.actions.fj(e);
				}
				this.data.showfj = false;
			}, 500)
		}
	],
	afterRender: function () {
		this.actions.init();
		this.data.showfj = true;
		this.data.draged = [];
		this.el.on('click', '#zoomIn', () => {
			this.actions.zoomInNodeflow();
		});
		this.el.on('click', '#zoomOut', () => {
			this.actions.zoomOutNodeflow();
		});
		this.el.on('click', '#newWin', () => {
			this.actions.maximizeNodeflow();
		});
		this.el.on('click', '#togglePic', () => {
			this.actions.togglePicture();
		});
	},
	beforeDestory: function () {

	}
};
let WF = Component.extend(config);
let WorkFlow = {
	show(data, elem) {
		let workFlowData = _.defaultsDeep({}, data, {
			nodeflowSize: 1,
			containerwidth: '100%',
			containerheight: '100px',
			// nodesWidth: '60px'
		});
		let component = new WF({data:workFlowData});
		this.WorkFlow = component;
		let el = $("#flow-node");
		component.render(el);
	},
	rejectNode(e) {
		this.WorkFlow.actions.rejectNode(e);
	},
	requiredFields(e) {
		this.WorkFlow.actions.requiredFields(e);
	},
	async createFlow(o) {
		let msg = await workflowService.getWorkflowInfo({
			url: '/get_workflow_info/', data: {
				flow_id: o.flow_id,
				record_id: o.record_id
			}
		});
		if(this.cb){
			this.cb(msg['data'][0])
		}
		let component = new WF({data:msg.data[0]});
		this.WorkFlow = component;
		let el = o.el;
		component.render(el);
	},
	saveCallBack(cb){
		this.cb=cb;
	}
};
export default WorkFlow;