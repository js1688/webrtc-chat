/**
 * 将时间戳转换成日期格式
 * @param {long,时间戳} timestamp 
 */
function timeToYYYY_MM_DD_HH_mm_ss(timestamp) {
        if(("" + timestamp).length == 10){
            timestamp = timestamp * 1000;
        }
        var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = date.getDate() < 10 ?  '0'+date.getDate()+ ' ' : date.getDate()+ ' ';
        var h = date.getHours() < 10 ? '0'+date.getHours()+ ':' : date.getHours()+ ':';
        var m = date.getMinutes() < 10 ? '0'+date.getMinutes()+ ':' : date.getMinutes()+ ':';
        var s = date.getSeconds()< 10 ? '0'+date.getSeconds() : date.getSeconds();
        return Y+M+D+h+m+s;
}

/**
 * ArrayBuffer转为字符串，参数为ArrayBuffer对象
 * @param {ArrayBuffer} buf 
 */
function ab16str(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
}
  
/**
 * 字符串转为ArrayBuffer对象，参数为字符串
 * @param {string} str 
 */
function str16ab(str) {
  var buf = new ArrayBuffer(str.length * 2); // 每个字符占用2个字节
  var bufView = new Uint16Array(buf);
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

/**
 * 字符编码数值对应的存储长度：
 * UCS-2编码(16进制) UTF-8 字节流(二进制)
 * 0000 - 007F       0xxxxxxx （1字节）
 * 0080 - 07FF       110xxxxx 10xxxxxx （2字节）
 * 0800 - FFFF       1110xxxx 10xxxxxx 10xxxxxx （3字节）
 */
String.prototype.getBytesLength = function() {
  var totalLength = 0;
  var charCode;
  for (var i = 0; i < this.length; i++) {
    charCode = this.charCodeAt(i);
    if (charCode < 0x007f)  {
        totalLength++;
    } else if ((0x0080 <= charCode) && (charCode <= 0x07ff))  {
        totalLength += 2;
    } else if ((0x0800 <= charCode) && (charCode <= 0xffff))  {
        totalLength += 3;
    } else{
        totalLength += 4;
    }
  }
  return totalLength;
}