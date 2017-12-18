/**
 *@author yudeping
 *创建默认表单或者定制表单
 */

import userHtml from  './talbe-form/form-version-table-user.html';
import departmentHtml from  './talbe-form/form-version-talbe-department.html';
import {FormService} from "../../../services/formService/formService"
export const CreateForm={
    name:{}, manager:{}, vice_manager:{}, parent:{}, is_group:{}, is_delete:{},username:{}, is_superuser:{}, is_active:{}, ip:{},
    email:{}, department_whole:{}, job:{}, status:{}, department:{}, tel:{},
    //主岗部门list
    main_depart:[],
    //是否为超级管理员
    isSuperuser:{},
    //创建默认表单
    formDefaultVersion(data){
        let html=`<table class="form table table-striped table-bordered table-hover form-default">
            <tbody>
                `;
        for(let key in data){
            if(data[key].type==='Hidden'){
                html+=`<div data-dfield="${data[key].dfield}" data-type="${data[key].type}"></div>`;
            }else{
                html+=`<tr>
                        <td style="width: 150px;white-space: nowrap;">${ data[key].label }</td>
                        <td><div data-dfield="${data[key].dfield}" data-type="${data[key].type}"></div></td>
                </tr>`;
            }
        }
        html+=`</tbody>
        </table>`
        return html;
    },

    changeMainDepart(isClick){
        let arr = [{value:'',label:'请选择'}];

        //判断是否需要将主岗部门置为请选择
        if( isClick ){
            let arr_1 = [];
            for( let i = 1;i<this.department["options"].length;i++ ){
                arr_1.push(this.department["options"][i]["value"]);
            }
            if( arr_1.length != this.department_whole.value.length ){
                this.setFormValue( this.form_data['department'],'' );
            }
        }
        //改变主岗部门option
        for( let i=0;i<this.department_whole.value.length;i++ ){
            for( let j=0;j<this.main_depart.length;j++ ){
                if( this.main_depart[j]["value"] === this.department_whole.value[i] ){
                    arr.push( this.main_depart[j] );
                }
            }
        }
        this.department["options"] = arr;
    },
    //创建人员信息表
    async formVersionuser(allData){
        let data=allData.data;
        let html=userHtml.replace('</tbody> </table>','');
        let res=await FormService.getSysConfig();
        let form_data=res.userInfo['system_config'][0]["field_mapping"];
        let arrData = [];
        let otherData=[];
        for( let i in form_data )
        {
            for ( let j in data)
            {
                if( form_data[i] == j )
                {
                    arrData.push( j );
                    this[i]=data[j];
                }
            }
        }
        for( let k in data ){
            if( data[k]['real_type'] && arrData.indexOf( k ) == -1 ){
                otherData.push( data[k] )
            }
        }

        if( this.username.value && this.username.value!='' ){
            this.username.is_view = '1';
        }

        this.is_superuser["group"] = [{'label': '是', 'value': "1"}, {'label': '否', 'value': "0"}];
        this.is_superuser["type"] = "radio";
        this.is_superuser["value"] = this.is_superuser["value"] + '';
        if( !this.isSuperuser && !( this.is_superuser["value"]=='1' ) ){
            this.is_superuser["value"] = '0';
        }

        this.is_active["group"] = [{'label': '是', 'value': "1"}, {'label': '否', 'value': "0"}];
        this.is_active["type"] = "radio";
        this.is_active["value"] = this.is_active["value"] + '';

        this.status["type"] = 'select';
        this.status["label"] = '用户状态';
        this.status["options"] = [
            {value: "", label: '请选择'},
            {value: "0", label: '离职'},
            {value: "1", label: '在职'},
            {value: "2", label: '实习'},
            {value: "3", label: '试用'},
            {value: "4", label: '管理员'},
            {value: "5", label: '病休'}
        ];
        this.status["value"] = this.status["value"] + '';

        this.main_depart = data[form_data.department]["options"];

        this.changeMainDepart(false);
        allData.data[form_data.department]["options"]=this.department['options'];
        allData.data[form_data.department_whole]['isSys']=true;
        allData.data[form_data.department_whole]['main_depart']=_.defaultsDeep({},this.main_depart);
        allData.data[form_data.department_whole]['department']=_.defaultsDeep({},this.department);
        allData.data[form_data.department_whole]['form_department']=form_data['department'];
	    let userInfoDfields=['f3','f6','f7','f9','f16','f11','f12','f14','f13','f15','f10'];

        for(let key in otherData){
            if(otherData[key].type !='Hidden'){
                html+=`<tr class="firstRow"><td valign="top" width="664"><span data-id="4"
                                                   style="border: 2px currentColor; border-image: none;">${otherData[key].label}</span></td>
                <td valign="top" width="664">
                    <div data-dfield="${otherData[key].dfield}" data-type="${otherData[key].type}"></div>
                </td></tr>`
            }
            userInfoDfields.push(otherData[key].dfield);
        }

        for(let key in allData.data){
        	let index = userInfoDfields.indexOf(key);
        	index!=-1?userInfoDfields.splice(index,1):'';
        }
        allData.userInfoDfields=userInfoDfields;

        html+=`</tbody>
            </table>
            <div data-dfield="temp_id" data-type="Hidden"></div>
            <div data-dfield="real_id" data-type="Hidden"></div>
            <div data-dfield="table_id" data-type="Hidden"></div>`
        return html;
    },
    //创建部门信息表
    async formVersiondepartment(allData){
        let html=departmentHtml.replace('</tbody> </table>','');
        let res=await FormService.getSysConfig();
        let data=allData.data;
        let form_data=res.userInfo['system_config'][1]["field_mapping"];
        let arrData = [];
        let otherData=[];
        for( let i in form_data )
        {
            for ( let j in data)
            {
                if( form_data[i] == j )
                {
                    arrData.push( j );
                    this[i]=data[j];
                }
            }
        }
        for( let k in data ){
            if( data[k]['real_type'] && arrData.indexOf( k ) == -1 ){
                otherData.push( data[k] )
            }
        }
        this.is_delete["group"] = [{ 'label':'是','value':'1' },{ 'label':'否','value':'0'}];
        this.is_delete["type"] = "radio";
        this.is_delete["value"] = this.is_delete["value"] + '';

        this.is_group["group"] = [{ 'label':'是','value':'1' },{ 'label':'否','value':'0' }];
        this.is_group["type"] = "radio";
        this.is_group["value"] = this.is_group["value"] + '';

        if( allData["main_departments"].indexOf( data['f7']['value'] ) != -1 ){
            this.parent["options"] = [{value:'',label:'无父部门'}];
            this.parent["is_view"] = 1;
        }
        for(let key in otherData){
            if(otherData[key].type !='Hidden') {
                html += `<tr class="firstRow"><td valign="top" width="664"><span data-id="4"
                                                   style="border: 2px currentColor; border-image: none;">${otherData[key].label}</span></td>
                <td valign="top" width="664">
                    <div data-dfield="${otherData[key].dfield}" data-type="${otherData[key].type}"></div>
                </td></tr>`
            }
        }
        html+=`</tbody>
            </table>
            <div data-dfield="temp_id" data-type="Hidden"></div>
            <div data-dfield="real_id" data-type="Hidden"></div>
            <div data-dfield="table_id" data-type="Hidden"></div>`
        return html;
    },

    async creatSysTable(systype,res){
        let html=await this[`formVersion${systype}`](res);
        return html;
    }
}