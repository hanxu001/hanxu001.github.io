export function isNumber(value) {
  var pattern = /[0-9]+/;
  if (pattern.test(value)) {
    return '纯数子';
  } else {
    return '不是纯数字，含有别的字符';
  }
}

export function isTrue(value) {
  if (!value || value=='' || value=="false" || value == 'null'|| value==[] || value == {}) {
    return false;
  }
  return true;
};

export function convertTime(time) {
    var now = new Date(time);
    var month = now.getMonth() + 1;
    var date = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    // return month + "月" + date + "日" + hour + ":" + minute + ":" + second;
    return month + "月" + (date<10?'0'+date:date) + "日" + hour + ":" +(minute<10?'0'+minute:minute) + ":" +(second<10?'0'+second:second);
}