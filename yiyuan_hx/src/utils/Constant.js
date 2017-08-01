/**
 * Created by apple on 2017/4/10.
 */


//常量定义
let constant = {
    amount:{
        '打工族': {
            keys:[500,1000,2000,3000,5000, 10000],
            items:[500,1000,2000,3000,5000, 10000]
        },
        "个体户": {
            keys:[10000, 20000, 50000],
            items:[10000, 20000, 50000]
        },
        "企业主" :{
            keys:[20000, 50000],
            items:[20000, 50000]
        }
    },
    period:{
        '打工族': {
            keys: ['3d',  '7d',    '1m',    '3m',    '6m'],
            items:['3天', '一周内', '一月内' , '3个月', '6个月']
        },
        "个体户": {
            keys: ['6m',   '9m',   '12m',   '24m',   '36m'],
            items:['6个月', '9个月', '12个月', '24个月', '36个月']
        },
        "企业主" :{
            keys: ['6m',   '9m',   '12m',   '24m',   '36m'],
            items:['6个月', '9个月', '12个月', '24个月', '36个月']
        }
    },
    job:{
        keys:[ 1,       2,        3],
        items:['打工族', '个体户', '企业主']
    },
    credit_card_status:{
        keys:[1,2],
        items:['有','没有']
    },
    mobile_usage_time:{
        keys:[1,2],
        items:['1~5个月','6个月以上']
    }
};


/**
 * filed  amount 金额数组 period 期限 job 职业  credit_card_status 信用卡 mobile_usage_time 手机使用状态
 * @param filed
 * @param job  '打工族', '个体户', '企业主'
 * @returns {null}
 */
export function getConstantByFiled(filed, job=null) {
    var data = null;
    if (constant.hasOwnProperty(filed)) {
        data = constant[filed];
        if (job && data.hasOwnProperty(job)) {
            return data[job];
        }
        return constant[filed];
    }
    return null;
}

/**
 * 根据服务器给的数据找到对应的item值
 * @param filed
 * @param key
 */
export function getDataByfiledAndKey(filed, key) {
    let resultIndex = -1;
    if (constant.hasOwnProperty(filed)) {
       let obj =  constant[filed];
       obj.keys.forEach(function (item, index) {
           if (item == key){
               resultIndex = index;
           }
       });

       if (resultIndex >=0 ){
           return obj.items[resultIndex];
       } else {
           return obj.items[0];
       }
    }
    return null;
}