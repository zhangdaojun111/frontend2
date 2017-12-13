/**
 *@author hufei
 * 对工作流表单的操作
 */

import Component from "../../../lib/component";
import template from './workflow-form.html';
import './workflow-form.scss';

import Mediator from '../../../lib/mediator';
import Attachment from '../../form/attachment-list/attachment-list';
import {FormService} from "../../../services/formService/formService";
import {PMAPI, PMENUM} from '../../../lib/postmsg';
import SettingPrint from '../../form/setting-print/setting-print';
import {CreateFormServer} from "../../../services/formService/CreateFormServer";
import {workflowService} from '../../../services/workflow/workflow.service'
import msgBox from '../../../lib/msgbox'

let config = {
	template: template,
	data: {
		attachment: [], //表单附件
		isshowprintbtn: false, //是否显示打印附件按钮
		isshowfjbtn: false,
		miniFormVal: '',
        obj:'',
	},
	actions: {
		appPass() {
			let arr = [];
			arr.push(JSON.stringify(this.actions.collectImg()));
			arr.push(JSON.stringify(this.data.delsign));
			this.events.sendImgInfo(arr);
		},
		showImgDel(e) {
			let ev = $(e.target).children('i');
			ev.css("display", "block");
		},
		hideImgDel(e) {
			let ev = $(e.target).children('i');
			ev.css("display", "none");
		},
		delimg(e) {
			let el = $(e.target).parent();
			let em = el.next();
			em.remove();
			el.remove();
			if (el.hasClass('deloldimg')) {
				let id = el.attr('data-imgid');
				this.data.delsign.push(parseInt(id));
			}
		},

		/**
		 * 收集上传的信息给后台
		 * @returns {Array} 返回一个添加到form中的图片的信息
		 */
		collectImg() {
			let imgNode = this.el.find('.imgseal');
			let len = imgNode.length;
			let arr = [];
			for (let i = 0; i < len; i++) {
				let id = imgNode[i].dataset.imgid;
				let viewTop = imgNode[i].dataset.viewtop;
				let viewLeft = imgNode[i].dataset.viewleft;
				let width = imgNode[i].dataset.width;
				let height = imgNode[i].clientHeight;
				let obj = {
					"height": height,
					"width": width,
					"file_id": id,
					"viewTop": viewTop,
					"viewLeft": viewLeft
				};
				arr.push(obj);
			}
			return arr;
		},
		/**
		 * 添加上次审批盖章图片
		 * @param e 后端传过来json
		 */
		addImg(e) {
			let imgInfo = e.data[0].stamps;
			let len = imgInfo.length;
			let html = " ";
			for (let i = 0; i < len; i++) {
				let left = imgInfo[i].viewLeft + "%";
				let top = imgInfo[i].viewTop + "%";
				if (imgInfo[i].user == window.config.ID && this.data.view) {
					html += `<div class='deloldimg noprint'  data-imgid=${imgInfo[i].id} style="left:${left};top:${top};height:${imgInfo[i].height}px;width:${imgInfo[i].width}px ">
                            <img style="max-height:150px;width:100%" src='/download_attachment/?file_id=${imgInfo[i].file_id}&download=0'/>
                                <i class='J_del'>X</i>
                         </div>`;
					html += `<img class="printS printimg" style="left:${left};top:${top};height:${imgInfo[i].height}px;width:${imgInfo[i].width}px "  src='/download_attachment/?file_id=${imgInfo[i].file_id}&download=0'/>`;
				} else {
					html += `<img class="oldImg noprint" src="/download_attachment/?file_id=${imgInfo[i].file_id}&download=0" style="left:${left};top:${top};height:${imgInfo[i].height}px;width:${imgInfo[i].width}px " />`;
					html += `<img class="printimg printS" src="/download_attachment/?file_id=${imgInfo[i].file_id}&download=0" style="left:${left};top:${top};height:${imgInfo[i].height}px;width:${imgInfo[i].width}px " />`;
				}
			}
			this.el.find(".form-print-position").append(html);
		},
		/**
		 * 隐藏原来的图片
		 */
		hideImg() {
			this.el.find(".oldImg").hide();
		},
		/**
		 * 显示原来的图片
		 */
		showImg() {
			this.el.find(".oldImg").show();
		},
		/**
		 * 收缩和展开form表单
		 */
		trans() {
			let ev = this.el.find('.collapseFormBtn');
			if (this.formTrans) {
				ev.addClass("animat2");
				ev.removeClass("animat1");
				this.formTrans = false;
			} else {
				ev.addClass("animat1");
				ev.removeClass("animat2");
				this.formTrans = true;
			}
			this.el.find(".place-form").toggle();
		},
		/**
		 * @method 自定义页眉
		 */
		async printSetting() {
			let res = await FormService.getPrintSetting()
			// if(res.succ == 1){
			SettingPrint.data['key'] = this.data.key;
			if (res.data && res.data.length && res.data.length != 0) {
				SettingPrint.data['printTitles'] = res['data'];
				SettingPrint.data['myContent'] = res['data'][0]['content'] || '';
				SettingPrint.data['selectNum'] = parseInt(res['data']['index']) || 1;
			}
			PMAPI.openDialogByComponent(SettingPrint, {
				width: 400,
				height: 180,
				title: '自定义页眉',
				modal: true
			})
		},
		/**
		 * 附件查看
		 */
		newfj() {
			let filename = /\.(png|PNG|gif|GIF|JPG|jpg|jpeg|JPEG)$/;
			let filem = /\.(mp4)$/;
			let node_attachments = this.data.attachment;
			for (let i in node_attachments) {
				node_attachments[i].file_id = node_attachments[i].attachment_id;
				node_attachments[i].file_name = node_attachments[i].name;
				if (filename.test(node_attachments[i].file_name)) {
					node_attachments[i].isImg = true;
					node_attachments[i].isPreview = true;
				} else {
					node_attachments[i].isImg = false;
					node_attachments[i].isPreview = false;
				}
				// node_attachments[i].dinput_type=9;
				if (filem.test(node_attachments[i].file_name)) {
					node_attachments[i].isImg = false;
					node_attachments[i].isPreview = true;
					node_attachments[i].dinput_type = 9;
				}
			}
			Attachment.data['list'] = node_attachments;
			Attachment.data['is_view'] = 1;
			PMAPI.openDialogByComponent(Attachment, {
				width: 600,
				height: 400,
				title: '附件查看',

				modal: true
			})
		},
		//表单最小化
		miniForm() {
            this.data.miniFormVal = CreateFormServer.getFormValue(this.data.obj.tableId, false)
			if (!window.top.miniFormVal) {
				window.top.miniFormVal = {};
			}
            window.top.miniFormVal[this.data.obj.tableId] = this.data.miniFormVal;
            window.top.miniFormValTableId = this.data.obj.tableId;
            window.top.miniFormValRealId = this.data.obj.realId;
			PMAPI.sendToRealParent({
				type: PMENUM.close_dialog,
				key: this.data.key,
				data: 'success',
			});
		},

		getFormTrans(e) {
			if (!e) {
				if (this.formTrans) {
					this.actions.trans();
				}
			}
		},
	},
	binds: [
		{
			event: 'click',
			selector: '.collapseFormBtn',
			callback: function () {
				this.actions.trans();
			}
		},
	],
	afterRender: function () {
		// this.showLoading();
		Mediator.subscribe('form:formTableId', (msg) => {
            this.data.obj = msg;
		});
		let serchStr = location.search.slice(1), obj = {};
		serchStr.split('&').forEach(res => {
			let arr = res.split('=');
			obj[arr[0]] = arr[1];
		});
		if (obj.key && location.pathname != "/wf/approval/") {
			this.el.find('#printBtn').show();
		}
		this.data.key = obj.key;
		this.data.view = obj.btnType == 'edit' ? 1 : 0;
		let __this = this;
		this.formTrans = false;
		this.data.delsign = [];
		this.el.on("mouseenter", ".imgseal", function (e) {
			let ev = $(this).find('.J_del');
			ev.css("display", "block");
		}),
			this.el.on("mouseleave", '.imgseal', function (e) {
				let ev = $(this).find('.J_del');
				ev.css("display", "none");
			})
		this.el.on("mouseenter", ".deloldimg", function (e) {
			let ev = $(this).find('.J_del');
			ev.css("display", "block");
		}),
			this.el.on("mouseleave", '.deloldimg', function (e) {
				let ev = $(this).find('.J_del');
				ev.css("display", "none");
			})
		this.el.on("click", '.J_del', (e) => {
			this.actions.delimg(e);
		})
		this.el.on('click', '#newfj', () => {
			this.actions.newfj();
		});
		this.el.on('click', '#printBtn', () => {
			this.actions.printSetting();
		});
		this.el.on('click', '#miniFormBtn', () => {
			this.actions.miniForm();
		});
        //发起工作流保存草稿
        this.el.on('click','#draftBtn', () => {
            let postData = {
                flow_id: this.data.obj.flowId,
                is_draft: 1,
                data: {}
            };
            this.el.parents().find('#workflow-content').hide();
            this.el.parents('#workflow-content').siblings('.workflow-header').children('#workflow-box').show();
            let formData = CreateFormServer.getFormValue(this.data.obj.tableId, false);
            postData.data = JSON.stringify(formData);
            (async function () {
                return workflowService.createWorkflowRecord(postData);
            })().then(res=> {
                if(res.success === 1){
                    msgBox.showTips('草稿保存成功！');
                }
            })
        });
		Mediator.subscribe('workFlow:record_info', (res) => {
			if (res.attachment.length) {
				this.data.attachment = res.attachment;
				this.el.find('.newfj').show();
			} else {
				this.data.attachment = [];
				this.el.find('.newfj').hide();

			}
		});
		Mediator.subscribe('workflow:getImgInfo', (e) => {
			this.actions.addImg(e);
		});
		//获取表名，通过form传给我们表名
		Mediator.subscribe("workflow:getWorkflowTitle", res => {
			if (res) {
				this.el.find(".J_wfName").text(res);
			} else {
				this.el.find(".J_wfName").text("表名");
			}
		});
		Mediator.subscribe("form:formAlreadyCreate", (e) => {
			// this.hideLoading();
		});
	}
}


let WorkFlowForm = Component.extend(config);
export default WorkFlowForm
