import Component from '../../../lib/component';
import template from '././approval-record.html';
import '././approval-record.scss';


let config={
    template: template,
    data:{},
    actions:{
        tipsMouseover:function (pos,txt,event) {

            if(txt!=''){
                var tooltip = $('<div id="J_tooltip"></div>');
                $("body").append(tooltip);
                let tooltipDiv=$("#J_tooltip");
                tooltipDiv.css({
                    top: (event.pageY+pos.y) + "px",
                    left:  (event.pageX+pos.x)  + "px"
                }).show("fast").text(txt);
            }

        },
        tipsMouseout:function (el) {
            el.remove()
        },
        tipsMousemove:function (pos,el,event) {
            el.css({
                top: (event.pageY+pos.y) + "px",
                left:  (event.pageX+pos.x)  + "px"
            })
        }

    },
    afterRender(){
        let self=this;
        let pos={x:10,y:20};
        this.el.on("mouseover",".tipsText",function (e) {
            self.actions.tipsMouseover(pos,$(this).text(),e)
        });
        this.el.on("mouseout",".tipsText",function (e) {
            self.actions.tipsMouseout($("#J_tooltip"),e)
        });
        this.el.on("mousemove",".tipsText",function (e) {
            self.actions.tipsMousemove(pos,$("#J_tooltip"),e)
        })
    }

};
class workflowRecord extends Component{
    constructor (data){
        super(config,data);
    }
}

export default {
    showRecord(data){
        let component = new workflowRecord(data);
        let el = $('#workflow-record');
        component.render(el);
    },
};

