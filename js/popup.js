// 獲取後臺對象
var backgroundPage = chrome.extension.getBackgroundPage();

// 獲取參數
var sendRoomId = document.getElementById('send_room_id');
var receiveRoomId = document.getElementById('receive_room_id');
var isReceiveBarrage = document.getElementById('is_receive_barrage');
var sendMessage = document.getElementById('send_message');
var bilibiliPyUsername = document.getElementById('bilibili_py_username');
var sendCookiesForBilibiliPy =  document.getElementById('send_cookies_for_bilibili_py');

// 讀取彈幕 interval id
var receiveBarrageId;

// 獲取并設置發送房間號
sendRoomId.value = localStorage.sendRoomId || '';
//獲取并設置接收房間號
receiveRoomId.value = localStorage.receiveRoomId || '';
// 獲取并設置是否接收彈幕
if (localStorage.isReceiveBarrage == isReceiveBarrage.options[0].value) {
	// 改變“是否接收彈幕”的選中爲“是”
	isReceiveBarrage.options[0].selected = true;
	// 啓動後臺讀取彈幕
	backgroundPage.isRun = true;
	backgroundPage.receiveBarrage();
}
else {
	// 改變“是否接收彈幕”的選中爲“否”
	isReceiveBarrage.options[1].selected = true;
	// 關閉後臺讀取彈幕
	backgroundPage.isRun = false;
}
// 獲取并設置 Bilibili Py 賬號
bilibiliPyUsername.value = localStorage.bilibiliPyUsername || '';

// 發送房間號按下按鍵事件
sendRoomId.onkeyup = function() {
	// 顯示的發送房間號
	localStorage.sendRoomId = sendRoomId.value;
	// 將發送房間號轉換為真實房間號
	$.ajax({
		url : 'http://live.bilibili.com/' + sendRoomId.value,
		type : 'GET',
		success : function(urlContent) {
			localStorage.realSendRoomId = urlContent.substring(urlContent.indexOf('ROOMID = ') + 'ROOMID = '.length, urlContent.indexOf(';', urlContent.indexOf('ROOMID = ')));
		}
	});
}

function sendBarrage() {
	// 發送彈幕
	$.ajax({
		url : 'http://live.bilibili.com/msg/send',
		type : 'POST',
		data : {
			// 從保存數據中取真實房間號
			'roomid' : localStorage.realSendRoomId,
			'msg' : sendMessage.value
		},
		success : function(returnValue) {
			sendMessage.value = '';
		}
	});
}

// “發送彈幕”文本框中按鍵
sendMessage.onkeypress = function() {
	// 回車發送彈幕
	if (window.event.keyCode == 13) {
		sendBarrage();
	}
}

// 接收房間號按下按鍵事件
receiveRoomId.onkeyup = function() {
	// 顯示的接收房間號
	localStorage.receiveRoomId = receiveRoomId.value;
	// 將接收房間號轉換為真實房間號
	$.ajax({
		url : 'http://live.bilibili.com/' + receiveRoomId.value,
		type : 'GET',
		success : function(urlContent) {
			localStorage.realReceiveRoomId = urlContent.substring(urlContent.indexOf('ROOMID = ') + 'ROOMID = '.length, urlContent.indexOf(';', urlContent.indexOf('ROOMID = ')));
		}
	});
}

// 是否接受彈幕複選框點擊事件
isReceiveBarrage.onchange = function() {
	// 保存是否接收彈幕
	localStorage.isReceiveBarrage = isReceiveBarrage.value;
	// 獲取是否接收彈幕，這一步並不改變下拉框的值，而是保證下拉框的值改變後不關閉頁面就發送彈幕生效
	if (localStorage.isReceiveBarrage == isReceiveBarrage.options[0].value) {
		// 啓動後臺讀取彈幕
		backgroundPage.isRun = true;
		backgroundPage.receiveBarrage();
	}
	else {
		// 關閉後臺讀取彈幕
		backgroundPage.isRun = false;
	}
}

// Bilibili Py 賬號按下按鍵事件
bilibiliPyUsername.onkeyup = function(){
	localStorage.bilibiliPyUsername = bilibiliPyUsername.value;
}

// 發送 Bilibili 的 Cookies 給 Bilibili Py
sendCookiesForBilibiliPy.onclick = function() {
	chrome.cookies.getAll(
		{
			url:'http://bilibili.com'
		},
		function(cookies){
			if(cookies != undefined){
				var cookieStr;
				cookies.forEach(function(cookie){
					cookieStr += cookie.name + "=" + cookie.value + ";";
				});
				cookieStr = cookieStr.substring(0, cookieStr.length - 1);
				
				var xhr = new XMLHttpRequest();
				xhr.open("GET", "http://127.0.0.1:8080/BilibiliPy/api/saveCookie?username=" + bilibiliPyUsername.value + "&cookie=" + cookieStr, true);
				xhr.onreadystatechange = function() {
					if (xhr.readyState == 4) {
						if(xhr.responseText != ""){
							// JSON解析器不會執行攻擊者設計的腳本.
							var data = JSON.parse(xhr.responseText);
							if(data == true){
								alert("Cookie 發送成功！");
							}else{
								alert("Cookie 已存在或 Bilibili Py 賬號不存在！");
							}
						}else {
							alert("Bilibili Py 連接失敗！");
							window.open('http://duanluan.top/register.jsp');
						}
					}
				}
				// xhr.onreadystatechange = handler;
				xhr.send();
			}else{
				alert('請先登錄嗶哩嗶哩彈幕視頻網！');
				window.open('https://passport.bilibili.com/login');
			}
		}
	)
}