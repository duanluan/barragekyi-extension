// 用於和獲取到的彈幕比對的彈幕時間
var barrageTime;
// 是否運行
var isRun;
// 通知 Tag，防止通知泄停；
var notificationTag;
var notificationTags;

function receiveBarrage() {
    // 首次運行
    if (typeof (barrageTime) == "undefined") {
        var today = new Date();
        var h = today.getHours();
        var m = today.getMinutes();
        var s = today.getSeconds();
        h = h >= 10 ? h : ('0' + h);
        m = m >= 10 ? m : ('0' + m);
        s = s >= 10 ? s : ('0' + s);
        barrageTime = new Date("2016/01/01 " + h + ":" + m + ":" + s);

        notificationTags = new Array();
        notificationTag = 0;
    }
    // 讀取彈幕
    getBarrages(localStorage.realReceiveRoomId, function (msg) {
        var barrage;
        // 循環所有讀取到的彈幕
        for (var i = msg.data.room.length - 1; i >= 0; i--) {
            barrage = msg.data.room[i];
            // 新彈幕時間
            var newBarrageTime = new Date("2016/01/01 " + barrage.timeline.substring(11, barrage.timeline.length));
            // 如果新彈幕時間大於彈幕時間，即確認爲新彈幕
            if (newBarrageTime > barrageTime) {
                // 拼接顯示內容
                var title = '';
                if (barrage.vip != '0') {
                    title += '[爺]';
                }
                else if (barrage.isadmin == '1') {
                    title += '[管]';
                }
                // + "(" + barrage.uid + ")"
                title += barrage.nickname;

                var notification = new Notification(title, {
                    body: barrage.text,
                    tag: notificationTag,
                    icon: '../images/notice.png'
                });

                // 防止通知只顯示三條，把最舊的一條刪掉
                notificationTags.push(notification);
                if (notificationTag >= 3) {
                    notificationTags[notificationTag - 3].close();
                }
                notificationTag++;

                // 彈幕時間重新賦值爲新彈幕時間，以便之後重新比對
                barrageTime = newBarrageTime;
            }
        }
    });
    // 標識符判斷是否繼續運行
    if (isRun == false) {
        return;
    }
    // 遞歸替代 setInterval
    setTimeout(receiveBarrage, 500);
}