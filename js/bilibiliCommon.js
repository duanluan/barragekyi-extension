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
        msg: barrage,
        color: "0xff6868"
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