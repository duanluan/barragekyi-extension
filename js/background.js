// 用於和獲取到的彈幕比對的彈幕時間
var barrageTime;
// 是否讀取彈幕
var isReceiveBarrage;
// 通知 Tag，防止通知泄停；
var notificationTag;
var notificationTags;
// 通知顯示時間數組
var notificationTimes;

function receiveBarrage() {
    // 標識符判斷是否繼續運行
    if (isReceiveBarrage == false) {
        return;
    }

    // alert(barrageTime);
    // 首次運行
    if (barrageTime == undefined) {
        // 獲取當前時間（Date）
        barrageTime = nowDate();

        // 初始化通知標籤
        notificationTags = new Array();
        notificationTag = 0;
        notificationTimes = new Array();
    }

    // 讀取彈幕
    getBarrages(localStorage.realReceiveRoomId, function (msg) {
        var barrage;
        // 循環所有讀取到的彈幕
        for (var i = msg.data.room.length - 1; i >= 0; i--) {
            barrage = msg.data.room[i];
            // 新彈幕時間
            var newBarrageTime = parseDate(barrage.timeline);
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

                // 彈幕時間重新賦值爲新彈幕時間，以便之後重新比對
                barrageTime = newBarrageTime;

                // 記錄通知 Tag，以便關閉通知
                notificationTags.push(notification);
                // 記錄通知顯示的時間，以便清除過舊的通知
                notificationTimes.push(nowDate());
                // 防止通知只顯示三條，把最舊的一條刪掉
                if (notificationTag >= 3) {
                    // // 關閉新通知前數第三個通知
                    notificationTags[notificationTag - 3].close();
                }
                notificationTag++;
            }else{
                // 接口數據按照彈幕發送順序排列，所以如果無新彈幕即跳出循環，節省資源
                break;
            }
        }
    });

    // 未找到讀取正在顯示的 HTML5 桌面通知的解決方案，暫時清除 15 秒（大約爲桌面通知顯示的最長時間）之前的資源
    for(var i = 0;i<notificationTimes.length;i++) {
        var timeDiff = nowDate().getTime() - notificationTimes[i].getTime();
        if(timeDiff != 0 && timeDiff/1000>15) {
            notificationTags.splice(i, 1);
            notificationTag--;
            notificationTimes.splice(i, 1);
        }
    }

    // 遞歸替代 setInterval
    setTimeout(receiveBarrage, 500);
}