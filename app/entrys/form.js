import FormBase from '../components/form/base-form/base-form'
import {HTTP} from '../lib/http';
let el=$('<div style="border: 1px solid red;background:#fff;position: fixed;width: 100%;height:100%;overflow: auto">').appendTo('body');

//在这里加对应的控件模板
// let template=`<div class="form">
//               <div data-dfield="f23" data-type="textarea" data-width="500"/>
//               <div data-dfield="f8" data-type="radio" data-width="300"/>
//               <div data-dfield="f26" data-type="input" data-width="300"/>
//               <div data-dfield="f31" data-type="input" data-width="300"/>
//               <div data-dfield="f7" data-type="Select" data-width="300"/>
//               <div data-dfield="f6" data-type="Year" data-width="300"/>
//               <div data-dfield="f5" data-type="Buildin" data-width="300"/>
//               <div data-dfield="f10" data-type="MultiLinkage" data-width="300"/>
//                <div data-dfield="f24" data-type="input" data-width="300"/>
//                <div data-dfield="f30" data-type="input" data-width="300"/>
//                <div data-dfield="f14" data-type="input" data-width="300"/>
//                <div data-dfield="f29" data-type="input" data-width="300"/>
//                <div data-dfield="f25" data-type="input" data-width="300"/>
//                <div data-dfield="f15" data-type="input" data-width="300"/>
//               <div data-dfield="f11" data-type="readonly" data-width="300"/>
//                <div data-dfield="f233" data-type="hidden" data-width="300"/>
//               <div data-dfield="f27" data-type="password" data-width="300"/>
//               <div data-dfield="f28" data-type="YearMonthControl" data-width="300"/>
//               </div>
//                 `;

//验证表
let template=`<div class="form">
              <div data-dfield="f12" data-type="input" data-width="500"/> 
              <div data-dfield="f10" data-type="input" data-width="300"/>
              <div data-dfield="f5" data-type="input" data-width="300"/> 
              <div data-dfield="f8" data-type="input" data-width="300"/> 
              <div data-dfield="f20" data-type="Date" data-width="300"/> 
              <div data-dfield="f15" data-type="Select" data-width="300"/> 
              <div data-dfield="f13" data-type="Radio" data-width="300"/>
              <div data-dfield="f14" data-type="Radio" data-width="300"/>
               <div data-dfield="f17" data-type="input" data-width="300"/>
               <div data-dfield="f18" data-type="Buildin" data-width="300"/>
               <div data-dfield="f9" data-type="input" data-width="300"/>
               <div data-dfield="f21" data-type="Date" data-width="300"/>
               <div data-dfield="f16" data-type="Select" data-width="300"/>
               <div data-dfield="f6" data-type="input" data-width="300"/>
              <div data-dfield="f19" data-type="Date" data-width="300"/>
               <div data-dfield="f11" data-type="input" data-width="300"/>
              </div> 
                `;


function hasKeyInFormDataStatic(key,staticData){
    let isExist = false;
    for(let dict of staticData["data"]){
        if(dict["dfield"] == key){
            isExist = true;
        }
    }
    return isExist;
}
//merge静态和动态数据
function mergeFormData(staticData,dynamicData){
    //merge数据
    for(let dfield in dynamicData["data"]){
        if(hasKeyInFormDataStatic(dfield,staticData)){
            for(let dict of staticData["data"]){
                if(dict["dfield"] == dfield){
                    for(let k in dynamicData["data"][dfield]){
                        dict[k] = dynamicData["data"][dfield][k];
                    }
                }
            }
        }else{
            staticData["data"].push(dynamicData["data"][dfield]);
        }
    }
    staticData["record_info"] = dynamicData["record_info"];
    staticData["parent_table_id"] = dynamicData["parent_table_id"];
    staticData["frontend_cal_parent_2_child"] = dynamicData["frontend_cal_parent_2_child"];
    staticData["error"] = dynamicData["error"];
    let data={

    }
    parseRes(staticData);
    for(let obj of staticData.data){
        data[obj.dfield]=obj;
    }
    staticData.data=data;
    return staticData;
}

function parseRes(res){
    if(res !== null){
        let formData = res["data"];
        if(formData.length != 0){
            //年份选择设置为默认当年
            let myDate = new Date();
            let myYear = myDate.getFullYear();
            let parentRealId = '';
            let parentTableId = '';
            let parentTempId = '';
            for( let data of formData ){
                if( data['id'] == 'real_id' ){
                    parentRealId = data['value'];
                }else if( data['id'] == 'table_id' ){
                    parentTableId = data['value'];
                }else if( data['id'] == 'temp_id' ){
                    parentTempId = data['value'];
                }
            }
            for( let data of formData ){
                if( data.type == "year" ){
                    if( data.value == "" ){
                        data.value = String( myYear );
                    }
                }else if( data.type == "correspondence" ){
                    data['parent_real_id'] = parentRealId;
                    data['parent_table_id'] = parentTableId;
                    data['parent_temp_id'] = parentTempId;
                }else if(data.type == "datetime"){
                    // if( data.value.length == 19 ){
                    //     data.value = data.value.slice( 0,16 )
                    // }
                }
            }

            if(res['record_info']['id']){
                let recordId = res['record_info']['id'];
                for(let d of this.data){
                    if(d['type'] == 'songrid'){
                        d['recordId']=recordId;
                    }
                }
            }
        }
    }
}

// async function wait() {
//     let staticData = await HTTP.postImmediately({
//         url: 'http://127.0.0.1:8081/get_form_static_data/?seqid=yudeping&table_id=8696_yz7BRBJPyWnbud4s6ckU7e&is_extra=&form_id=',
//         type: "POST",
//         hearder:'',
//         data: {
//             formId:'',
//             table_id:'8696_yz7BRBJPyWnbud4s6ckU7e',
//             is_view:1,
//             parent_table_id:'',
//             parent_real_id:'',
//             parent_temp_id:'',
//             // real_id:'59803341ae6ba89d68ac574e'
//         }
//     });
//     let dynamicData = await HTTP.postImmediately({
//         url: 'http://127.0.0.1:8081/get_form_dynamic_data/?seqid=yudeping&table_id=8696_yz7BRBJPyWnbud4s6ckU7e&is_extra=&form_id=',
//         type: "POST",
//         hearder:'',
//         data: {
//             form_id:'',
//             table_id:'8696_yz7BRBJPyWnbud4s6ckU7e',
//             is_view:1,
//             parent_table_id:'',
//             parent_real_id:'',
//             parent_temp_id:'',
//             // real_id:'59803341ae6ba89d68ac574e'
//         }
//     });
//     let data=mergeFormData(staticData,dynamicData);
//     let formData={
//         template:template,
//         data:data,
//     }
//     let form=new FormBase(formData);
//     form.render(el);
// }
// wait();

//验证的表
async function wait() {
    let staticData = await HTTP.postImmediately({
        url: 'http://127.0.0.1:8081/get_form_static_data/?seqid=yudeping&table_id=69_6pUaHZLMxbfEBV8s84szSf&is_extra=&form_id=',
        type: "POST",
        data: {
            formId:'',
            table_id:'69_6pUaHZLMxbfEBV8s84szSf',
            is_view:0,
            parent_table_id:'',
            parent_real_id:'',
            parent_temp_id:'',
            real_id:''
        }
    });
    let dynamicData = await HTTP.postImmediately({
        url: 'http://127.0.0.1:8081/get_form_dynamic_data/?seqid=yudeping&table_id=69_6pUaHZLMxbfEBV8s84szSf&is_extra=&form_id=',
        type: "POST",
        data: {
            form_id:'',
            table_id:'69_6pUaHZLMxbfEBV8s84szSf',
            is_view:1,
            parent_table_id:'',
            parent_real_id:'',
            parent_temp_id:'',
            real_id:''
        }
    });
    let data=mergeFormData(staticData,dynamicData);
    let formData={
        template:template,
        data:data,
    }
    let form=new FormBase(formData);
    form.render(el);
}
wait();

//
// HTTP.post( 'get_form_static_data/?seqid=yudeping&table_id=8696_yz7BRBJPyWnbud4s6ckU7e&is_extra=&form_id=',{ formId:'',
//     table_id:'8696_yz7BRBJPyWnbud4s6ckU7e',
//     is_view:0,
//     parent_table_id:'',
//     parent_real_id:'',
//     parent_temp_id:''} ).then( res=>{
//     console.log( "#############" )
//     console.log( "#############" )
// } )
// HTTP.post( 'get_form_dynamic_data/?seqid=yudeping&table_id=8696_yz7BRBJPyWnbud4s6ckU7e&is_extra=&form_id=',{ form_id:'',
//     table_id:'8696_yz7BRBJPyWnbud4s6ckU7e',
//     is_view:0,
//     parent_table_id:'',
//     parent_real_id:'',
//     parent_temp_id:'',
//     real_id:'',} ).then( res=>{
//     console.log( "ssss" )
//     console.log( "sss" )
// } )
// HTTP.flush()

let data={
    attachment: [],
    base_fields: [],
    company_custom_table_form_exists: 0,
    company_name: "rzrk",
    custom_form_exists: 0,
    custom_table_form_exists: 0,

    //这里加数据
    data:[{can_add_item: 0,
        dfield: "f17",
        dinput_type: "6",
        dtype: "4",
        effect : [],
        expression: "",
        field_content: {'725_iUMCHgdrmKCECueRXMxMmV':"宕机",
            '2845_yu9ShhhGhnV3hC4PiPE4pb': "细节",
            '5047_rDGWDpUYfcW8xCUUFKt2M4': "很严重",
            '5244_aMetNYTDNTnAESXKYqes3D': "崩溃"},
        filterOptions: 0,
        history: 0,
        history_data: [],
        id: "5549_CGYnvEDxxrTFAHKnjFk3E9",
        is_view:0,
        label: "严重性",
        linkage: {},
        options: [{value: "", label: ""}, {py: ["xj"], value: "2845_yu9ShhhGhnV3hC4PiPE4pb", label: "细节"}],
        real_type: "6",
        relevance_condition: {},
        required: 1,
        required_perm: 1,
        type: "Select",
        unvisible: 0,
        value: ""
    },
        {can_add_item: 0,
            dfield: "f28",
            dinput_type: "7",
            dtype: "4",
            effect: [],
            expression: "",
            field_content: {'8481_DjJrRwVzVC3HAKQujvBtZT': "需求", '392_6735kJkkiN6VNCi3DzVgGK': "Bug"},
            filterOptions:0,
            group :[{value: "392_6735kJkkiN6VNCi3DzVgGK", label: "Bug",name:'f28'},{label: "需求",value: "8481_DjJrRwVzVC3HAKQujvBtZT",name:'f28'}],
            history:0,
            history_data:[],
            id:"1149_GHDQq6Guc6PkujnMBsBbwX",
            is_view:0,
            label:"问题类型",
            linkage:{},
            real_type:"7",
            relevance_condition:{},
            required:1,
            required_perm:1,
            type:"Radio",
            unvisible:0,
            value:""
        },{
            dfield: "f11",
            dinput_type: "0",
            dtype: "0",
            effect: [],
            expression: "",
            field_content: {},
            history: 0,
            history_data: [],
            id: "2300_8x6kYn9ydZ7VBUw6tLjUN4",
            is_view: 0,
            label: "普通输入",
            real_type: "0",
            relevance_condition: {},
            required: 1,
            required_perm: 1,
            type: "Input",
            unvisible: 0,
            value: "",
            reg:"^[0-9]*$",
            numArea: {
                max: "33",
                min : 10,
                error: ""
            },
            func:'1',
            regErrorMsg:""
        },
        {
            dfield: "f23",
            dinput_type: "21",
            dtype: "8",
            effect: [],
            expression: "",
            field_content: {},
            history: 0,
            history_data: [],
            id: "5496_ee3C3otL9XZ65xV3DpKShm",
            is_view: 0,
            label: "只读",
            real_type: "0",
            required: 1,
            required_perm: 1,
            type: "Readonly",
            unvisible: 0,
            value: "asdaff",
            reg:"^[0-9]*$",
            numArea: {
                max: "33",
                min : 10,
                error: ""
            },
            func:'1',
            regErrorMsg:""
        },
        {
            dfield: "f27",
            dinput_type: "25",
            dtype: "0",
            effect: [],
            expression: "",
            field_content: {use_password:0, type:"md5"},
            history: 0,
            history_data: [],
            id: "9268_Z42DEzpGJDQD3UZi5N8rPK",
            is_view: 0,
            label: "加密文本",
            real_type: "25",
            relevance_condition:{},
            required: 0,
            required_perm: 1,
            type: "EnctyptInput",
            unvisible: 0,
            value: "",
        },
        {
            dfield: "f8",
            dinput_type: "21",
            dtype: "8",
            effect: [],
            expression: "",
            field_content: {},
            history: 0,
            history_data: [],
            id: "5496_ee3C3otL9XZ65xV3DpKShm",
            is_view: 0,
            label: "隐藏",
            real_type: "0",
            required: 0,
            required_perm: 1,
            type: "Hidden",
            unvisible: 0,
            value: "",
        },
        {
            dfield: "f12",
            dinput_type: "0",
            dtype: "0",
            effect: [],
            expression: "",
            field_content: {},
            history: 0,
            history_data: [],
            id: "2300_8x6kYn9ydZ7VBUw6tLjUN4",
            is_view: 0,
            label: "测试component",
            real_type: "0",
            relevance_condition: {},
            required: 0,
            required_perm: 1,
            type: "Input",
            unvisible: 0,
            value: "测试",
        },
        {
            dfield: "f24",
            dinput_type: "1",
            dtype: "0",
            effect: [],
            expression: "",
            field_content: {},
            history: 0,
            history_data: [],
            id: "8477_giNSX3CRV36kktVAaRpqqd",
            is_view: 0,
            label: "备注",
            real_type: "1",
            relevance_condition: {},
            required: 0,
            required_perm: 1,
            type: "Textarea",
            unvisible: 0,
            value: ""
        },
        {
            can_add_ite:0,
            dfield: "f10",
            dinput_type: "6",
            dtype: "4",
            effect: [],
            expression: "",
            field_content: {
                '1199_tD6FAqVFqjhR4x2NDh9W7A':"长期",
                '2020_dq54VMHCNydZFAgvoW8Zgi':"紧急",
                '3330_Wf9PyBsDWAwf6iQgKf5arC':"重要",
                '6720_zUBFEZHyKrUbTmwRECNfZX':"一般",
                '8817_H7UNLtjYeGXCQLMjkV5qMK':"重构"
            },
            filterOptions:0,
            history:0,
            history_data:[],
            id:"5173_sNVRLS8h3y648i7BFqohbQ",
            is_view:0,
            label:"紧急程度",
            linkage:{},
            options:[
                {
                    label: "",
                    value: ""
                },{
                    label: "重构",
                    py: ["zg", "cg", "tg"],
                    value: "8817_H7UNLtjYeGXCQLMjkV5qMK",
                },
                {
                    label: "一般",
                    py: ["yb", "yp"],
                    value: "6720_zUBFEZHyKrUbTmwRECNfZX",
                },
                {
                    label: "重要",
                    py: ["zy", "cy", "ty"],
                    value: "3330_Wf9PyBsDWAwf6iQgKf5arC"
                }
            ],
            real_type:"6",
            relevance_condition:{},
            required:1,
            required_perm:1,
            type:"Select",
            unvisible:0,
            value:"",
        },
        {
            dfield: "f6",
            dinput_type: "12",
            dtype: "0",
            effect: [],
            expression: "",
            field_content: {},
            history: 0,
            history_data: [],
            id: "5010_tsHN8kkQ4EwRgfYTpkSimf",
            is_view: 0,
            label: "年份框",
            real_type: "12",
            relevance_condition: {},
            required: 1,
            required_perm: 1,
            type: "Year",
            unvisible: 0,
            value: "",
            be_control_condition:1
        },
        {
            can_add_item: 0,
            dfield: "f5",
            dinput_type: "6",
            dtype: "5",
            effect: [],
            expression: "",
            field_content: {frontend_add: 0},
            history: 0,
            history_data: [],
            id: "276_aKgBrrPj8nQZ5ZcJmWoCX2",
            is_view: 0,
            label: "内置姓名",
            options: [
                {value: "", label: ""},
                {py: ["erdsxzs"], value: "5979d3e2d8e9e42f576b8c88", label: "erds小助手"},
                {py: ["gly","glz"], value: "5979d3e2d8e9e42f576b8c89", label: "管理员"},
                {py: ["zws"], value: "5979e48a41f77c586658e33c", label: "张文栓"},
                {py: ["ryj"], value: "5979e48a41f77c586658e33d", label: "任雨杰"},
            ],
            real_type:"0",
            relevance_condition:{},
            required:1,
            required_perm:1,
            source_table_id:"9040_HezGY74DU6jJ5hMGzwBYWh",
            type:"Buildin",
            unvisible:0,
            value:"5979e48a41f77c586658e33c",
            showValue:'张文栓',
        },
        {
            datalist:{
                "": ["请选择", "请选择", "请选择"],
                '597ed7a4d6e7a0e7a1cc3181':["文本12", "11", "董哥"],
                '597ed7b4d6e7a0e7a1cc3183':["文本13", "11", "于德萍"],
                '597ed7bdd6e7a0e7a1cc3186':["文本14", "11", "于德萍"],
                '597ed8060a67fcf1d3bac3cc':["文本12", "12", "于德萍"],
                '597ed79647b2c3e3ac6f9fcb':["文本11", "11", "董哥"],
                '597ed81147b2c3e3ac6f9fcf':["文本13", "13", "于德萍"],
                '597ed82149b1138390f5991e':["文本11", "11", "于德萍"]
            },
            dfield:"f7",
            value:'',
            required:1,
        }
    ],
    error: "",
    exclude_fields: [],
    field_effect_sort: ["_id", "f9", "f8", "f7", "f6", "f5", "f4", "f32", "f3", "f28", "f27", "f25", "f24", "f23", "f20"],
    form_id: "171",
    frontend_cal_parent_2_child: {},
    main_departments: [],
    parent_table_id: "",
    plugin_fields: [],
    show_other_fields: 0,
    success: 1,
    sys_type: "normal",
    table_id: "5613_CHEUbzmZMsjDFT3AiwPB46",
    use_fields: {}
}
// let formData={
//     template:template,
//     data:data,
// }
// let form=new FormBase(formData);
// form.render(el);