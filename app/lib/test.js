// let data = {name: 'kindeng'};
// observe(data);
// data.name = 'dmq'; // 哈哈哈，监听到值变化了 kindeng --> dmq

export const DataTest = {
    observe: function observe(data) {
        if (!data || typeof data !== 'object') {
            return;
        }
        // 取出所有属性遍历
        Object.keys(data).forEach(function(key) {
            DataTest.defineReactive(data, key, data[key]);
        });
    },

    defineReactive: function defineReactive(data, key, val) {
        DataTest.observe(val); // 监听子属性
        Object.defineProperty(data, key, {
            enumerable: true, // 可枚举
            configurable: false, // 不能再define
            get: function() {
                return val;
            },
            set: function(newVal) {
                console.log(newVal);
                val = newVal;
            }
        });
    }

};

// function observe(data) {
//     if (!data || typeof data !== 'object') {
//         return;
//     }
//     // 取出所有属性遍历
//     Object.keys(data).forEach(function(key) {
//         defineReactive(data, key, data[key]);
//     });
// }
//
// function defineReactive(data, key, val) {
//     observe(val); // 监听子属性
//     Object.defineProperty(data, key, {
//         enumerable: true, // 可枚举
//         configurable: false, // 不能再define
//         get: function() {
//             return val;
//         },
//         set: function(newVal) {
//             console.log('哈哈哈，监听到值变化了 ', val, ' --> ', newVal);
//             val = newVal;
//         }
//     });
// }

