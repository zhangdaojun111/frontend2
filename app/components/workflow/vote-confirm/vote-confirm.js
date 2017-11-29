/**
 *@author yudeping
 *投票确认
 */

import template from './VoteConfirm.html';

let css = `
.add-container{
    padding: 20px;
    overflow: hidden;
}
.add-container .input-box {
    text-align: center;
}
.add-container .input-box .title{
    display: inline-block;
    font-size: 12px;
    font-weight: bold;
    margin-right: 15px;
}
.add-container .input-box .input{
    width: 250px;
    height: 25px;
}
.add-container .button-box {
    position: absolute;
    bottom: 30px;
    right: 35px;
}
.add-container .button-box .save-btn{
    color: #fff;
    background: #0088ff;
    padding: 6px 17px;
    border: none;
    font-size: 12px;
    padding: 6px 17px;
    margin-right: 15px;
    border-radius: 4px;
    cursor: pointer;
}
.add-container .button-box .cancel-btn {
    color: #fff;
    background: #0088ff;
    padding: 6px 17px;
    border: none;
    font-size: 12px;
    padding: 6px 17px;
    border-radius: 4px;
    cursor: pointer;
}
.btn{
    color: #fff;
    background: rgb(20,138,252);
    width: 60px;
    height: 30px;
    border: 1px solid rgb(20,138,252);
    border-radius: 5px;
}
.title{
    margin-top: 15%;
    margin-bottom:8%;
    font-size: 16px;
    text-align: center;
}
\`;
`;


let VoteConfirm = {
	template: template.replace(/(\")/g, '\''),
	data: {
		css: css.replace(/(\n)/g, ''),
		value:''
	},
	afterRender() {
		this.data.style = $("<style></style>").text(this.data.css).appendTo($("head"));
		let _this=this;
		for(let key in this.data.nodeData){
			if(key == ''){
				continue;
			}
			let data=this.data.nodeData[key];
			this.el.find('.options').append($(`<div class="radio" style="flex:0 0 50%;display: flex;justify-content: center;align-items: center"><input type="radio" name="vote" id="${data}" class="vote-radio" value="${data}"/><label for="${data}">${key}</label></div>`))
		}
		this.el.find('.radio').bind('click',function(){
			_this.data.value=$(this).find('input').val();
		});
		this.el.find('.confirm').bind('click',()=>{
			if(this.data.value){
				PMAPI.sendToParent({
					type: PMENUM.close_dialog,
					key: this.key,
					data: {
						value:this.data.value
					}
				})
			}else{
				alert('请投票');
			}
		});
		this.el.find('.cancel').bind('click',()=>{
			PMAPI.sendToParent({
				type: PMENUM.close_dialog,
				key: this.key,
			})
		})
	},
	beforeDestory() {
	}
};
export default VoteConfirm