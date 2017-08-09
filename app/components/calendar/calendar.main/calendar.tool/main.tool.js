/**
 * Created by zj on 2017/8/9.
 */

import CalendarService from '../../../../services/calendar/calendar.service';
import Mediator from '../../../../lib/mediator';

export const MainTool = {

    getDifferent: function (unShowList, originalTableId) {
        let arr = ['mission','approve','remind'];
        let arr_original = [];
        let arr_unShow = [];
        for( let a of unShowList ){
            if( arr.indexOf( a ) === -1 ){
                arr_unShow.push( a );
            }
        }
        for( let a of originalTableId ){
            if( arr.indexOf( a ) === -1 ){
                arr_original.push( a );
            }
        }
        let btn = true;
        for( let a of arr_original ){
            if( arr_unShow.indexOf( a ) === -1 ){
                originalTableId = unShowList;
                btn = false;
                break;
            }
        }
        if( btn ){
            Mediator.emit('calendar-service: nextUnShowData', unShowList);
        }else {
            Mediator.emit('calendar-mainTool: nextCancelTableIds', unShowList);
        }
    }
};