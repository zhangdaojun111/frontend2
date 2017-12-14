/**
 *@author yudeping
 *对应关系控件
 */

import Component from '../../../lib/component'
import Mediator from '../../../lib/mediator';
import DataTableAgGrid from '../../dataGrid/data-table-page/data-table-agGrid/data-table-agGrid';
import './correspondence-control.scss';
import template from './correspondence-control.html';
import {CreateFormServer} from "../../../services/formService/CreateFormServer";

let config = {
	template: template,
	actions: {
		correspondenceDefault(res) {
			if (res == this.data.value) {
				this.data.dataGrid.actions.getGridData();
			}
		}
	},
	binds: [
		{
			event: 'click',
			selector: '.ui-forms-a',
			callback: function () {
				this.events.openCorrespondence(this.data);
			}
		},
	],
	afterRender() {
		let config = {
			tableId: this.data.value,
			parentTableId: this.data.parent_table_id,
			parentTempId: this.data.temp_id,
			parentRealId: this.data.parent_real_id,
			rowId: this.data.parent_temp_id || '',
			viewMode: 'viewFromCorrespondence',
			recordId: this.data.recordId || '',
			correspondenceField: this.data.dfield,
		}
		let dataGrid = new DataTableAgGrid({data: config});
		this.data.dataGrid = dataGrid;
		this.append(dataGrid, this.el.find('.correspondence-box'));
	},

	firstAfterRender() {
		Mediator.subscribe('form:correspondenceRequired:' + this.data["value"], (res) => {
			if(!this.el){
				return;
			}
			if (!res) {
				this.el.find('#requiredLogo').removeClass().addClass('required');
				this.data.correspondenceHasValue = false;
			} else {
				this.el.find('#requiredLogo').removeClass().addClass('required2');
				this.data.correspondenceHasValue = true;
			}
			this.events.CorrespondenceRequiredChange(this.data);
		})
	},

	beforeDestory() {
		this.el.off();
	}
}
let Correspondence = Component.extend(config)
export default Correspondence