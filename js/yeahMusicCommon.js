var modulus = "00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7";
var nonce = "0CoJUm6Qyw8W8jud";
var pubKey = "010001";

/**
 * AES 加密
 * @param text
 * @param secretKey
 * @returns {*|string}
 */
function aesEncrypt(text, secretKey) {
    pad = 16 - text.length % 16;
    // pad < 32 轉換為 ASCII 后不可顯
    var data = text + String.fromCharCode(pad).repeat(pad);

    // AES 加密前處理
    // data = CryptoJS.enc.Utf8.parse(data);
    var key = secretKey;//CryptoJS.enc.Utf8.parse(secretKey);
    var iv = "0102030405060708";//CryptoJS.enc.Utf8.parse("0102030405060708");

    var encrypted = CryptoJS.AES.encrypt(data, key, {iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7});
    return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
}

/**
 * RSA 加密
 * @param text
 * @param publicKey
 * @param modulus
 * @returns {*}
 */
function rsaEncrypt(text, publicKey, modulus) {
    // 反轉字符串
    text = text.split("").reverse().join("");
    // 進行運算并將結果轉換為十六進制（？？？）
    var rs = modExp(new bigInt(text.hexEncode(), 16), new bigInt(publicKey, 16), new bigInt(modulus, 16)).toString(16);
    // 指定字符串長度為 256，字符右對齊，前面填充 0
    if (rs.length < 256) {
        rs = "0".repeat(256 - rs.length) + rs;
    } else {
        rs = rs.substring(rs.length - 256);
    }
    return rs;
}

/**
 * 計算 a ^ b % n
 * @param a
 * @param b
 * @param n
 * @returns {bigInt}
 */
function modExp(a, b, n) {
    d = new bigInt(1);
    k = b.toString(2);
    for (i = 1; i <= k.length; i++) {
        if (k[k.length - i] == '1') {
            d = d.times(a).mod(n);
        }
    }
    return d;
}

function encrypted_request(paramMap) {
    // 將 Map 對象參數轉換為字符串
    var text = JSON.stringify(paramMap);
    // 生成 16 位字符串作為秘鑰
    var secretKey = randomStr(false, 16);
    // 處理參數
    if (paramMap != null && paramMap != undefined && typeof paramMap == "object") {
        // 兩次 AES 加密生成參數
        var params = aesEncrypt(aesEncrypt(text, nonce), secretKey);
        // // 一次 RAS 加密生成 encSecKey
        var encSecKey = rsaEncrypt(secretKey, pubKey, modulus);
        return {
            params: params,
            encSecKey: encSecKey
        };
    }
}

function main() {
    req = {
        "offset": 0,
        "uid": '96619744',
        "limit": 10,
        "csrf_token": 'c5b81ac32a5af6f91e2902e56d0a4a1f'
    }

    var data = encrypted_request(req);

    console.log(data.params);
    console.log(data.encSecKey);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://music.163.com/weapi/user/playlist?csrf_token=c5b81ac32a5af6f91e2902e56d0a4a1f", true);
    // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("Access-Control-Allow-Origin", "http://music.163.com");
    // xhr.setRequestHeader("Origin", "http://music.163.com");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            alert(xhr.responseText);
        }
    }
    xhr.send();
}