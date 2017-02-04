/**
 * 替換字符串第一個匹配字符
 * @param str 需要替換的字符串
 * @param regex 匹配字符串
 * @param replacement 匹配字符串替換后的字符串
 * @returns {string} 替換后的字符串
 */
function replaceFirst(str, regex, replacement) {
    var index = str.indexOf(regex);
    if (index != -1) {
        return str.substr(0, index) + replacement + str.substr(index + 1, str.length);
    }
    return str;
}

/**
 * 拼接 URL 參數
 * @param paramMap URL 集合
 * @returns {string} URL 參數
 */
function mosaicUrlParam(paramMap) {
    var result = "";
    if (paramMap != null && paramMap != undefined && typeof paramMap == "object") {
        $.each(paramMap, function (key, value) {
            result += "&" + key + "=" + value;
        });
    }
    return replaceFirst(result, "&", "?");
}

/**
 * 發送請求
 * @param url 請求地址
 * @param type 請求類型，"GET" 或者 "POST"
 * @param dataType 返回值類型
 * @param paramMap 請求參數
 * @param successFunction 成功後執行的回調函數
 * @returns {*} 請求返回值
 */
function request(url, type, dataType, paramMap, successFunction) {
    if (type == "GET") {
        $.ajax({
            url: url + mosaicUrlParam(paramMap),
            dataType: dataType,
            type: type,
            async: false,
            success: successFunction
        });
    } else if (type == "POST") {
        $.ajax({
            url: url,
            type: type,
            dataType: dataType,
            data: paramMap,
            async: false,
            success: successFunction
        });
    }
}

/**
 *
 * 獲取當前時間
 *
 * @returns {string} 當前時間，格式為 yyyy-MM-dd HH:mm:ss
 */
function nowTime() {
    var today = new Date();
    var y = today.getFullYear();
    var M = today.getMonth() + 1;
    var d = today.getDate();
    var H = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    M = M > 10 ? M : '0' + M;
    d = d > 10 ? d : '0' + d;
    H = H >= 10 ? H : '0' + H;
    m = m >= 10 ? m : '0' + m;
    s = s >= 10 ? s : '0' + s;
    return y + "-" + M + "-" + d + " " + H + ":" + m + ":" + s;
}

/**
 * 獲取當前時間，返回 Date 類型
 * @returns {Date}
 */
function nowDate() {
    return new Date(Date.parse(nowTime().replace(/-/g, "/")));
}

/**
 * 生成固定或者不固定位數的隨機數
 * @param isFixedLength 是否固定位數
 * @param min 如果非固定位數，則為最小位數
 * @param max 最大位數
 * @returns {string} 隨機數
 */
function randomStr(isFixedLength, min, max) {
    var str = "",
        range = min,
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    if (isFixedLength) {
        range = Math.round(Math.random() * (max - min)) + min;
    }
    for (var i = 0; i < range; i++) {
        pos = Math.round(Math.random() * (arr.length - 1));
        str += arr[pos];
    }
    return str;
}

/**
 * 將字符串以 Hex 格式編碼
 * @returns {string}
 */
String.prototype.hexEncode = function () {
    // var hex, i;
    // var result = "";
    // for (i=0; i<this.length; i++) {
    //     hex = this.charCodeAt(i).toString(16);
    //     result += ("000"+hex).slice(-4);
    // }
    // return result
    var val = "";
    for (var i = 0; i < this.length; i++) {
        if (val == "")
            val = this.charCodeAt(i).toString(16);
        else
            val += this.charCodeAt(i).toString(16);
    }
    return val;
}

// /**
//  * 將字符串以 Hex 解碼
//  * @returns {string}
//  */
// String.prototype.hexDecode = function(){
//     var j;
//     var hexes = this.match(/.{1,4}/g) || [];
//     var back = "";
//     for(j = 0; j<hexes.length; j++) {
//         back += String.fromCharCode(parseInt(hexes[j], 16));
//     }
//     return back;
// }

/**
 * 將字符串轉換為十六進制
 * @param str
 * @returns {string}
 */
function stringToHex(str) {
    var val = "";
    for (var i = 0; i < str.length; i++) {
        if (val == "")
            val = str.charCodeAt(i).toString(16);
        else
            val += str.charCodeAt(i).toString(16);
    }
    return val;
}

// function stringAsUnicodeEscape(input) {
//     function pad_four(input) {
//         var l = input.length;
//         if (l == 0) return '0000';
//         if (l == 1) return '000' + input;
//         if (l == 2) return '00' + input;
//         if (l == 3) return '0' + input;
//         return input;
//     }
//     var output = '';
//     for (var i = 0, l = input.length; i < l; i++)
//         output += '\\u' + pad_four(input.charCodeAt(i).toString(16));
//     return output;
// }