if (typeof liveChat === 'undefined') {
	window.liveChat = {};
}

liveChat = {
	i: false,
	form: null,
	chatBox: null,
	messageBox: null,
	type: null,
	typeId: null,
	lastTime: 0,
	messagesLimit: 20,

	init: function (messagesLimit) {
		liveChat.chatBox = document.getElementById('livechat-chatbox');
		liveChat.form = document.getElementById('livechat-form');
		liveChat.messageBox = liveChat.form.elements['livechat-message-box'];
		liveChat.type = liveChat.form.elements['livechat-type'].value;
		liveChat.typeId = liveChat.form.elements['livechat-type-id'].value;
		liveChat.messagesLimit = messagesLimit;
		liveChat.i = true;
		liveChat.attachEvents();
		liveChat.checkNewMessages()
	},

	attachEvents: function () {
		if(!liveChat.i) {
			return false;
		}
		liveChat.form.addEventListener('submit', function(event) {
			event.preventDefault();
			var message = this.elements['livechat-message-box'].value.trim();
			if(message.length > 0) {
				this.elements['livechat-message-box'].value = '';
				liveChat.send(message);
			}
		});
		liveChat.messageBox.addEventListener('keypress', function(event) {
			var code = event.keyCode || event.which;
			if( code === 13 ) {
				event.preventDefault();
				document.querySelector('#livechat-form .send-button').click();
			}
		});
	},

	updateChatBox: function (newMessages) {
		if(!liveChat.i) {
			return false;
		}
		var initialScrollHeight = liveChat.chatBox.scrollHeight;
		for(var i in newMessages) {
			if(!document.getElementById('livechat-message-' + newMessages[i].id)) {
				liveChat.chatBox.innerHTML += '<div id="livechat-message-' + newMessages[i].id + '" class="row message"><span class="username">' + newMessages[i].username + ': </span><span class="content">' + newMessages[i].message + '</span></div>';
			}
		}
		var messages = liveChat.chatBox.childNodes;
		var k = 0;
		if(messages.length > liveChat.messagesLimit) {
			var l = messages.length - liveChat.messagesLimit;
			for(var j in messages) {
				messages.item(messages[j]).remove();
				k++;
				if(k > l) {
					break;
				}
			}
		}
		if(initialScrollHeight < 320 || liveChat.chatBox.scrollTop > (liveChat.chatBox.scrollHeight - 16)) {
			liveChat.chatBox.scrollTop = liveChat.chatBox.scrollHeight;
		}
	},

	checkNewMessages: function () {
		if(!liveChat.i) {
			return false;
		}
		var url = baseUrl + 'livechat/ajax?action=check&type=' + liveChat.type + '&type_id=' + liveChat.typeId + '&last_time=' + liveChat.lastTime + '&messages_limit=' + liveChat.messagesLimit + '&csrf_token=' + requestToken;
		var xhr = new XMLHttpRequest();
		xhr.open('POST', url, true);
		xhr.onload = function () {
			liveChat.updateChatBox(JSON.parse(this.responseText));
			setTimeout(function () {
				liveChat.checkNewMessages();
			}, 5000);
		};
		xhr.send();
	},

	send: function (message) {
		if(!liveChat.i) {
			return false;
		}
		var url = baseUrl + 'livechat/ajax?action=send&message=' + encodeURIComponent(message) + '&type=' + liveChat.type + '&type_id=' + liveChat.typeId + '&last_time=' + liveChat.lastTime + '&messages_limit=' + liveChat.messagesLimit + '&csrf_token=' + requestToken;
		var xhr = new XMLHttpRequest();
		xhr.open('POST', url, true);
		xhr.onload = function() {
			liveChat.updateChatBox(JSON.parse(this.responseText));
		};
		xhr.send();
	}
};

function initLiveChat() {
	try {
		if(typeof document.getElementById('livchat-messages-limit') !== 'undefined') {
			var liveChatMessagesLimit = document.getElementById('livchat-messages-limit').value;
			liveChat.init(liveChatMessagesLimit);
		}
	} catch (e) {}
}

try {
	addPageHook('initLiveChat');
} catch (e) {}