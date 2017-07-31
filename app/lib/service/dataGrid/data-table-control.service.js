export const dgcService = {
    /*16进制颜色转为RGB格式*/
    colorRgb: function (str,opcity) {
        var sColor = ''+str.toLowerCase();
        if(sColor){
            if( sColor.length === 4 ){
                var sColorNew = "#";
                for(var i=1; i<4; i+=1){
                    sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));
                }
                sColor = sColorNew;
            }
            //处理六位的颜色值
            var sColorChange = [];
            for( var i=1; i<7; i+=2 ){
                sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));
            }
            return "rgba(" + sColorChange.join(",")+","+opcity + ")";
        }else{
            return sColor;
        }
    }
}