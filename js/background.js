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
        // 獲取當前時間（Date）
        barrageTime = nowDate();

        // 初始化通知標籤
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
            var newBarrageTime = new Date(Date.parse(barrage.timeline.replace(/-/g, "/")));
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
                    // 關閉新通知前數第三個通知
                    notificationTags[notificationTag - 3].close();
                    // 以下爲可選操作，讓通知標籤和通知數組一直遞增沒事
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