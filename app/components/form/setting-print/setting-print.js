import template from './setting-print.html';
let css = `
.wrap{
    display: inline-block;
    margin-top: 6px;
    margin-left: 10px;
    position: relative;
}
.global-search-history {
    padding: 0;
    margin: 0;
    list-style: none;
    z-index: 9999;
    border:1px solid #c5e1ff;
    display: flex;
    flex-flow: column;
    position: absolute;
    height:auto;
    width:207px;
    background: #fff;
    overflow: hidden;
}
.global-search-history li {
    padding: 4px;
    text-indent: 6px;
    cursor: pointer;
}
.global-search-history .active {
    background: #c5e1ff;
}
.clear-global-search-history:hover {
    background: #00b7ee;
}
.clear-global-search-history {
    color: #0f79ef;
    text-align: center;
}
.global-search-input{
    color: black;
    font-size: 12px;
}`;
let SettingPrint = {
    template: template.replace(/\"/g, '\''),
    data: {
        css: css.replace(/(\n)/g, ''),
        printTitles:[],
        myContent:'',
    },
    firstAfterRender(){
        let _this=this;
        this.data.style = $("<style></style>").text(this.data.css).appendTo($("head"));
       _this.el.on('click','li',function(){
           _this.data.myContent=$(this).html();
           _this.el.find('input').val($(this).html());
       }).on('mouseover','.oneSelect',function () {
           $(this).addClass('active');
       }).on('mouseleave','.oneSelect',function(){
           $(this).removeClass('active');
       }).on('click','a',function () {
           for(let i in _this.data.printTitles){
               if(_this.data.printTitles[i].content == $(this).parent().find('li').html()){
                   _this.data.printTitles.splice(+i,1);
                   $(this).parent().remove();
                   HTTP.post('user_preference',{action:'save',content:JSON.stringify(_this.data.printTitles)});
                   HTTP.flush();
                   break;
               }
           }
       }).on('click','.cancel',function(){
           PMAPI.sendToParent({
               type: PMENUM.close_dialog,
               key: _this.key,
           })
       }).on('click','.confirm',function(){
           let t=$('title').text();
           let tempPrintTitles=_this.data.printTitles;
           if(_this.data.printTitles.length==0){
               _this.data.printTitles.unshift({content:_this.data.myContent,index:"1"});
           }else{
               let isExsit=false;
               for(let con of _this.data.printTitles){
                   if(con['content'] == _this.data.myContent){
                       if(+con['index']==1){
                           isExsit=true;
                           break;
                       }else if(+con['index']==2){
                           let obj=_this.data.printTitles[0]['content'];
                           _this.data.printTitles[0]['content']=_this.data.printTitles[1]['content'];
                           _this.data.printTitles[1]['content']=obj;
                           isExsit=true;
                           break;
                       }else {
                           _this.data.printTitles[2]['content'] = _this.data.printTitles[1]['content'];
                           _this.data.printTitles[1]['content'] = _this.data.printTitles[0]['content'];
                           _this.data.printTitles[0]['content'] = _this.data.myContent;
                           isExsit = true;
                           break;
                       }
                   }
               }
               if(!isExsit){
                   if(_this.data.printTitles.length>=2){
                       if(_this.data.printTitles.length==2){
                           _this.data.printTitles.push({content:'',index:"3"})
                       }
                       _this.data.printTitles[2]['content'] = _this.data.printTitles[1]['content'];
                   }
                   if(_this.data.printTitles.length>=1){
                       if(_this.data.printTitles.length==1){
                           _this.data.printTitles.push({content:'',index:"2"})
                       }
                       _this.data.printTitles[1]['content'] = _this.data.printTitles[0]['content'];
                   }
                   _this.data.printTitles[0]['content'] = _this.data.myContent;
               }
           }
           HTTP.post('user_preference',{action:'save',content:JSON.stringify(_this.data.printTitles)}).then(res=>{
                   if(res.succ == 1){
                       let isFrame=false;
                       $('iframe').each((index,obj)=>{
                           if(obj.src.indexOf(_this.data.key) != -1){
                               obj.focus();
                               console.log($(obj.contentDocument).find('title').text(_this.data.myContent));
                               $(obj.contentDocument).find('title').text(_this.data.myContent)
                               obj.contentWindow.print();
                               isFrame=true;
                           };
                       })
                       if(!isFrame){
                           $('title').text(_this.data.myContent);
                           window.print();
                           $('title').text(t);
                       }
                   }else{
                       _this.data.printTitles=tempPrintTitles;
                   }
                   PMAPI.sendToParent({
                       type: PMENUM.close_dialog,
                       key: _this.key,
                   })
               }
           );
           HTTP.flush();
       })
        _this.el.find('.global-search-input').on('focus',function(){
            if(_this.data.printTitles.length && _this.data.printTitles.length != 0){
                _this.el.find('.global-search-history').css('visibility','visible');
            }else{
                _this.el.find('.global-search-history').css('visibility','hidden');
            }
        }).on('blur',function(){
            setTimeout(()=>{
                _this.el.find('.global-search-history').css('visibility','hidden');
            },100)
        }).on('input',_.debounce(function(){
            let value=$(this).val();
            _this.data.myContent=value;
            if(value == ''){
                _this.el.find('.oneSelect').show();
            }else{
                _this.el.find('.oneSelect').each((index,obj)=>{
                    if($(obj).find('li').html().indexOf(value) != -1){
                        $(obj).show();
                    }else{
                        $(obj).hide();
                    }
                })
            }
        }))
    },
    beforeDestory: function () {
        this.el.find('.global-search-input').off();
        this.data.style.remove();
    }
}
export default SettingPrint