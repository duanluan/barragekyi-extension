var barrageTime;
var barrage;

var isRun;

// setInterval(
function receiveBarrage() {
	// 是否讀取彈幕
	// if (localStorage.isReceiveBarrage == 'true') {
		// 彈幕時間是否存在，即首次運行
		if (typeof (barrageTime) == "undefined") {
			var today = new Date();
			var h = today.getHours();
			var m = today.getMinutes();
			var s = today.getSeconds();
			h = h >= 10 ? h : ('0' + h);
			m = m >= 10 ? m : ('0' + m);
			s = s >= 10 ? s : ('0' + s);
			barrageTime = new Date("2016/01/01 " + h + ":" + m + ":" + s);
		}
		
		// 讀取 XML 彈幕
		$.ajax({
			url : "http://live.bilibili.com/ajax/msg",
			type : "POST",
			dataType : "json",
			data : {
				// 真實讀取彈幕房間號
				"roomid" : localStorage.realReceiveRoomId
			},
			success : function(msg) {
				// 循環所有讀取到的彈幕
				for (var i = msg.data.room.length - 1; i >= 0; i++) {
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
						
						// 判斷當前頁面是否被允許發出通知
						//if (window.webkitNotifications.checkPermission() == 0) {
						//	var WebkitNotification = window.webkitNotifications.createNotification('../images/notice.png', title, barrage.text);
						//	WebkitNotification.show();
						//}
						//else {
						//	window.webkitNotifications.requestPermission();
						//}
						
						// 桌面通知
						var notification = new Notification(title, {
							body :barrage.text,
							// tag : 1,
							icon : '../images/notice.png'
						});

						// 定時關閉
						//notification.onshow=function(){
						//	setTimeout(function() {
						//		notification.close();
						//	}, 5000)
						//};

						// 彈幕時間重新賦值爲新彈幕時間，以便之後重新比對
						barrageTime = newBarrageTime;
						// 發現新彈幕後退出循環 思考：不一定要找到一個新彈幕就退出循環
						break;
					}
				}
			}
		});
		// }
	// 標識符判斷是否繼續運行
	if(isRun == false){
		return;
	}
	// 遞歸替代 setInterval
	setTimeout(receiveBarrage, 500);
}
// , 500);
