/**
 * 獲取用戶信息
 * @param successFunction
 */
function getUserInfo(successFunction){
    request("http://api.live.bilibili.com/User/getUserInfo", "GET", "json", undefined, successFunction);
}

/**
 *
 * 發送彈幕
 * @param realRoomId 真實房間號
 * @param barrage 彈幕
 * @param successFunction
 */
function sendBarrage(realRoomId, barrage, successFunction) {
    request("http://live.bilibili.com/msg/send", "POST", undefined, {
        roomid: realRoomId,
        msg: barrage
    }, successFunction);
}

/**
 * 房間號轉換為真實房間號
 * @param roomId 房間號
 * @returns {string} 真實房間號
 */
function getRealRoomId(roomId) {
    var realRoomId;
    request("http://live.bilibili.com/" + roomId, "GET", undefined, undefined, function (urlContent) {
        realRoomId = urlContent.substring(urlContent.indexOf('ROOMID = ') + 'ROOMID = '.length, urlContent.indexOf(';', urlContent.indexOf('ROOMID = ')));
    });
    return realRoomId;
}

/**
 * 讀取彈幕
 * @param realRoomId 真實房間號
 * @param successFunction
 */
function getBarrages(realRoomId, successFunction) {
    request("http://live.bilibili.com/ajax/msg", "POST", "json", {roomid: realRoomId}, successFunction);
}

/**
 * 獲取彈幕服務器地址
 * @param realRoomId 真實房間號
 */
function getServerUrl(realRoomId){
    var serverUrl;
    request("http://live.bilibili.com/api/player?id=cid:"+realRoomId,"GET",undefined,undefined,function (data) {
        var startPosition = data.indexOf("<server>")+8;
        var endPosition = data.indexOf("</server>",startPosition);
        serverUrl =  data.substring(startPosition, endPosition);
    });
    return serverUrl;
}