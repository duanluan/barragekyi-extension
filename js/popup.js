// 獲取後臺對象
var backgroundPage = chrome.extension.getBackgroundPage();


// 獲取參數
var sendRoomIdTxt = document.getElementById('send_room_id_txt');
var receiveRoomIdTxt = document.getElementById('receive_room_id_txt');
var isReceiveBarrageSelect = document.getElementById('is_receive_barrage_select');
var sendMessageTxt = document.getElementById('send_message_txt');


// 獲取并設置發送房間號
sendRoomIdTxt.value = localStorage.sendRoomId || '';
//獲取并設置接收房間號
receiveRoomIdTxt.value = localStorage.receiveRoomId || '';
// 獲取并設置是否接收彈幕
if (localStorage.isReceiveBarrage == isReceiveBarrageSelect.options[0].value) {
    // 改變“是否接收彈幕”的選中爲“是”
    isReceiveBarrageSelect.options[0].selected = true;
    // 啓動後臺讀取彈幕
    backgroundPage.isRun = true;
    // 讀取彈幕
    backgroundPage.receiveBarrage();
}
else {
    // 改變“是否接收彈幕”的選中爲“否”
    isReceiveBarrageSelect.options[1].selected = true;
    // 關閉後臺讀取彈幕
    backgroundPage.isRun = false;
}


// “發送房間號”文本框按下按鍵事件
sendRoomIdTxt.onkeyup = function () {
    // 顯示的發送房間號
    localStorage.sendRoomId = sendRoomIdTxt.value;
    // 將發送房間號轉換為真實房間號
    localStorage.realSendRoomId = getRealRoomId(sendRoomIdTxt.value);
}

// “發送彈幕”文本框中按鍵時間
sendMessageTxt.onkeypress = function () {
    // 回車
    if (window.event.keyCode == 13) {
        // 發送彈幕
        sendBarrage(localStorage.realSendRoomId, sendMessageTxt.value, function (returnValue) {
            sendMessageTxt.value = '';
        });
    }
}

// “接收房間號”文本框按下按鍵事件
receiveRoomIdTxt.onkeyup = function () {
    // 顯示的接收房間號
    localStorage.receiveRoomId = receiveRoomIdTxt.value;
    // 將接收房間號轉換為真實房間號
    localStorage.realReceiveRoomId = getRealRoomId(receiveRoomIdTxt.value);
}

// “是否接受彈幕”複選框點擊事件
isReceiveBarrageSelect.onchange = function () {
    // 保存是否接收彈幕
    localStorage.isReceiveBarrage = isReceiveBarrageSelect.value;
    // 獲取是否接收彈幕，這一步並不改變下拉框的值，而是保證下拉框的值改變後不關閉頁面就發送彈幕生效
    if (localStorage.isReceiveBarrage == isReceiveBarrageSelect.options[0].value) {
        // 啓動後臺讀取彈幕
        backgroundPage.isRun = true;
        // 讀取彈幕
        backgroundPage.receiveBarrage();
    }
    else {
        // 關閉後臺讀取彈幕
        backgroundPage.isRun = false;
    }
}