import Component from "../../../../lib/component";
import template from './leftContent.SelectLabel.html';
import './leftContent.SelectLabel.scss';
import {CalendarService} from '../../../../services/calendar/calendar.service';
import Mediator from '../../../../lib/mediator';

let config = {
    template: template,
    data:{
        labelId:Number,
        tablechildren:[],
    },
    actions: {
       
    },
    afterRender: function() {
        $('#checkbox-1').attr("id", 'checkbox-'+this.data.labelId);
        $('#label-1').attr("for",'checkbox-'+this.data.labelId);
        $('#label-1').attr("id",'label-'+this.data.labelId);
        $('#label-11').attr("id",'labely-'+this.data.labelId);
        $('.select-label-show').bind('click',function(){
            if($(this).hasClass('hide-check-group'))
            {
                $(this).removeClass("hide-check-group");
                console.log($(this));
                $(this).nextAll('.checkbox-group').hide();
                console.log(1);
            }
            else{
                $(this).addClass("hide-check-group");
                $(this).nextAll('.checkbox-group').show();
                console.log(0);
            }
        });
        $('.select-label').bind('click',function () {
            console.log($(this).prevAll('input').prop('checked'));
            var val=$(this).attr("id");
            var id = val.split("-");
            console.log(id[1]);
            let class_Name = ".checkbox-children-"+id[1];
            console.log(class_Name);
                if($(this).prevAll('input').prop("checked"))
                {
                    $(class_Name).removeClass("checked");
                    $(class_Name).attr('checked',false);
                }
                else if(!$(this).prevAll('input').prop("checked"))
                {
                    $(class_Name).each(function(){
                        if (!$(this).hasClass('checked')) {
                            $(this).addClass('checked');
                            $(this).attr('checked',true);
                        }
                    });


                }

        });

        this.data.tablechildren.forEach((tableId,labelId) => {
            this.append(new leftContentSelectChildren(tableId,labelId), this.el.find('.checkbox-group'))});
    }
}

class LeftContentSelect extends Component {
    constructor(data){
        config.data = data;
        super(config);
    }

}

export default LeftContentSelect;