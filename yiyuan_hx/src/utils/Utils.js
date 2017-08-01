// var underscore = require('underscore');
/**
 * Created by apple on 17/1/3.
 */
/**
 *url上加参数  支持中文
 * @param url
 * @param obj
 * @returns {string}
 */
import appConfig from 'utils/AppConfig';
import weexModules from 'utils/WeexModules';

function getUrlJoinParams(url, obj) {
    var result = url + '?';
    for (var p in obj) {
        if (typeof ( obj[p]) == 'function') {
            continue;
        } else {
            result += encodeURI(p) + '=' + encodeURI(obj[p]) + '&';
        }
    }
    result = result.substring(0, result.length - 1);
    return result;
};

/**
 *从url解析出参数，返回的是一个对象,支持中文
 * @param url
 * @returns {{}}
 */
function parseUrlParams(url) {
    var paramters = {};
    var start = url.indexOf('?');//找到第一个？的位置
    if (start >= 0) {
        url = url.substring(start + 1); //去掉？
    }
    var paramterStr = url.split("&"); //字符分割

    paramterStr.forEach(function (item, index) {
        var obj = item.split('=');
        if (obj.length == 2) {

            paramters[decodeURI(obj[0])] = decodeURI(obj[1]);
        }
    });

    return paramters;
};

function isNull(p) {
    if (!p || p === undefined || p === '' || p === [] || p === {} || p === 0 || p === NaN ) {
        return true;
    }
    return false;
};


/**
 * 判断字符串全是数字
 * @param str
 * @returns {boolean}
 */
function isNumber(str) {
    if (str == undefined || str == null) {
        return false;
    }
    var re = new RegExp("^\\d+$");
    return re.test(str);


};

/**
 * 判断是不是手机号
 * @param str
 * @returns {boolean}
 */
function isPhoneNumber(str) {
    if (str == undefined || str==null) {
        return false;
    }
    var re = new RegExp("^1[34578]{1}\\d{9}$");
    return re.test(str);
};
/**
 * 简单判断是否是身份证
 * @param str
 * @returns {boolean}
 */
function isDentityCard(id_card){
    // if (id_card == undefined || !id_card) {
    //     return false;
    // }
    // let reg=/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    // let re = new RegExp(reg);
    // return re.test(id_card);

    id_card = id_card.toUpperCase();
    if (id_card.length != 18) { // 只能是18位
        return false;
    }

     // 取出本体码
     let id_card_base = id_card.substr(0, 17);

     // 取出校验码
     let verify_code = id_card.substr(17, 1);

     // 加权因子
    let factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    // // 校验码对应值
     let verify_code_list = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];

     // 根据前17位计算校验码
    let total = 0;
    for (let i = 0; i < 17; i++) {
        console.log("cody++++++total="+total);
        total += parseInt(id_card_base.substr(i, 1) * factor[i]);
    }

    // 取模
    let mod = total % 11;
    console.log("cody++++++mod="+mod);
     // 比较校验码
     if (verify_code == verify_code_list[mod]) {
        return true;
    } else {
        return false;
    }
}

/**
 * 是不是数字验证码 可以指定验证码的位数，默认是4
 * @param auth_code
 * @param num 验证码位数，默认是4 可以不传
 */
function isAuthCode(auth_code, num) {
    if (num == undefined) {
        num = 4;
    }
    var re = new RegExp("^\\d{" + num + "}$");
    return re.test(auth_code);
};
/**
 * {a:1,c:2,b:3} => a=1&c=2&b=3
 * 对象转string objectToString(obj,[separator]) ;//separator默认是& 分隔符
 * @param obj
 * @returns {string}
 */
function objectToString(obj) {
    var separator = arguments[1] || '&';
    var result = '';
    for (var p in obj) {
        if (typeof ( obj[p]) == 'function') {
            continue;
        } else {
            result += p + '=' + obj[p] + separator;
        }
    }
    result = result.substring(0, result.length - 1);
    return result;
};

/**
 *  a=1&c=2&b=3 =>{a:1,c:2,b:3}
 * @param str
 * @returns {{}}
 */
function stringToObject(str) {
    var paramters = {};
    var separator = arguments[1] || '&';
    var paramterStr = str.split(separator); //字符分割

    paramterStr.forEach(function (item, index) {
        var obj = item.split('=');
        if (obj.length == 2) {
            paramters[obj[0]] = obj[1];
        }
    });

    return paramters;
};

function navConvert(vm,iosH,androidH) {
    var config = vm.$getConfig();
    var env = config.env;
    if (env.platform == 'iOS') {
        var scale = env.scale;
        var deviceWidth = env.deviceWidth / scale;
        return iosH * 750.0 / deviceWidth;
    } else {
        return androidH;
    }
}

//针对ios 状态栏高度
function statusBarHeight(vm) {
   return navConvert(vm, 20, 0);
};
//导航栏 除了状态栏的高度
function navbarHeight(vm,androidH = 88) {
  return navConvert(vm, 44, androidH);
}

//导航栏总高度
function navHeight(vm,androidH) {
   return navConvert(vm, 64, androidH);
}


/**
 * 判断字符串以什么开头
 */
function startsWith(str, pre) {
    let reg = new RegExp("^"+pre);
    return reg.test(str);
}


/**
 * 转为boolean值 0 字符串 false 等都转boolean
 * @param value
 */
function convertBoolean(value) {
    if (typeof value == 'boolean') {
        return value;
    } else if (typeof value == 'number') {
        return value>0;
    } else if (typeof value == 'string') {
        if (value == 'false') {
            return false;
        } else {
            return true;
        }
    } else if (typeof value == 'object'){
        return !value?false:true;
    }
    return false;

}

function getTimeStr(time) {
    var date = new Date(parseInt(time)),
    y = date.getFullYear(),
    m = date.getMonth() + 1,
    d = date.getDate();
    var result = y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + date.toTimeString().substr(0, 8);
    return result;
}

function checkCallbackData(res){
    var result= true;
    if(res==null || res === undefined || res === ''){
        result=false;
    }else{
        console.log("res:"+res+" error_code:"+res.error_code);
        if (res.error_code == -100) {//需要登录
            result=false;
            weexModules.gotoPage(appConfig.getJsServerAddress() + 'login.js');
        }else if(res.error_code == -101){//帐号被封
            result=false;
        }else if(res.error_code == -102){//设备被封
            result=false;
        }else if(res.error_code!=0&&!this.isNull(res.error_url)){
            weexModules.openAppFunction(res.error_url);
            result=false;
        }
    }
    return result;
}

export  {getUrlJoinParams, parseUrlParams, isNull, isNumber,
    isAuthCode, isPhoneNumber, objectToString, stringToObject, statusBarHeight, navbarHeight,navHeight,isDentityCard, startsWith,getTimeStr,checkCallbackData};
