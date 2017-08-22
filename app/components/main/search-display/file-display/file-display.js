import Component from '../../../../lib/component';
import 'jquery-ui/themes/base/base.css';
import 'jquery-ui/themes/base/theme.css';
import 'jquery-ui/ui/widgets/dialog.js';
import './file-display.scss';
import template from './file-display.html';


let config = {
    template:template,
    data:{
        searchData:{},
        isCanReview:true,    //根据文件名后缀判定是否可以预览
        previewSrc:'',  //预览地址
        src:'',         //下载地址
        fileId:'',
    },
    actions:{
        initInfo:function () {
            this.el.find('div.table-name').html(this.data.searchData.label);
            this.el.find('p.attachment-name').html(this.data.searchData.file_name + " 附件");
            this.actions.setHref();
        },
        setHref:function () {
            if(this.data.searchData.file_name.indexOf('docx') !== -1
                || this.data.searchData.file_name.indexOf('xlsx') !== -1
                || this.data.searchData.file_name.indexOf('xls') !== -1){

                this.data.isCanReview = false;
                this.fileId = this.data.searchData.file_id;
                this.data.src = window.location.href.split('search_result')[0] + "download_attachment/?file_id=" + this.fileId + "&download=1";
                this.el.find('a.preview').addClass('cantReview');
                this.el.find('a.download').attr("href",this.data.src).attr('target','_blank');

            }else{
                // this.data.previewSrc = location.href.split('#')[0] + "data/download_attachment/?file_id=" + this.fileId + "&download=0";
                // this.data.src = location.href.split('#')[0] + "data/download_attachment/?file_id=" + this.fileId + "&download=1";
                this.el.find('a.preview').addClass('canReview');
                this.fileId = this.data.searchData.file_id;
                this.data.previewSrc = window.location.href.split('search_result')[0] + "download_attachment/?file_id=" + this.fileId + "&download=0";
                this.data.src = window.location.href.split('search_result')[0] + "download_attachment/?file_id=" + this.fileId + "&download=1";
                this.el.find('a.preview').attr('href',this.data.previewSrc).attr('target','_blank');
                this.el.find('a.download').attr("href",this.data.src).attr('target','_blank');
            }
        }
    },
    afterRender:function () {
        this.actions.initInfo();

    },
    beforeDestory:function () {

    }
};

class FileResult extends Component{
    constructor(data){
        super(config);
        this.data.searchData = data;
    }
}

export const FileDisplay = {
    el:null,
    create:function (data,$father) {
        this.el = $("<div class='single-type2'>").appendTo($father);
        let component = new FileResult(data);
        component.render(this.el);
    }
};