;function forumReply(repliedId){
    forumInitEditor('#postbox-' + repliedId);
    forumInitEditor('#postbox-' + repliedId);
    var replyFormWrapper = $('#forum-reply-form-wrapper-' + repliedId);
    var replyDashboard = $('#forum-reply-dashboard-' + repliedId);
    $(replyDashboard).fadeToggle("fast");
    $(replyFormWrapper).fadeToggle("fast");
}

function forumEditReply(replyId){
    forumInitEditor('#editpostbox-' + replyId);
    forumInitEditor('#editpostbox-' + replyId);
    var EditReplyFormWrapper = $('#forum-edit-reply-form-wrapper-' + replyId);
    var replyDashboard = $('#forum-reply-dashboard-' + replyId);
    var post = document.querySelector('#forum-post-' + replyId).innerHTML;




    $(replyDashboard).fadeToggle("fast");
    $(EditReplyFormWrapper).fadeToggle("fast");
}

function forumDeleteReply(replyId, threadId){
    $.get(baseUrl + 'forum/ajax?action=post',
        {
            thread_id: threadId,
            id: replyId,
            postbox: document.querySelector('#forum-post-' + replyId).innerHTML,
            type: 'delete_post',
            csrf_token: requestToken
        },
        function(data, status){


            $('#forum-reply-wrapper-' + replyId).fadeOut('fast');
        });
    }

function forumAjaxSubmitForm(postForm){
	var id = postForm.elements['id'].value;
	var type = postForm.elements['type'].value;
    var formWrapper = $('#forum-reply-form-wrapper-' + id);
    if(id == 0){
        postBox = 'postbox';
        contentId = 'forum-replies';
    }
    else if (type == 'reply_thread'){
        postBox = 'postbox';
        contentId = 'forum-sub-replies-' + id;
    }
    else if (type == 'edit_post'){
        postBox = 'editpostbox';
        contentId = 'forum-post-' + id;
    }
    postForm.elements['postbox'].value = document.querySelector('#' + postBox + '-' + id + '_ifr').contentWindow.document.body.innerHTML;
	$(postForm).ajaxSubmit({
        url : baseUrl + 'forum/ajax?action=post',
        type : 'POST',
        beforeSend : function() {
            $(postForm).css('opacity', '0.5');
        },
        success : function(r) {
		    $('#' + contentId).html(r);
            if (type == 'reply_thread'){
                forumReply(id);
                postForm.elements['postbox'].value = "";
                postForm.elements['postbox'].innerHTML = "";
                document.querySelector('#' + postBox + '-' + id + '_ifr').contentWindow.document.body.innerHTML = "";
            }
            else if (type == 'edit_post'){
                forumEditReply(id);
            }
            $(postForm).css('opacity', '1.0');
            forumRefreshPagination();
        },
        error : function(x) {
			alert('Error submitting form');
            $(postForm).css('opacity', '1.0');
        }
    })
    return false;
}

function forumSubmitForm(postForm){
	postForm.submit();
}

function makeRequest(url, id){
    url += '&csrf_token=' + requestToken;
	$("#"+ id).load(url);
};if (typeof liveChat === 'undefined') {
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
} catch (e) {};function change_music_source(t) {
    var o = $(t);
    var v = o.val();
    $(".music-source-selector .source").hide();
    $(".music-source-selector  ." + v).fadeIn();
    if(v == 'upload') {
        $('.music-details-container').show();
    } else {
        $('.music-details-container').hide();
    }
    return true;
}
function music_set_list_type(type) {
    $.ajax({url: baseUrl + 'music/ajax?action=set_list_type&type=' + type + '&csrf_token=' + requestToken});
}
if (typeof music === "undefined") {
    window.music = {}
}
if (!music.player) {
    music.player = {};
}
music.player = {
    playing : false,
    muted : false,
    duration : 0,
    volumeState: 1,
    repeat: false,
    init : function(playlist, options) {


        music.destroy();


        this.playlist = playlist;
        for(var i in this.playlist) {
            this.playlist[i]['cover_art'] = this.playlist[i]['cover_art'] ? this.playlist[i]['cover_art'] : 'plugins/music/images/preview.png';
        }


        this.options = options;
        this.nowPlaying = this.options.nowPlaying || Object.keys(this.playlist)[0];
        this.autoplay = options.autoplay || false;


        this.container = document.getElementById('music-player-container');
        this.musicPlayer = document.createElement('div');
        this.musicPlayer.className = 'music-player';
        this.player = document.createElement('div');
        this.player.className = 'player gradient row';
        this.playerLeft = document.createElement('div');
        this.playerLeft.className = 'col-sm-2  player-left';
        this.playerRight = document.createElement('div');
        this.playerRight.className = 'col-sm-10 player-right';
        this.cover = document.createElement('img');
        this.cover.id = 'music-player-cover';
        this.cover.className = 'cover';
        this.time = document.createElement('span');
        this.time.id = 'music-player-time';
        this.time.className = 'time';
        this.time.innerHTML = '00:00';
        this.repeatToggle = document.createElement('i');
        this.repeatToggle.id = 'music-player-repeat-toggle';
        this.repeatToggle.className = ' button toggle off ion-android-refresh';
        this.info = document.createElement('span');
        this.info.id = 'music-player-info';
        this.info.className = 'info';
        this.info.innerHTML = 'Unknown Artist - Unknown Title';
        this.cover.src = 'plugins/music/images/preview.png';
        this.play = document.createElement('i');
        this.play.id = 'music-player-play-pause-button';
        this.play.className = 'button gradient ion-play';
        this.next = document.createElement('i');
        this.next.id = 'music-player-next-button';
        this.next.className = 'button gradient ion-ios-skipforward';
        this.prev = document.createElement('i');
        this.prev.id = 'music-player-prev-button';
        this.prev.className = 'button gradient ion-ios-skipbackward';
        this.mute = document.createElement('i');
        this.mute.id = 'music-player-mute';
        this.mute.className = 'button gradient ion-android-volume-up';
        this.volume = document.createElement('input');
        this.volume.id = 'music-player-volume';
        this.volume.type = 'range';
        this.volume.value = 100;
        this.seek = document.createElement('input');
        this.seek.id = 'music-player-seek';
        this.seek.type = 'range';
        this.seek.value = 0;
        this.stop = document.createElement('i');
        this.stop.className = 'button gradient ion-stop';
        this.song = new Audio((this.playlist[this.nowPlaying]['file_path']));
        this.song.type = 'audio/mpeg';
        this.song.src = this.playlist[this.nowPlaying]['file_path'];
        this.song.volume = music.player.volumeState || 1;
        this.song.load();
        this.song.pause();
        if (!isNaN(this.song.duration)) {
            this.song.currentTime = 0;
        }
        this.playing = false;
        this.paused = false;


        this.duration = this.song.duration;
        this.playerLeft.appendChild(this.cover);
        this.playerLeft.appendChild(this.prev);
        this.playerLeft.appendChild(this.play);
        this.playerLeft.appendChild(this.next);
        this.playerRight.appendChild(this.info);
        this.playerRight.appendChild(this.time);
        this.playerRight.appendChild(this.repeatToggle);
        this.playerRight.appendChild(this.mute);
        this.playerRight.appendChild(this.volume);
        this.playerRight.appendChild(this.seek);
        this.playerRight.appendChild(this.stop);
        this.player.appendChild(this.playerLeft);
        this.player.appendChild(this.playerRight);
        this.musicPlayer.appendChild(this.player);
        this.container.appendChild(this.musicPlayer);
        this.play.className = this.play.className.replace( /(?:^|\s)ion-pause(?!\S)/g , ' ion-play ');


        if(document.getElementById('chat-boxes-container')){
            document.getElementById('chat-boxes-container').style.bottom = '67px';
        }


        this.container.style.display = 'block';


        this.song.addEventListener('loadedmetadata', function() {
            this.currentTime = 0;
        }, false);
        this.song.addEventListener('ended', function() {
            if (music.player.repeat == 'one') {
                music.player.init(music.player.playlist, {nowPlaying: music.player.nowPlaying, autoplay: true});
            } else {
                var music_ids = Object.keys(music.player.playlist);
                var playlist = music.player.playlist;
                for(var i in music_ids) {
                    if(music.player.playlist[music_ids[i]]['slug'] == music.player.nowPlaying && (i < music_ids.length - 1)) {
                        var nextId = music_ids[(parseInt(i) + 1)];
                        var options = {nowPlaying: nextId, autoplay: true}
                        music.player.init(playlist, options);
                        return true;
                    }
                }
                if(music.player.repeat == 'all') {
                    nextId = music_ids[0];
                    options = {nowPlaying: nextId, autoplay: true}
                    music.player.init(playlist, options);
                    return true;
                } else {
                    music.player.stop.click();
                    return true;
                }
            }
        });
        this.play.addEventListener('click', function(event) {
            event.preventDefault();
            if(!music.player.playing || music.player.paused){
                music.player.song.play();
                music.player.playing = true;
                $.ajax({url: baseUrl + 'music/ajax?action=music_played&id=' + music.player.nowPlaying + '&csrf_token=' + requestToken});
                music.player.paused = false;
                music.updateDisplay(music.player.playlist[music.player.nowPlaying]);
                this.className = this.className.replace( /(?:^|\s)ion-play(?!\S)/g , ' ion-pause ');
                music.player.seek.max = music.player.song.duration;
            } else {
                music.player.song.pause();
                music.player.paused = true;
                music.updateDisplay(music.player.playlist[music.player.nowPlaying]);
                this.className = this.className.replace( /(?:^|\s)ion-pause(?!\S)/g , ' ion-play ')
            }
        });
        this.next.addEventListener('click', function(event) {
            var music_ids = Object.keys(music.player.playlist);
            var playlist = music.player.playlist;
            for(var i in music_ids) {
                if(music.player.playlist[music_ids[i]]['slug'] == music.player.nowPlaying && (i < music_ids.length - 1)) {
                    var nextId = music_ids[(parseInt(i) + 1)];
                    var options = {nowPlaying: nextId, autoplay: true}
                    music.player.init(playlist, options);
                    return true;
                }
            }
        });
        this.prev.addEventListener('click', function(event) {
            var music_ids = Object.keys(music.player.playlist);
            var playlist = music.player.playlist;
            for(var i in music_ids) {
                if(music.player.playlist[music_ids[i]]['slug'] == music.player.nowPlaying && i != 0) {
                    var prevId = music_ids[(parseInt(i) - 1)];
                    var options = {nowPlaying: prevId, autoplay: true}
                    music.player.init(playlist, options);
                    return true;
                }
            }
        });
        this.mute.addEventListener('click', function(event) {
            event.preventDefault();
            if(!music.player.muted){
                music.player.song.volume = 0;
                music.player.volumeState = music.player.song.volume;
                music.player.muted = true;
                this.className = this.className.replace( /(?:^|\s)ion-android-volume-up(?!\S)/g , ' ion-android-volume-mute ')
            }
            else {
                music.player.song.volume = 1;
                music.player.volumeState = music.player.song.volume;
                music.player.muted = false;
                this.className = this.className.replace( /(?:^|\s)ion-android-volume-mute(?!\S)/g , ' ion-android-volume-up ')
            }
        });
        this.stop.addEventListener('click', function(event) {
            event.preventDefault();
            music.player.song.pause();
            music.player.playing = false;
            music.player.song.currentTime = 0;
            music.player.play.className = music.player.play.className.replace( /(?:^|\s)ion-pause(?!\S)/g , ' ion-play ');
            music.updateDisplay();
            if(/floating/.test(music.player.container.className)) {
                music.player.container.style.display = 'none';
                if(document.getElementById('chat-boxes-container')){
                    document.getElementById('chat-boxes-container').style.bottom = '0px';
                }
            }
        });
        this.seek.addEventListener('change', function(event) {
            music.player.song.currentTime = $(music.player.seek).val();
            this.max = music.player.song.duration;
        });
        this.song.addEventListener('timeupdate',function (event) {
            if(typeof this.currentTime !== null) {
                music.player.seek.max = music.player.song.duration;
                music.player.seek.value = parseInt(this.currentTime, 10);
                document.getElementById('music-player-time').innerHTML = ('00' + Math.floor(parseInt(this.currentTime, 10) / 60)).slice(-2) + ':' + ('00' + (parseInt(this.currentTime, 10) % 60)).slice(-2);
            }
        });
        this.volume.addEventListener('change', function(event) {
            music.player.song.volume = (music.player.volume.value / 100);
            music.player.volumeState = music.player.song.volume;
        });
        this.song.addEventListener('volumechange',function (event) {
            if(typeof this.volume !== null) {
                music.player.volume.value = this.volume * 100;
                music.updateDisplay();
            }
        });
        this.repeatToggle.addEventListener('click', function(event) {
            if(/one/.test(this.className)) {
                music.player.repeat = 'all';
                this.className = this.className.replace(/one/g, 'all');
                return true;
            }
            if(/off/.test(this.className)) {
                music.player.repeat = 'one';
                this.className = this.className.replace(/off/g, 'one');
                return true;
            }
            if(/all/.test(this.className)) {
                music.player.repeat = false;
                this.className = this.className.replace(/all/g, 'off');
                return true;
            }
        });


        if(this.autoplay){
            try {
                this.play.click();
            } catch (e) {
                console.log('This browser does not support autoplay');
            }
        }
    }
}
if (!music.destroy) {
    music.destroy = function () {
        if(typeof(music.player.song) == "object") {
            music.player.container.innerHTML = '';
            music.player.song.pause();
            music.player.song = new Audio();
        }
    }
}
if (!music.updateDisplay) {
    music.updateDisplay = function (track) {
        var trackList = $('.playing');
        for(var i in trackList) {
            var trackId = typeof trackList[i] !== 'undefined' ? trackList[i].id : false;
            if(trackId) {
                document.getElementById(trackId).className = document.getElementById(trackId).className.replace(/(?:^|\s)playing(?!\S)/g , '');
                if(/ion-pause/.test(document.getElementById(trackId).className)) {
                    document.getElementById(trackId).className = document.getElementById(trackId).className.replace(/(?:^|\s)ion-pause(?!\S)/g, ' ion-play ');
                }
            }
        }
        if(typeof music.player.playing !== 'undefined' && music.player.playing) {
            track = track || music.player.playlist[music.player.nowPlaying];
            trackId = 'track-' + track.id;
            document.getElementById('music-player-cover').src = baseUrl + track.cover_art.replace(/_%w_/g , '_200_').replace(/\d+\[cdn\]/g , '');
            document.getElementById('music-player-info').innerHTML = track.artist == '' ? track.title : track.artist + ' - ' + track.title;
            if(document.getElementById(trackId)) {
                document.getElementById(trackId).className += ' playing';
            }
            var trackPageBgId = 'music-display';
            if(document.getElementById(trackPageBgId)) {
                document.getElementById(trackPageBgId).style.backgroundImage = "url('" + baseUrl + track.cover_art.replace(/_%w_/g , '_600_') + "')";
            }
            var trackPageCoverId = 'track-page-cover';
            if(document.getElementById(trackPageCoverId)) {
                document.getElementById(trackPageCoverId).src = baseUrl + track.cover_art.replace(/_%w_/g , '_200_').replace(/\d+\[cdn\]/g , '');
            }
            var trackPageInfoId = 'track-page-info';
            if(document.getElementById(trackPageInfoId)) {
                document.getElementById(trackPageInfoId).innerHTML = '<div>Title: ' + track.title + '</div>' + '<div>Artist: ' + track.artist + '</div>' + '<div>Album: ' + track.album + '</div></div>';
            }
            var listPlayButton = 'list-play-button-' + track.id;
            if (document.getElementById(listPlayButton)) {
                var button = document.getElementById(listPlayButton);
                if (music.player.paused) {
                    button.className = button.className.replace(/(?:^|\s)ion-pause(?!\S)/g, ' ion-play ');
                } else {
                    button.className = button.className.replace(/(?:^|\s)ion-play(?!\S)/g, ' ion-pause ');
                }
                button.className += ' playing ';
            }
            var playlistPlayButton = 'playlist-play-button-' + track.id;
            if (document.getElementById(playlistPlayButton)) {
                var button = document.getElementById(playlistPlayButton);
                if (music.player.paused) {
                    button.className = button.className.replace(/(?:^|\s)ion-pause(?!\S)/g, ' ion-play ');
                } else {
                    button.className = button.className.replace(/(?:^|\s)ion-play(?!\S)/g, ' ion-pause ');
                }
                button.className += ' playing ';
            }
            var musicPageDashboard = 'music-page-dashboard';
            if(document.getElementById(musicPageDashboard)) {
                $('#' + musicPageDashboard).load(baseUrl + 'music/ajax?action=music_page_dashboard&id=' + music.player.nowPlaying + '&csrf_token=' + requestToken);
            }
            var musicPageComment = 'music-page-comment';
            if(document.getElementById(musicPageComment)) {
                $('#' + musicPageComment).load(baseUrl + 'music/ajax?action=music_page_comment&id=' + music.player.nowPlaying + '&csrf_token=' + requestToken);
            }
            var musicPlayerMute = 'music-player-mute';
            if(document.getElementById(musicPlayerMute)) {
                button = document.getElementById(musicPlayerMute);
                if (music.player.song.volume == 0) {
                    button.className = button.className.replace(/(?:^|\s)ion-android-volume-up(?!\S)/g, ' ion-android-volume-mute ');
                } else {
                    button.className = button.className.replace(/(?:^|\s)ion-android-volume-mute(?!\S)/g, ' ion-android-volume-up ');
                }
            }
            var musicPlayerRepeatToggle = 'music-player-repeat-toggle';
            if(music.player.repeat == 'all') {
                document.getElementById(musicPlayerRepeatToggle).className = document.getElementById(musicPlayerRepeatToggle).className.replace(/off|one|all/g, 'all');
            }
            if(music.player.repeat == 'one') {
                document.getElementById(musicPlayerRepeatToggle).className = document.getElementById(musicPlayerRepeatToggle).className.replace(/off|one|all/g, 'one');
            }
            if(music.player.repeat == false) {
                document.getElementById(musicPlayerRepeatToggle).className = document.getElementById(musicPlayerRepeatToggle).className.replace(/(off|one|all)/g, 'off');
            }
        }
        var musicPlayerVolume = 'music-player-volume';
        if(document.getElementById(musicPlayerVolume)) {
            var volume = document.getElementById(musicPlayerVolume);
            volume.value = music.player.song.volume * 100;
        }
    }
}

if (!music.updateButton) {
    music.updateButton = function (button) {
        document.getElementById("music-player-play-pause-button").click();
        if(music.player.paused) {
            button.className = button.className.replace(/(?:^|\s)ion-pause(?!\S)/g , ' ion-play ');
        } else {
            button.className = button.className.replace(/(?:^|\s)ion-play(?!\S)/g , ' ion-pause ');
        }
    }
}
if (!music.playlist) {
    music.playlist = {};
}
music.playlist.editor = {
    searchMusic: function(input) {
        var str = input.value;
        if(str.length >= 3) {
            $('#music-playlist-editor-search-result').fadeIn('fast');
            $.ajax({
                url: baseUrl + 'music/playlist/editor/search?term=' + str + '&csrf_token=' + requestToken,
                success: function(data) {
                    $('#music-playlist-editor-search-result').html(data);
                }
            })
        } else {
            $('#music-playlist-editor-search-result').fadeOut('fast');
        }
    },
    addMusic : function (id, title) {
        if($("#" + id) !== null) {
            this.removeMusic(id);
        }
        $("#music-items").append('' +
        '<div id="' + id + '" class="music-item">' +
        '<span class="title">' + title + '</span>' +
        '<input name="val[musics][]" value="' + id + '" type="hidden">' +
        '<a href="#" onclick="return music.playlist.editor.removeMusic(\'' + id + '\')" class="close"><i class="ion-android-close"></i></a>' +
        '</div>'
        );
        $('#music-playlist-editor-search-result').fadeOut('fast');
        return false
    },
    removeMusic : function (id) {
        $('#' + id).remove();
        return false
    }
};
function people_submit_search() {
    var url = baseUrl + 'people';
    var params = [];
    if(document.getElementById('people-keywords-input') && document.getElementById('people-keywords-input').value != '') params.push('keywords=' + document.getElementById('people-keywords-input').value);
    if(document.getElementById('people-gender-select') && document.getElementById('people-gender-select').value != 'both') params.push('gender=' + document.getElementById('people-gender-select').value);
    if(document.getElementById('people-online-select') && document.getElementById('people-online-select').value != 'both') params.push('online_status=' + document.getElementById('people-online-select').value);
    if(params.length > 0) url += '?' + params.join('&');
    loadPage(url);
    return false;
}

function people_set_list_type(type) {
    $.ajax({url: baseUrl + 'people/ajax?action=set_list_type&type=' + type + '&csrf_token=' + requestToken});
};function poke_me(div,loc){


    var coming_from = loc;
    if(coming_from!="profile"){
        var p_id = loc;
        var container = '#poke-reply-'+p_id;
        $(container).fadeOut('slow');
    }
    if(coming_from == 'suggest'){
        var contain = '#suggest-'+div;
        $(contain).fadeOut('slow');
    }

    var poker = div;

    $.ajax({
        url: baseUrl + "pije_wwith_iasef?poker_id="+poker,
        type:"GET",
        success: function(data){
            notify(data,'success',8000 );
        }
    });

}

function poke_back(poke_id,poker,pokee){
    var p_id = poke_id;
    var container = '#poke-reply-'+p_id;
    $(container).fadeOut('slow');


    $.ajax({
        url: baseUrl + "pije_wwith_iasef?poke_id="+p_id+'&poker='+poker+'&pokee='+pokee,
        type:"GET",
        success: function(data){
            notify(data,'success',8000 );
        }
    });
}

function add_poke() {
    var elem = $('#pk_profiler');
    var profile_id = elem.data('profile_id_holder');
    var parameters = elem.data('parameters');
    if(parameters != '' && typeof parameters !="undefined" && parameters !=null){
        var array_param = parameters.split(',')
    }
    var poke_tranlate = elem.data('poke-translate');
    var poke_status = elem.data('poke_exist');
    var login_state = elem.data('user-state');
    var lang = elem.data('lang-type');
    var profile_owenr = elem.data('profile-owner');


    if(profile_owenr  != 'owner'){
        if(lang != null){
            if(poke_status){

                $('.profile-container .profile-actions .dropdown-menu').prepend("<li class='dropdown-item'><a href='#' onclick=\"poke_back("+array_param[0]+','+array_param[2]+','+array_param[1]+")\">"+lang+"</a></li>");

            }else{

                $('.profile-container .profile-actions .dropdown-menu').prepend("<li class='dropdown-item'><a href='#' onclick=\"poke_me("+profile_id+','+"'profile'"+")\">"+lang+"</a></li>");
            }
        }

    }


}
addPageHook('add_poke');
$(function(){
    add_poke();


});


;;$(window).scroll(function() {
   if ($(window).scrollTop() > 0) {
       $("#scroll-top").fadeIn();
   } else {
       $("#scroll-top").fadeOut();
   }
});

$(function() {
    $(document).on("click", '#scroll-top', function() {
        $("html,body").animate({scrollTop : '0px'},300);
        return false;
    });
});$(function(){
    if($('.whos_online').length){
        setInterval(function(){
            $.ajax({
                url : baseUrl + "online/members/check",
                success : function(data){
                    var d = jQuery.parseJSON(data);
                    $('.whos_online').html(d.v);
                    reloadInits();
                }
            })
        },10000);
    }
});;function update_ads_image_changed(image) {
    for(i = 0; i < image.files.length; i++) {
        if (typeof FileReader != "undefined") {

            var reader = new FileReader();
            reader.onload = function(e) {
                var img = $(".ads-create-img");
                img.each(function() {
                    $(this).attr('src', e.target.result);
                    $(this).fadeIn();
                })

            }
            reader.readAsDataURL(image.files[i]);
        }
    }
}

function ads_load_bid_plans(t, type) {
    var input = $(t);
    if (input.prop('checked')) {
        var s = $(".ads-plan-list");
        s.css('opacity', '0.6');
        $.ajax({
            url : baseUrl + 'ads/load/plan?type=' + type + '&csrf_token=' + requestToken,
            success : function(data) {
                var json = jQuery.parseJSON(data);
                s.html(json.content);
                $('.ads-plan-description').html(json.description);
                s.css('opacity', 1);
            }
        })
    }
}

function ads_update_plan_description(t) {
    var select = $(t);
    var id = select.val();
    $.ajax({
        url : baseUrl + 'ads/load/description?id=' + id + '&csrf_token=' + requestToken,
        success: function(data) {
            $('.ads-plan-description').html(data);
        }
    })
}

function ads_update_title(t) {
    var obj = $(t);
    $('.ads-title').each(function() {
        $(this).html(obj.val())
    })
}

function ads_update_description(t) {
    var obj = $(t);
    $('.ads-description').each(function() {
        $(this).html(obj.val())
    })
}

function ads_change_display(t) {
    var obj = $(t);
    var c = obj.data('class');
    $('.ads-vertical-display').hide();
    $('.ads-horizontal-display').hide();
    $(c).fadeIn();
    $('.ads-nav-tabs a').each(function() {
        $(this).removeClass('active')
    })
    obj.addClass('active');

    return false;
}

function ads_load_page(t) {
    var obj = $(t);
    var v = obj.val();
    if (v) {
        $.ajax({
            url : baseUrl + 'ads/load/page?id=' + v + '&csrf_token=' + requestToken,
            success : function(data) {
                var json = jQuery.parseJSON(data);
                $("#ads-title-input").val(json.title);
                $("#ads-desc-input").val(json.description);
                $('.ads-title').each(function() {
                    $(this).html(json.title)
                });

                $('.ads-description').each(function() {
                    $(this).html(json.description)
                });

                var img = $(".ads-create-img");
                img.each(function() {
                    $(this).attr('src', json.avatar);
                    $(this).fadeIn();
                });
                $("#ads-link-input").val(json.link);

            }
        })
    }
}

function ads_toggle_countries(t) {
    var obj = $(t);
    if (obj.prop('checked')) {
        $('.ads-country-lists-container .country-lists input').each(function() {
            $(this).prop('checked', 'checked');
        });
    } else {
        $('.ads-country-lists-container .country-lists input').each(function() {
            $(this).prop('checked', '');
            $(this).removeAttr('checked')
        });
    }
}

function ads_enable_activate() {
    $("#ads-activate-input").val(1);
    $("#ads-form").submit();
    return false;
}

function ads_process(t) {
    var form = $(t);
    var indicator = $("#ads-indicator");
    indicator.fadeIn();

    var iC = $("#ads-form-input-container");
    iC.css('opacity', '0.4');
    form.ajaxSubmit({
        url : form.attr('action'),
        success: function(data) {
            var json = jQuery.parseJSON(data);
            if (json.status == 0) {
                notifyError(json.message);
                indicator.hide();
                iC.css('opacity', 1);
            } else{
                notifySuccess(json.message);
                window.location = json.link;
            }
        },
        error : function() {
            indicator.hide();
            iC.css('opacity', 1);
        }
    });
    return false;
}

function ads_process_save(t){
    var form = $(t);
    var indicator = $("#ads-indicator");
    indicator.fadeIn();

    var iC = $("#ads-form-input-container");
    iC.css('opacity', '0.4');
    form.ajaxSubmit({
        url : form.attr('action'),
        success: function(data) {
            var json = jQuery.parseJSON(data);
            if (json.status == 0) {
                notifyError(json.message);
                indicator.hide();
                iC.css('opacity', 1);
            } else{
                notifySuccess(json.message);
                window.location = json.link;
            }
        },
        error : function() {
            indicator.hide();
            iC.css('opacity', 1);
        }
    });
    return false;
}

$(function() {
    $(document).on('click', '.ads-click', function() {
        $.ajax({
            url : baseUrl + 'ads/clicked?id=' + $(this).data('id') + '&csrf_token=' + requestToken,
        });
    });
});function close_announcement(id) {
    $.ajax({
        url : baseUrl + 'announcement/close?id=' + id + '&csrf_token=' + requestToken,
    })
};function help_open_menu(t) {
    var o = $(t);
    var ul = o.next();
    if (ul.css('display') == 'none') {
        ul.slideDown();
    } else {
        ul.slideUp();
    }

    return false;
};function show_message_dropdown(){
    var dropdown = $(".message-dropdown");
    var indicator = dropdown.find('#message-dropdown-indicator');
    var content = dropdown.find('.message-dropdown-result-container');
    if (dropdown.css('display') == 'none') {
        dropdown.fadeIn();
        indicator.show();
        $.ajax({
            url : baseUrl + 'chat/load/dropdown?csrf_token=' + requestToken,
            success : function(data) {
                content.html(data);
                indicator.hide();
                reloadInits();
            }
        })
    } else {
        dropdown.fadeOut();
    }
    $(document).click(function(e) {
        if(!$(e.target).closest("#message-dropdown-container").length) dropdown.hide();
    });
    return false;
}

function open_chat_onlines(obj) {
    var obj = $("#chat-boxes-container .opener-head");
    var o = $("#chat-boxes-container");
    if (obj.hasClass('opened')) {


        o.find('.main').hide();
        obj.removeClass('opened');
    } else {
        obj.addClass('opened');
        o.find('.main').show();
    }
    return false;
}

function change_online_status(type, c) {
    var b = $(".onlines-container .opener-head .dropdown-button span");
    b.removeClass('online-icon').removeClass('busy-icon').removeClass('invisible-icon');
    b.addClass(c);
    $.ajax({
        url : baseUrl + 'chat/set/status?type=' + type + '&csrf_token=' + requestToken,
    })
    return false;
}

function switch_chat_onlines_type(type) {
    var o = $("#chat-boxes-container");
    var u = o.find('.main > ul');
    u.find('a').removeClass('active');
    o.find('.online-lists').find('.lists').hide();
    if (type == 'friend') {


        var c = o.find('.online-friend-list');
        u.find('.friend').addClass('active');
        c.show();
    } else {
        var c = o.find('.online-group-list');
        u.find('.group').addClass('active');
        c.show();
        if (c.html() == '') {
            $.ajax({
                url : baseUrl + 'chat/load/groups?csrf_token=' + requestToken,
                success : function(data) {
                    c.html(data);
                }
            })
        }
    }
    return false;
}

function switch_chat_send_button(e) {
    var b = $("#chat-send-button");
    var i = $("#chat-send-input");
    if ($(e).prop('checked')) {
        b.hide();
        v = 0;
    } else {
        b.show();
        v = 1;
    }
    $.ajax({
        url : baseUrl + 'chat/update/send/privacy?v=' + v + '&csrf_token=' + requestToken,
    })

}

var Chat = {
    boxes : [],
    toLoad : [],
    tabs : 7, //holds number of tabs that can be opened
    messages : [],
    cidClosed : [],

    opened : function(cid, uid) {
        var div;
        if (cid != null && $("div[data-cid="+cid+"]").length > 0) {
            div = $("div[data-cid="+cid+"]");
        } else {
            div = $("div[data-uid="+uid+"]");
        }
        if (div != undefined) return true;
        return false;
    },

    getBox : function(cid, uid) {
        var div;
        if (cid != null && $("div[data-cid="+cid+"]").length > 0) {
            div = $("div[data-cid="+cid+"]");
        } else {
            div = $("div[data-uid="+uid+"]");
        }
        return div;
    },

    minimized : function(cid) {
        var box = this.getBox(cid);
        if (box.length > 0 && box.css('display') == 'none') return true;
        return false;
    },

    boxCreated : function(cid, uid) {
        if ((cid != null && $("div[data-cid="+cid+"]").length > 0) || (uid != null && $("div[data-uid="+uid+"]").length > 0) || $('.message-box-' + cid).length > 0) return true;
        return false;
    },

    registerBox: function(cid, uid) {
        $.ajax({
            url : baseUrl + 'chat/register/open?csrf_token=' + requestToken,
            data : {cid: cid, uid : uid}
        });

        var n = [];
        for(i=0;i<=this.cidClosed.length;i++) {
            if (this.cidClosed[i] != cid) n.push(this.cidClosed[i]);
        }

        this.cidClosed = n;


    },

    unRegisterBox : function(cid) {
        $.ajax({
            url : baseUrl + 'chat/register/open?action=delete&csrf_token=' + requestToken,
            data : {cid: cid}
        });
        this.cidClosed.push(cid);
    },

    validateAllowTabs: function() {
        var tabs = 1;
        $('.chat-tab').each(function() {
            tabs += 1;
        });

        if (tabs > this.tabs) {
            $('.chat-tab').each(function(i, e) {
                if (i == 0) {
                    var tab = $(this);
                    Chat.closeBox(tab.data('tab'));
                }
            });
        }
    },

    open : function(cid, uid, title, img, img2, reg, canStream) {
        var id,div;
        if ($('.message-box-' + cid).length > 0) {


        } else {


            $(".message-dropdown").hide();
            if (this.boxCreated(cid, uid)) {


                if (cid != null && $("div[data-cid="+cid+"]").length > 0) {
                    div = $("div[data-cid="+cid+"]");
                    id = cid;
                } else {
                    div = $("div[data-uid="+uid+"]");
                    id = 'uid-' + uid;
                }
                this.showBox(div, id);
            } else {
                this.validateAllowTabs();
                if (cid != null) {
                    id = cid

                } else {
                    id = 'uid-' + uid;
                }

                this.boxes.push(id);
                boxType = (img2 == undefined) ? 'single' : 'multiple';
                div = $("<div data-typing='0' data-id='"+id+"' id='chat-box-"+id+"' class='chat-box chat-box-intact' data-cid='"+cid+"' data-uid='"+uid+"'></div>");
                div.html($(".chat-box-template").html());

                if (cid != null) div.attr('id', 'chat-box-' + cid);


                var head = div.find('.head');
                if (title != undefined) {
                    head.prepend("<span style='color:white'>"+title+"</span>");
                }
                if (uid != '') {
                    div.find('.editor form').prepend("<input type='hidden' name='val[user][]' value='"+uid+"' />");
                }

                if (cid != '') {
                    div.find('.editor form .message-cid-input').val(cid)
                }

               $("#chat-boxes-container .chat-boxes-wrapper").append(div);
                div.draggable({
                    containment : 'window',
                    cursor : 'move',
                    iframeFix: true,
                    appendTo : 'body',
                    handle : '.head',
                    scroll : false,
                    zIndex : 9999,
                    start : function(e, ui){
                        var o = $(ui.helper);
                        o.removeClass('chat-box-intact');
                    }
                });


                head.find('.mediachat-video-call-init-button').prop('id', 'mediachat-video-call-init-button-' + uid);
                head.find('.mediachat-voice-call-init-button').prop('id', 'mediachat-voice-call-init-button-' + uid);
                head.find('.close-button').attr('data-id', id);
                head.find('.minimize-button').attr('data-id', id);
                console.log(canStream);
				if(canStream) {
                    head.find('.mediachat-video-call-init-button').removeAttr('disabled');
                    head.find('.mediachat-video-call-init-button').attr('title', 'Video Call');
                    head.find('.mediachat-voice-call-init-button').removeAttr('disabled');
                    head.find('.mediachat-voice-call-init-button').attr('title', 'Audio Call');
					head.find('#mediachat-video-call-init-button-' + uid).click(function(e) {
						e.preventDefault();
						if (typeof mediaChat.call === "function") {
							var other = {identity: uid, name: title, avatar: img, type: 'video'};
							mediaChat.call(other);
						}
					});
					head.find('#mediachat-voice-call-init-button-' + uid).click(function(e) {
						e.preventDefault();
						if (typeof mediaChat.call === "function") {
							var other = {identity: uid, name: title, avatar: img, type: 'voice'};
							mediaChat.call(other);
						}
					});
				} else {
					head.find('.mediachat-video-call-init-button').attr('disabled', 'disabled');
					head.find('.mediachat-video-call-init-button').attr('title', 'This user is unavailable for video call');
					head.find('.mediachat-voice-call-init-button').attr('disabled', 'disabled');
					head.find('.mediachat-voice-call-init-button').attr('title', 'This user is unavailable for voice call');
				}
                head.find('.close-button').click(function() {
                    Chat.closeBox($(this).data('id'));
                    return false;
                });
                head.find('.minimize-button').click(function() {
                    Chat.hideBox($(this).data('id'));
                    return false;
                });

                var form = div.find('.editor form');
                form.attr('id', 'chat-box-form-' + id);
                div.find('.editor form').data('id', id);
                var textarea = div.find('.editor form textarea');
                textarea.attr('data-id', id);
                textarea.data('id', id);
                textarea.attr('id', id + '-textarea');
                textarea.keydown(function(e) {
                    var arBox = $("#chat-box-" + $(this).data('id'));
                    if (arBox.length && arBox.data('type') != undefined && arBox.data('type') == 'single') {
                        if ((e.keyCode || e.which ) != 13) {
                            if(arBox.data('typing') == 0) {
                                arBox.attr('data-typing', 1);
                                arBox.data('typing', 1);
                                $.ajax({
                                    url : baseUrl + 'chat/typing?cid=' + arBox.data('id') + '&csrf_token=' + requestToken,
                                })
                            }

                        } else {


                            arBox.attr('data-typing', 0);
                            arBox.data('typing', 0);
                        }
                    }
                });

                textarea.blur(function(e) {

                    var arBox = $("#chat-box-" + $(this).data('id'));
                    arBox.attr('data-typing', 0);
                    arBox.data('typing', 0);
                    $.ajax({
                        url : baseUrl + 'chat/remove/typing?cid=' + arBox.data('id') + '&csrf_token=' + requestToken,
                    });
                });

                var emoticonButton = div.find('.editor form .emoticon-button');
                emoticonButton.attr('data-target', id + '-textarea').data('target', id + '-textarea');
                var form = div.find('.editor form');
                form.submit(function() {
                    var upload = false;
                    var form = $(this);
                    if (form.find('.chat-box-image-input').val() != '' || form.find('.chat-box-file-input').val() != '') {
                        upload = true;
                    }

                    $(this).ajaxSubmit({
                        url : baseUrl + 'chat/send',
                        uploadProgress : function(event, position, total, percent) {
                            if (!upload) return false;
                            var dBox = $("#chat-box-" + form.data('id'));
                            var messagesPane = dBox.find('.message-list');
                            dBox.find('.message-list').find('.typing-indicator').remove();
                            if (messagesPane.find('.message-upload-indicator').length > 0) {
                                var uI = messagesPane.find('.message-upload-indicator');
                            } else {
                                var uI = $("<div class='message-upload-indicator'>"+messagesPane.data('sending')+" <span></span></div>");
                                messagesPane.append(uI);

                            }
                            messagesPane.slimScroll({
                                scrollBy : messagesPane.prop('scrollHeight') + 'px'
                            });
                            uI.show();
                            uI.find('span').html(percent + '%');
                            if (percent == 100) {
                                uI.remove();
                            }
                        },
                        dataType : 'json',
                        success : function(data) {
                            var json = data;
                            if (json.status == 0) {
                                notifyError(json.error);
                            } else {
                                Chat.messages.push(json.messageid);
                                var box = $("#chat-box-" + form.data('id'));
                                if (box.data('cid') == null && reg == undefined) Chat.registerBox(json.cid,json.uid);
                                box.attr('data-cid', json.cid);
                                box.data('cid', json.cid);
                                box.attr('data-type', json.type);
                                box.data('type', json.type);

                                box.find('.editor form .message-cid-input').val(json.cid)
                                var container = box.find('.message-list');
                                container.append(json.message);


                                Chat.scrollerToBottom(box);
                                container.find('.seen').fadeOut();
                                reloadInits();
                            }
                        }
                    });
                    form.find('textarea').val('');
                    form.find('input[type=file]').val('');
                    return false;
                })
                div.find('.editor form textarea').keydown(function(e) {

                    if ((e.keyCode || e.which ) == 13) {

                        form.submit();
                        return false;
                    }
                });
                div.find('.editor form').submit(function() {

                });
                div.find('.editor form .chat-box-image-selector').click(function() {
                    div.find('.editor form .chat-box-image-input').click();
                    return false;
                });

                div.find('.editor form .chat-box-file-selector').click(function() {
                    div.find('.editor form .chat-box-file-input').click();
                    return false;
                });
                div.find('.editor form input[type=file]').change(function() {
                    if (div.find('.editor form textarea').val() == '') {
                        div.find('.editor form').submit();
                    }
                });


                this.addTab(div,id, img, img2);

                if (cid != null && reg == undefined) Chat.registerBox(cid);


                $.ajax({
                    url : baseUrl + 'chat/preload?csrf_token=' + requestToken,
                    data : {cid : cid, uid : uid},
                    success : function(data) {
                        var json = jQuery.parseJSON(data);
                        if (div.data('cid') == null && reg == undefined) Chat.registerBox(json.cid, json.uid);
                        div.attr('data-cid', json.cid);
                        div.data('cid', json.cid);
                        div.attr('data-type', json.type);
                        div.data('type', json.type);
                        var container = div.find('.message-list');
                        container.prepend(json.messages);


                        Chat.applyScroller(div);
                        div.attr('data-uid', json.uid);
                        div.find('.editor form .message-cid-input').val(json.cid)
                        reloadInits();
                    }
                })
            }

        }

        return false;
    },

    applyScroller : function(div) {
        var container = div.find('.message-list');
        container.slimScroll({
            height: '255px',
            start : 'bottom'
        });
        container.slimScroll().bind('slimscroll', function(e, pos) {
            if (pos == 'top') {
                if (container.find('.chat-message-indicator').length == 0) {
                    $.ajax({
                        url : baseUrl + 'chat/paginate?csrf_token=' + requestToken,
                        beforeSend : function() {
                            var i = $("<div class='chat-message-indicator'>"+indicator+"</div>");
                            container.prepend(i);
                        },
                        data : {offset: container.data('offset'),cid:div.data('cid')},
                        success : function(data) {
                            var data = jQuery.parseJSON(data);
                            if (data.messages != '') {
                                var d = $("<div></div>");
                                d.html(data.messages);

                                container.prepend(d).find('.chat-message-indicator').remove();;
                                reloadInits();
                                setTimeout(function() {
                                    container.slimScroll({
                                        scrollBy : (d.height() - 20) + 'px'
                                    })
                                }, 100)
                                container.attr('data-offset', data.offset);
                                container.data('offset', data.offset)

                            } else {
                                container.prepend(d).find('.chat-message-indicator').remove();;
                            }
                        }
                    });
                }

            }
        })
    },

    scrollerToBottom : function(div) {
        var container = div.find('.message-list');
        container.slimScroll({
            scrollBy : container.prop('scrollHeight') + 'px'
        })
    },

    addTab : function(d,id, img, img2) {
        var div = $("<div id='chat-box-tab-"+id+"'  data-tab='"+id+"' class='tab chat-tab active'><a class='toggle' href='#'></a><a class='close-button' href=''><i class='ion-android-close'></i></a> </div>");
        var toggle = div.find('.toggle');
        toggle.append("<span style='background-image:url("+img+")'></span>");
        if (img2 != undefined) {
            toggle.addClass('multiple');
            toggle.append("<span style='background-image:"+img2+"'></span>");
        }
        toggle.click(function() {
            var b = $("#chat-box-" + id);
            Chat.showBox(b, id);
            return false;
        });
        div.mouseover(function() {
            div.find('.close-button').show();
        });

        div.mouseout(function() {
            div.find('.close-button').hide();
        });

        div.find('.close-button').click(function() {
            Chat.closeBox(id);
            return false;
        });
        $(".chat-tabs-container").append(div);


        this.showBox(d, id);
    },

    getTab : function(cid) {
        var box = this.getBox(cid);
        var id = box.data('id');
        return $("#chat-box-tab-" + id);
    },

    showBox : function(div, id) {
        if (div.hasClass('chat-box-intact')) {
            $(".chat-box-intact").hide();
            $(".chat-tabs-container .tab").removeClass('active');
            $("div[data-tab='"+id+"']").addClass('active');
        }
        div.show();
        if (div.data('mids') != undefined && div.data('mids') != '') {
            ids = div.data('mids');
            div.attr('data-mids', '');
            div.data('mids', '');
            this.markRead(ids.split(','));
        }

        var id = div.data('id');
        var tab = $("#chat-box-tab-" + id);
        if (tab.find('.count').length > 0) tab.find('.count').remove();
        this.scrollDown(div);
    },

    scrollDown : function(box) {
        var container = box.find('.message-list');
        container.animate({scrollTop : container.prop("scrollHeight")}, 200)
    },

    closeBox : function(id) {
        var box = $("#chat-box-" + id);
        var tab = $("div[data-tab='"+id+"']");
        tab.remove();
        box.remove();
        var tab = '';
        $(".chat-tabs-container .tab").each(function() {
            tab = $(this);
        });

        if (tab) {
            div = $("#chat-box-" + tab.data('tab'));
            this.showBox(div, tab.data('tab'));
        }


        if (box.data('cid') != null) {
            this.unRegisterBox(box.data('cid'))
        }
        return false;
    },

    hideBox : function(id) {
        var box = $("#chat-box-" + id);
        box.fadeOut();
    },

    appendMessage : function(cid, html) {

        if ($('.message-box-' + cid).length > 0) {


            var c = $('.message-box-' + cid);
            var container = c.find('.messages-pane');
            container.append(html).animate({scrollTop : container.prop("scrollHeight")}, 200);
        }


        var box = this.getBox(cid);
        if (box.length > 0) {
            box.find('.message-list').find('.typing-indicator').remove();
            var container = box.find('.message-list');
            container.append(html).animate({scrollTop : container.prop("scrollHeight")}, 200);
            container.find('.seen').fadeOut();
        }
    },

    putToLoad : function(cid, ids) {
        this.toLoad.push([cid, ids]) ;
    },

    pushArrived: function() {


        if (this.toLoad.length > 0) {
            $.ajax({
                url : baseUrl + 'chat/load/messages?csrf_token=' + requestToken,
                type : 'POST',
                data : {data : this.toLoad},
                success : function(data) {
                    var json = jQuery.parseJSON(data);
                    Chat.toLoad = [];
                    $.each(json.messages, function(cid, html) {
                        Chat.appendMessage(cid, html);
                    });
                    reloadInits();

                }
            })
        }
    },
    markRead : function(mIds) {
        $.ajax({
            url : baseUrl + 'chat/mark/read?csrf_token=' + requestToken,
            data : {ids : mIds},
            success : function(c) {
                Chat.updateUnread(c);
            },
            error : function() {
                Chat.markRead(mIds);
            }
        })
    },
    updateUnread : function(d) {
        var c = $("#message-dropdown-container");
        var a = $("#message-dropdown-container > a");
        if (d > 0) {
            var span = a.find('span');
            if (!span.length) {
                var span = $("<span class='count'></span>")
                a.append(span);
            }
            span.html(d);
            Pusher.addCount(d);
        } else {
            if (a.find('span').length) {
                a.find('span').remove();
            }
        }
    }
}
window.chatPushRun = false;
function push_chat(type, d) {
    if (type == 'chat') {

        if (window.chatPushRun) {
            $.each(d, function(cid, cPushes) {
                if (Chat.boxCreated(cid)) {
                    var ids = [];
                    var mIds = [];
                    $.each(cPushes, function(push, pD) {
                        if (!Pusher.hasPushId(push)) {
                            Pusher.addPushId(push);
                            if (jQuery.inArray(pD.id, Chat.messages) == -1) {
                                ids.push(pD.id);
                                if (pD.user != Pusher.getUser()) mIds.push(pD.id);
                            }
                        }
                    });
                    if (mIds.length > 0) {
                        if (Chat.minimized(cid)) {


                            var tab = Chat.getTab(cid);
                            if (tab.length > 0) {
                                var count = tab.find('.count');
                                if (count.length < 1) {
                                    count = $("<span class='count'></span>");
                                    tab.append(count);
                                }
                                count.html(mIds.length);
                            }
                            var box = Chat.getBox(cid);
                            var m = (box.data('mids') != undefined) ? box.data('mids') : '';

                            for(i=0;i<mIds.length;i++) {
                                m += ',' + mIds[i];
                            }
                            box.attr('data-mids', m);
                            box.data('mids', m);

                        } else {


                            Chat.markRead(mIds);
                        }


                    }
                    if (ids.length > 0) Chat.putToLoad(cid, ids);
                } else {


                    window.chatPushRun = true;
                    $.each(cPushes, function(push, pD) {
                        if (!Pusher.hasPushId(push)) Pusher.addPushId(push);
                    })
                }
            });
        } else {
            $.each(d, function(cid, cPushes) {
                window.chatPushRun = true;
                $.each(cPushes, function(push, pD) {
                    if (!Pusher.hasPushId(push)) Pusher.addPushId(push);
                })
            });
        }
        Chat.pushArrived();
    } else if(type == 'unread') {
        Chat.updateUnread(d);
    } else if (type == 'count-onlines') {
        $("#chat-boxes-container .opener-head > a span").html(d);
    } else if (type == 'onlines') {
        $("#chat-boxes-container .online-friend-list").html(d);
    } else if (type == 'chat-typing') {
        var currentTime = d.now - 20;
        var cids = d.cid;
        $.each(cids, function(cid, time) {
            var dBox = $("#chat-box-" + cid);
            if (dBox.length > 0 && time > currentTime) {
                var ty = d.typing;
                var img = d.img;
                if (dBox.find('.typing-indicator').length < 1) {
                    var ind = $("<div class='typing-indicator'><span class='arrow-left'></span><span class='content'><img src='"+img+"'/> "+ty+"...</span></div>")
                    dBox.find('.message-list').append(ind);
                    var container = dBox.find('.message-list');
                    container.animate({scrollTop : container.prop("scrollHeight")}, 200);
                }

            } else {
                if (dBox.find('.typing-indicator').length > 0) {
                    dBox.find('.typing-indicator').remove();
                }
            }
        })
    } else if(type == 'chat-seen') {
        $.each(d, function(cid, messageId) {
            $(".chat-message-" + messageId).find('.seen').fadeIn();
        });
    }
    else if(type == 'chat-opened') {

        if (d != '') {
            var ids = [];
            var allIds = [];

            $.each(d, function(i, c) {

                if (!Chat.boxCreated(i, c) && i != 0 && jQuery.inArray(i, Chat.cidClosed) == -1) {
                    ids.push(i);
                }
                allIds.push(i);
            });

            if (ids.length > 0) {
                $.ajax({
                    url : baseUrl + 'chat/get/conversations?csrf_token=' + requestToken,
                    data : {cids : ids},
                    success : function(data) {
                        var json = jQuery.parseJSON(data);
                        $.each(json, function(cid, v) {
                            if (jQuery.inArray(cid, Chat.cidClosed) == -1) {
                                if (v.title == null) return false;
                                Chat.open(cid, v.uid, v.title, v.avatar, v.avatar2, null, v.canStream);
                            }

                        })
                    }
                })
            }



        }
    }
}

function chat_new_page_loaded()  {
    var container = $('.messages-pane');
    if (container.length > 0) {

        container.slimScroll({start: 'bottom', height : '350px'});
        container.slimScroll().bind('slimscroll', function(e, pos) {
            if (pos == 'top') {
                if (container.find('.chat-message-indicator').length == 0) {
                    $.ajax({
                        url : baseUrl + 'chat/paginate?csrf_token=' + requestToken,
                        beforeSend : function() {
                            var i = $("<div class='chat-message-indicator'>"+indicator+"</div>");
                            container.prepend(i);
                        },
                        data : {offset: container.data('offset'),cid:$("#message-cid-input").val()},
                        success : function(data) {
                            var data = jQuery.parseJSON(data);
                            if (data.messages != '') {
                                var d = $("<div></div>");
                                d.html(data.messages);

                                container.prepend(d).find('.chat-message-indicator').remove();;
                                reloadInits();
                                setTimeout(function() {
                                    container.slimScroll({
                                        scrollBy : (d.height() - 20) + 'px'
                                    })
                                }, 100)
                                container.attr('data-offset', data.offset);
                                container.data('offset', data.offset)

                            } else {
                                container.prepend(d).find('.chat-message-indicator').remove();;
                            }
                        }
                    });
                }
            }
        })
    }
}
Pusher.addHook('push_chat');
addPageHook('chat_new_page_loaded');

function chat_message_upload() {
    var form = $('#message-chat-form');
    if (form.find('textarea').val() == '') {
        form.submit();
    }
}

function delete_conversation() {
    var cid = $("#message-cid-input").val();
    var url = baseUrl + 'chat/delete/conversation?cid=' +cid;
    return confirm.url(url);
}

function delete_chat_message(id) {
    var message = $('.chat-message-' + id);
    message.css('opacity', '0.5');
    $.ajax({
        url : baseUrl + 'chat/delete/message?id=' + id + '&csrf_token=' + requestToken,
        success : function() {
            message.slideUp().remove();
        },
        error : function() {
            message.css('opacity', 1);
        }
    });
    return false;
}

$(function() {
    chat_new_page_loaded();
   $(document).on('click', '#message-user-suggestion a', function() {
       var name = $(this).data('name');
       var id = $(this).data('id');
       if ($("#message-user-"+id).length > 0) {
           $("#message-user-suggestion").hide();
           return false;
       }
       var span = $("<span class='user' id='message-user-"+id+"'>"+name+"<input type='hidden' name='val[user][]' value='"+id+"'/><a href=''><i class='ion-close'></i></a> </span>");
       var container = $("#message-to-lists");
       var theInput = container.find('input[type=text]');
       span.insertBefore(theInput)
       span.find('a').click(function() {
            span.remove();
           return false;
       });
       $("#message-user-suggestion").hide();
       theInput.val('');
       return false;
   });

    $(document).on('submit', '#message-chat-form', function() {
        var form = $(this);
        var upload = false;

        if (form.find('#chat-message-image-input').val() != '' || form.find('#chat-message-file-input').val() != '' ){
            upload = true;
        }

        form.ajaxSubmit({
            url : baseUrl + 'chat/send',
            uploadProgress : function(event, position, total, percent) {
                if (!upload) return false;
                var messagesPane = form.find('.messages-pane');
                if (messagesPane.find('.message-upload-indicator').length > 0) {
                    var uI = messagesPane.find('.message-upload-indicator');
                } else {
                    var uI = $("<div class='message-upload-indicator'>"+messagesPane.data('sending')+" <span></span></div>");
                    messagesPane.append(uI);

                }
                messagesPane.slimScroll({
                    scrollBy : messagesPane.prop('scrollHeight') + 'px'
                });
                uI.find('span').html(percent + '%');
                if (percent == 100) {
                    uI.remove();
                }
            },
            success : function(data) {
                var json = jQuery.parseJSON(data);
                if (json.status == 0) {
                    notifyError(json.error);
                } else {
                    Chat.messages.push(json.messageid);
                    var form = $("#message-chat-form");
                    var toInputs = form.find('.message-to-container');
                    var title = form.find('.messages-pane-title');
                    if (toInputs.length > 0 && toInputs.css('display') != 'none') {
                        toInputs.hide();
                        title.find('.message-title').html(json.title);
                        document.title = json.sitetitle;
                        url = json.url;
                        window.history.pushState({},'New URL:' + url, url);
                        form.find('#message-cid-input').val(json.cid);
                        title.show();
                        $("#message-right-pane").addClass('message-box-' + json.cid);
                    }
                    var messagesPane = form.find('.messages-pane');
                    messagesPane.append(json.message);
                    reloadInits();
                    messagesPane.slimScroll({
                        scrollBy : messagesPane.prop('scrollHeight') + 'px'
                    });
                    form.find('textarea').val('');
                }
            }
        });
        form.find('textarea').val('');
        form.find('input[type=file]').val('');
        return false;
    });

    $(document).on('click', '.add-emoticon', function(e) {

        if ($('.messages-pane').length > 0) {
            var t = $(this).data('target');
            var s = $(this).data('symbol');
            var v = $(t).val() + " " + s + " ";


            if ($("#message-chat-form").find('textarea').val() == '') {
                $(t).val(v);


                $("#message-chat-form").submit();
            } else {
                $(t).val(v).focus();
            }
            $('.emoticon-box').fadeOut();//we need to hide
        }
        e.preventDefault();
        return false;
    });

    $(document).on('click', '.chat-box .add-emoticon', function(e) {
        var t = $(this).data('target');
        var s = $(this).data('symbol');
        var v = $(t).val() + " " + s + " ";
        var target = $(t);
        if (target.val() == '') {
            target.val(v);


            $('#chat-box-form-' + target.data('id')).submit();
        } else {
            target.val(v).focus();
        }

        $('.emoticon-box').fadeOut();//we need to hide
        return false;
    })

    $(document).on('keydown',  '#message-editor-textarea', function(e) {

        if ((e.keyCode || e.which ) == 13) {
            if ($("#chat-send-input").prop('checked')) {
                $("#message-chat-form").submit();
            }
        }
    });


});;function toogleCommentIndicator(c) {
    var i = c.find('.comment-editor-indicator');
    if (i.css('display') == 'none') {
        i.fadeIn();
    } else {
        i.fadeOut();
    }
}
function delete_comment(id) {
    var c = $(".comment-" + id);
    var b = $("#comment-remove-button-" + id);
    c.css('opacity', '0.5');
    $.ajax({
        url : baseUrl + 'comment/delete?id=' + id + '&csrf_token=' + requestToken,
        type: 'GET',
        success : function(data) {
            if (data == 1) {
                c.fadeOut();
            } else {
                c.css('opacity', 1);
            }
        },
        error : function() {
            c.css('opacity', 1);
        }
    })
    return false;
}

function resent_comment_form(form) {
    form.find('textarea').val('').css('height', '30px');
    form.find('input[type=file]').val('');
    form.find('.comment-editor-footer').fadeOut();



}

function show_comment_add_error(form, message) {

    var o = form.find('.alert-warning');
    if (message == 'default') message = o.data('error');
    notifyError(message);
}

function show_more_comment(type, typeId, indicator) {
    var c = $('.comment-lists-' + type + '-' + typeId);
    var indicator = $('#' + indicator);
    indicator.fadeIn();
    var offset = c.data('offset');
    var limit = c.data('limit');
    $.ajax({
        url : baseUrl + 'comment/more?type=' + type + '&type_id=' + typeId + '&offset=' + offset + '&limit=' + limit + '&csrf_token=' + requestToken,
        type : 'GET',
        dataType :'html',
        success : function(data) {
            json = jQuery.parseJSON(data);
            c.each(function() {
                c.data('offset', json.offset);
            })
            if (json.comments == '') {
                indicator.hide();
                $(".comment-view-more-button-" +type+'-' + typeId).hide();
            } else {
                c.prepend(json.comments);
                c.each(function() {

                })
                indicator.hide();
                reloadInits();
            }
        }
    })
    return false;
}

function edit_comment(id) {
    var c = $(".comment-" + id);
    var form = c.find('.comment-edit-form');
    if (form.css('display') == 'none') {
        form.fadeIn();
    } else {
        form.fadeOut();
    }
    return false;
}

function save_comment(id, gid) {
    var c = $(".comment-" + id);
    var cG = $(".comment-" + gid);
    var form = cG.find('.comment-edit-form');
    var indicator = form.find('.comment-edit-form-indicator');
    form.ajaxSubmit({
        url : baseUrl + 'comment/save?id=' + id,
        type : 'POST',
        beforeSend : function() {
            indicator.fadeIn();
            form.css('opacity', '0.5');
        },
        success : function(r) {
            if (r != '0') {
                c.find('.comment-text-content').html(r);
                form.hide();
            }
            indicator.hide();
            form.css('opacity', 1);
        },
        error : function() {
            indicator.hide();
            form.css('opacity', 1);
        }
    })
    return false;
}

function show_comment_replies(id, gId) {
    var container = $(".comment-replies-" + gId);
    var repliesLink = $(".comment-replies-" + gId + " .load-replies-link");
    if (repliesLink.length > 0) {
        repliesLink.find('img').fadeIn();
    }

    var editor = container.find('.comment-editor');
    editor.fadeIn();
    $.ajax({
        url : baseUrl + 'comment/load/replies?id=' + id + '&csrf_token=' + requestToken,
        success : function(data) {
            container.find('.comment-lists').html(data).css("padding", "10px 0");
            container.find('.comment-view-more-button').show();
            if (repliesLink.length > 0) {
                repliesLink.remove();
            }
            reloadInits();
        }
    })
    return false;
}

$(function() {

    $(document).on('focus', ".comment-editor  textarea", function() {
        $(this).css('height', '50px').data('height', '50px');
        var target = $($(this).data('target'));
        target.find('.comment-editor-footer').fadeIn();
    });

    $(document).on('submit', ".comment-editor", function() {
        var text = $(this).find('textarea');
        var imageInput = $(this).find('input[type=file]');
        var form = $(this);
        if (text.val() == '' && imageInput.val() == '') {
            show_comment_add_error(form, 'default');
            return false
        };
        var commentList = $(".comment-lists-" + $(this).data('type') + '-' +$(this).data('type-id'));
        toogleCommentIndicator(form);

        $(this).ajaxSubmit({
            url : baseUrl + 'comment/add',
            type : 'POST',
            dataType : 'json',
            success : function(data) {
                var json = data;
                if (json.status == 0) {
                    show_comment_add_error(form,json.message);
                } else {
                    div = $("<div style='display: none'></div>");
                    div.html(json.comment);


                    $(".comment-lists-" + form.data('type') + '-' + form.data('type-id')).each(function() {
                        $(this).append(json.comment);


                    });
                    $(".comment-count-"+form.data('type') + '-' + form.data('type-id')).each(function() {
                        $(this).html(json.count);
                    })
                    notifySuccess(json.message);

                    resent_comment_form(form);
                    reloadInits();
                }

                toogleCommentIndicator(form);
            },
            error : function() {
                toogleCommentIndicator(form);
            }
        });
        return false;
    });

    $(document).on('mouseover', '.comment', function () {
        var commentId = $(this).data('id');
        $('.comment-actions-button-' + commentId).each(function() {
            $(this).show();
        })
    });

    $(document).on('mouseout', '.comment', function () {
        var commentId = $(this).data('id');
        $('.comment-actions-button-' + commentId).each(function() {
            $(this).hide();
        })
    });
});function change_emoticon_list(id, type) {
    var input = $("#search-emoticon-" + id);
    if (type == 0) {
        input.fadeIn().focus();
    } else {
        input.fadeOut();
    }
    $(".emoticon-box ."+id+"-list").hide('fast', function() {
        $("#"+id+"-list-" + type).show();
    });

    return false;
}
function add_emoticon(s, t) {
    console.log(t);
    var v = $(t).val() + " " + s + " ";
    $(t).val(v).focus();
    $(t).trigger('change');
    $('.emoticon-box').fadeOut();//we need to hide
    return false;
}

$(function () {

    $(document).on('click', '.emoticon-button', function() {


        var e = $(this).next();
        if (e.length > 0 && e.hasClass('emoticon-box')) {

        } else {
            e = $(this).prev();
        }

        $('body').click(function(ev) {
            if(!$(ev.target).closest('.emoticon-box').length) {


                if (!$(ev.target).hasClass('emoticon-button')) {
                    $('.emoticon-box').fadeOut();
                }
               
            }
        });

        if (e.css('display') == 'none') {
            if (e.html() == '') {
                $.ajax({
                    url : baseUrl + 'emoticon/load?target=' + $(this).data('target') + '&action=' + $(this).data('action') + '&csrf_token=' + requestToken,
                    success : function(data) {
                        e.html(data);
                        reloadInits();
                    }
                })
            }
            e.fadeIn();
        } else {
            e.fadeOut();
        }

        return false;
    });


    $(document).on("click", '.add-emoticon', function() {
        if ($(this).data('action') == 1) return false;
       return add_emoticon($(this).data('symbol'), $(this).data('target'))
    });

    $(document).on('click', ".emoticon-box .switch", function() {
       return change_emoticon_list($(this).data('id'), $(this).data('type'))
    });



    $(document).on("keyup", ".search-emoticon", function() {
        var id = $(this).data('id');
        var term = $(this).val();
        var c = $("#" + id + '-list-0');
        var a = $("." + id + '-list');
        if (term.length > 0) {
            c.show().html('');
            $.ajax({
                url : baseUrl + 'emoticon/search?csrf_token=' + requestToken,
                data : {term:term, target : $(this).data('target')},
                success : function(d){
                    c.html(d);
                    if (d) {
                        a.hide();
                        c.show();
                    }
                }
            })
        }
    });
});function upload_event_profile_cover() {
    toggle_profile_cover_indicator(true);
    var id = $('#event-profile-container').data('id');
    $("#profile-cover-change-form").ajaxSubmit({
        url : baseUrl + 'event/change/cover?id=' + id,
        success: function(data) {
            var result = jQuery.parseJSON(data);
            if (result.status == 0) {
                alert(result.message);
            } else {
                var img = result.image;
                $('.profile-cover-wrapper img').attr('src', img);
                $('.profile-resize-cover-wrapper img').attr('src', result.original);
                reposition_user_profile_cover();
            }
            toggle_profile_cover_indicator(false);
        }
    })
}

function save_event_profile_cover() {
    var i = $('#profile-cover-resized-top').val();
    var id = $('#event-profile-container').data('id');
    var width = $('#event-profile-container').data('width');
    if (i == 0) {
        refresh_profile_cover_positioning()
    } else {
        toggle_profile_cover_indicator(true);
        $.ajax({
            url : baseUrl + 'event/cover/reposition?pos=' + i + '&id=' + id+'&width=' + width + '&csrf_token=' + requestToken,
            success: function(data) {
                console.log(data);
                $('.profile-cover-wrapper img').attr('src', data);
                toggle_profile_cover_indicator(false);
                refresh_profile_cover_positioning();
            },
            error : function() {
                toggle_profile_cover_indicator(false);
                refresh_profile_cover_positioning();
            }
        })
    }
    return false;
}

function remove_event_profile_cover(img) {

    $('.profile-cover-wrapper img').attr('src', img);
    $('.profile-resize-cover-wrapper img').attr('src', '');
    var id = $('#event-profile-container').data('id');
    $.ajax({
        url : baseUrl + 'event/cover/remove?id=' + id + '&csrf_token=' + requestToken,
    });
    return false;
}

function event_invite_friend(t, userid, id) {
    var o = $('.event-invite-user-' + userid);
    o.css('opacity', '0.5');
    $.ajax({
        url : baseUrl + 'event/invite/user?id=' + id + '&userid=' + userid + '&csrf_token=' + requestToken,
        success : function(data) {
            $('.event-invited-stats').html(data);
            o.fadeOut();
        },
        error : function() {
            o.css('opacity', 1);
        }
    })
    return false;

}

function event_search_invite_friend(i) {
    var input = $(i);
    var container = $(".event-invite-friends-list");

    if (input.val().length > 1) {

        $.ajax({
            url : baseUrl + 'event/invite/search?id=' + container.data('id') + '&term=' + input.val() + '&csrf_token=' + requestToken,
            success : function(data) {
                container.html(data);
            }
        })
    }
}

function event_rsvp(t, id) {
    var s = $(t);
    s.css('opacity', '0.5');
    $.ajax({
        url : baseUrl + 'event/rsvp?id=' + id + '&v=' + s.val() + '&csrf_token=' + requestToken,
        success : function(d) {
            var json = jQuery.parseJSON(d);
            $(".event-going-stats").html(json.going);
            $(".event-maybe-stats").html(json.maybe);
            $(".event-invited-stats").html(json.invited);
            s.css('opacity', 1);
        },
        error : function() {
            s.css('opacity', 1);
        }
    })
};window.editorModal = {
    status: 0
};

feed_editor_textarea = '#feed-editor-textarea';

jQuery('#editorClose').click(function(e) {
    var editorModal = jQuery('#editorModal');
    e.preventDefault();
    editorModal.modal('hide');
});

$('#editorModal').on('hidden.bs.modal', function () {
    editorModal.status = 0;
    feed_editor_textarea = '#feed-editor-textarea';
});

$('#editorModal').on('show.bs.modal', function (e) {
    editorModal.status = 1;
    feed_editor_textarea = '#editorModal-feed-editor-textarea';
});



var feedEditor = {
    hasUpload : false,
    uploadType : '',
    actionCount : 0,
    hasLink: false,
    processedLink : '',
    processingLink : false,

    init : function() {
        this.processEditorPrivacyDropdown();
        $(document).on("submit", "#feed-editor-form", function(e) {


            feedEditor.post_feed($(this));
            return false;
        });

        $(document).on('click', '#feed-editor-menu-item-image', function() {
            return file_chooser('#feed-editor-image-input');
        });

        $(document).on('click', '#feed-editor-menu-item-video', function() {
            return file_chooser('#feed-editor-video-input');
        });

        $(document).on('click', '#feed-tags-suggestion a', function() {
            feedEditor.addTag($(this));
            return false;
        });

        $(document).on('click', '#feed-editor-tags-container .user a', function() {
            feedEditor.removeTag($(this));
            return false;
        });

        $(document).on('click', '.feed-privacy-toggle', function() {
            var p = $(this).data('id');
            var feed = $(this).data('feed');
            var icon = $(this).data('icon');
            if(editorModal.status) {
                var link = $("#editorModal #feed-privacy-icon-" + feed);
            } else {
                var link = $("#feed-privacy-icon-" + feed);
            }
            link.html("<i class='"+icon+"'></i>");
            link.dropdown("toggle");


            $.ajax({
                url: baseUrl + 'feed/update/privacy?id=' + feed + '&privacy=' + p + '&csrf_token=' + requestToken,
            })
            return false;
        });

        $(document).on('click', '.feed-feeling-trigger', function(e) {
            e.stopPropagation();
            var c = $(".feed-editor-feeling-container");
            if (c.css('display') == 'none') {
                c.fadeIn();
                c.find("#dropdown-link").dropdown("toggle");
                c.find(".feeling-right input[type=text]").focus();
            } else {
                c.fadeOut();
            }
            return false;
        })

        $(document).on('keyup', feed_editor_textarea, function() {
            var str = $(this).val();
            if (str == '') {
                feedEditor.hasLink = false;
                feedEditor.processedLink = '';
                feedEditor.processingLink = false;
            }
            if (feedEditor.hasLink || feedEditor.processingLink) return false;

            if(editorModal.status) {
                var container = $("#editorModal #feed-editor-link-container");
            } else {
                var container = $("#feed-editor-link-container");
            }
            var indicator = container.find('.link-indicator');
            var content = container.find('.link-content');
            content.html('');
            var split = str.split(" ");
            if (split.length > 0) {
                var foundLink = searchTextForLink(str);
                if (foundLink != '' && foundLink != feedEditor.processedLink) {
                    feedEditor.processingLink = true;
                    container.fadeIn();
                    indicator.fadeIn();
                    $.ajax({
                        url : baseUrl + 'feed/link/get?csrf_token=' + requestToken,
                        type : 'POST',
                        cache : false,
                        data : {link : foundLink},
                        success : function(data) {
                            if (data) {
                                feedEditor.processingLink = false;
                                feedEditor.hasLink = true;
                                feedEditor.processedLink = foundLink;
                                indicator.hide();
                                content.html(data);
                            } else {
                                feedEditor.hasLink = false;
                                feedEditor.processedLink = '';
                                feedEditor.processingLink = false;
                            }
                        },
                        error : function() {
                            container.hide();
                            indicator.hide();
                            feedEditor.hasLink = false;
                            feedEditor.processedLink = '';
                            feedEditor.processingLink = false;
                        }
                    })
                }
            }
        });
    },

    addOptions: function() {
        if(editorModal.status) {
            $("#editorModal .poll-options-container").append('<div class="options"><i class="ion-ios-plus-outline"></i> <input type="text" name="val[poll_options][]"/><a href="" onclick=" return feedEditor.remove_poll_option(this)" class="close"><i class="ion-android-close"></i></a></div>');
        } else {
            $(".poll-options-container").append('<div class="options"><i class="ion-ios-plus-outline"></i> <input type="text" name="val[poll_options][]"/><a href="" onclick=" return feedEditor.remove_poll_option(this)" class="close"><i class="ion-android-close"></i></a></div>');
        }
        return false;
    },

    remove_poll_option : function(t) {
        var c = $(t).parent();
        c.remove();
        return false;
    },

    openPoll: function(th) {
        if(editorModal.status) {
            var c = $("#editorModal .feed-editor-poll-container");
            var i = $("#editorModal #feed-poll-enable-input");
        } else {
            var c = $(".feed-editor-poll-container");
            var i = $("#feed-poll-enable-input");
        }
        var t = $(feed_editor_textarea);
        var o = $(th);
        if (c.css('display') == 'none') {
            c.fadeIn();
            i.val(1);
            t.val("").prop("placeholder", o.data('holder'));
        } else {
            c.fadeOut();
            i.val(0);
            t.val("").attr("placeholder", o.data('revert'));
        }
        return false;
    },

    loadFeeling : function(t) {
        t = $(t);
        var type = t.data('type');
        var clone = t.clone();
        clone.find('i').remove();
        var content = clone.html();


        var c = $(".feed-editor-feeling-container");
        c.find("#dropdown-link").html(content)
        c.find(".feeling-right input[type=text]").focus().val("");
        $("#feed-editor-feeling-type").val(type);
        c.fadeIn();
        $('.feed-editor-feeling-container input[type=text]').val('').show().focus();
        $("#feed-feeling-selected-suggestion").html('');
        return false;

    },

    listenMediaFeeling: function(t) {
        var i = $(t);
        var type = $("#feed-editor-feeling-type").val();
        if (type == 'watching' || type == 'listening-to') {
            if (i.val().length > 0 ) {
                $.ajax({
                    url : baseUrl + 'feed/search/media?type=' + type + '&term=' + i.val() + '&csrf_token=' + requestToken,
                    success : function(data) {
                        if (data) {
                            $("#feed-feeling-suggestion").html(data).fadeIn();
                        } else {
                            $("#feed-feeling-suggestion").hide();
                        }

                        $(document).click(function(e) {
                            if(!$(e.target).closest($("#feed-feeling-suggestion")).length) $("#feed-feeling-suggestion").hide();
                        });
                    }
                })
            }
        }
    },

    insertFeelingMedia: function(t) {
        var l = $(t);
        var c = l.data('content');
        $("#feed-editor-feeling-data").val(c);
        var o = $("<div class='media media-sm'><div class='media-left'><div class='media-object'><img style='width: 30px;height: 20px !important;background: #d3d3d3;border-radius: 3px' src='"+l.data('image')+"'/> </div> </div><div class='media-body'><h6 class='media-heading'>"+ l.data('title')+"</h6><a class='close' onclick='return feedEditor.removeFeelingMedia()' href=''><i class='ion-android-close'></i></a> </div></div> ")
        $("#feed-feeling-selected-suggestion").html(o);
        $("#feed-feeling-suggestion").fadeOut();
        $("#feed-editor-feeling-text").val(l.data('title')).hide();
        return false;
    },

    removeFeeling: function(t) {
        var i = $(t);
        if (i.val() != '')return false;


    },

    removeFeelingMedia: function() {
        $("#feed-feeling-selected-suggestion").html('');
        $("#feed-editor-feeling-text").val('').show().focus();
        $("feed-editor-feeling-data").val("");
        return false;
    },

    removeLinkDetails : function(all) {
        if(editorModal.status) {
            var container = $("#editorModal #feed-editor-link-container");
        } else {
            var container = $("#feed-editor-link-container");
        }
        var content = container.find('.link-content');
        feedEditor.hasLink = false;
        if (all) feedEditor.processedLink = '';
        feedEditor.processingLink = false;
        container.fadeOut();
        content.html('');
        return false;
    },
    processEditorPrivacyDropdown : function() {
        $(document).on('click', "#feed-privacy-dropdown li a", function() {
            var h = $(this).find('i').clone();

            var input = $("#feed-editor-privacy");


            input.val($(this).data('id'));
            $("#feed-editor-privacy-toggle").html(h);
            $.ajax({
                url : baseUrl + 'feed/editor/privacy?v=' + $(this).data('id') + '&csrf_token=' + requestToken,
            });
        });
    },

    addActionCount : function() {
        this.actionCount = this.actionCount + 1;
    },

    removeActionCount : function() {
        this.actionCount = this.actionCount - 1;
        if (this.actionCount < 0) this.actionCount = 0;
    },

    choose : function(id, type) {

        if (this.hasUpload && this.uploadType != type) return false;
        return file_chooser(id)
    },
    processMedia : function(type) {
        if (type == 'image') {
            if(editorModal.status) {
                var selector = $("#editorModal #feed-editor-image-selector");
            } else {
                var selector = $("#feed-editor-image-selector");
            }


            if(editorModal.status) {
                var info = $("#editorModal #photo-feed-media-selected-info");
                var imageInput = document.getElementById("editorModal-feed-editor-image-input");
            } else {
                var info = $("#photo-feed-media-selected-info");
                var imageInput = document.getElementById("feed-editor-image-input");
            }
            var span = selector.find('span');

            if (imageInput.files.length > maxPhotosUpload) {
                alert('Max no of images allowed is ' + maxPhotosUpload);
                return false;
            }
            if (!imageInput.files.length) return  this.removeImage();
            span.html(imageInput.files.length).fadeIn();



            info.find('.count').html(imageInput.files.length);
            info.fadeIn();
            this.hasUpload = true;
            this.uploadType = 'image';
        }  else if (type == 'video') {


            var selector = $("#feed-editor-video-selector");
            var span = selector.find('span');
            if(editorModal.status)
            {
                var info = $("#editorModal #video-feed-media-selected-info");
                var videoInput = document.getElementById("editorModal-feed-editor-video-input");
            }
            else
            {
                 var info = $("#video-feed-media-selected-info");
                 var videoInput = document.getElementById("feed-editor-video-input");
            }
            if (!videoInput.files.length) return  this.removeVideo();
             span.html(videoInput.files.length).fadeIn();

            info.find('.count').html(videoInput.files.length);
            info.fadeIn();
            this.hasUpload = true;
            this.uploadType = 'video';
        } else if(type == 'file') {

            var selector = $("#feed-editor-file-selector");
            selector.addClass('active');
           if(editorModal.status) {
                var info = $("#editorModal #file-feed-media-selected-info");
                var fileInput = document.getElementById("editorModal-feed-editor-file-input");
           } else {
                 var info = $("#file-feed-media-selected-info");
                 var fileInput = document.getElementById("feed-editor-file-input");
           }
            if (!fileInput.files.length) return  this.removeFile();
            info.find('.count').html(fileInput.files.length);
            info.fadeIn();
            this.hasUpload = true;
            this.uploadType = 'file';
        }
    },
    removeImage : function() {
        $("#feed-editor-image-input").val('');

        if(editorModal.status) {
           $("#editorModal #photo-feed-media-selected-info").fadeOut();
        } else {
            $("#feed-editor-image-selector span").html('').hide();
            $("#photo-feed-media-selected-info").fadeOut();
        }
        this.hasUpload = false;
        this.uploadType = '';
        return false;
    },
    removeVideo : function() {
        $("#feed-editor-video-input").val('');
         if(editorModal.status) {
                var info = $("#editorModal #video-feed-media-selected-info").fadeOut();
            } else {
                 var info = $("#video-feed-media-selected-info").fadeOut();
                 $("#feed-editor-video-selector span").html('').hide();
            }
        this.hasUpload = false;
        this.uploadType = '';
        return false;
    },
    removeFile : function() {
        $("#feed-editor-file-input").val('');
        $("#feed-editor-file-selector").removeClass('active');
        if(editorModal.status) {
            var info = $("#editorModal #file-feed-media-selected-info").fadeOut();
        } else {
             var info = $("#file-feed-media-selected-info").fadeOut();
        }
        this.hasUpload = false;
        this.uploadType = '';
        return false;
    },
    toggleCheckIn : function() {
        if(editorModal.status) {
            var container = $("#editorModal #feed-editor-check-in-input-container");
            var selector = $(" #editorModal  #feed-editor-check-in-input-selector");
        } else {
            var container = $("#feed-editor-check-in-input-container");
            var selector = $("#feed-editor-check-in-input-selector");
        }
        if (container.css('display') == 'none') {
            container.slideDown();
            selector.addClass('active');
            container.find('input').focus();
        } else {
            container.slideUp();
            if (container.find('input').val() == '') {
                selector.removeClass('active')
            }
        }

        return false;
    },
    removeCheckIn : function() {
        if(editorModal.status) {
            var container = $("#editorModal #feed-editor-check-in-input-container");
            var selector = $("#editorModal #feed-editor-check-in-input-selector");
        } else {
            var container = $("#feed-editor-check-in-input-container");
            var selector = $("#feed-editor-check-in-input-selector");
        }
        container.find('input').val('');
        container.slideUp();
        selector.removeClass('active');
        return false;
    },
    showTags : function() {
        var c = $("#feed-editor-tags-container");
        var selector = $("#feed-editor-tags-input-selector");
        if (c.css('display') == 'none') {
            c.slideDown();


            selector.addClass('active');
            c.find('input[type=text]').focus();
        } else {
            c.slideUp();
            if (c.find('.user').length < 1) {
                selector.removeClass('active')
            }
        }
        return false;
    },
    addTag : function(o) {
        var id = o.data('id');
        var name = o.data('name');
        if(editorModal.status) {
            if ($('#editorModal  #feed-editor-tags-container #user-' + id).length > 0) return false;
        } else {
            if ($('#feed-editor-tags-container #user-' + id).length > 0) return false;
        }
        var span = $("<span id='user-"+id+"' class='user'>"+name+"<input type='hidden' name='val[tags][]' value='"+id+"'/><a href=''><i class='ion-close'></i></a></span>");

        var input = $("#feed-editor-tags-container .input-field");
        input.before(span);
        input.find('#feed-tags-suggestion').fadeOut();
        input.find('input[type=text]').val('').focus();

    },

    removeTag : function(o) {
        o.parent().remove();
        var input = $("#feed-editor-tags-container .input-field");
        input.find('input[type=text]').focus();
    },
    formatFeedActivity : function() {

    },

    validateEditor: function() {

        if(feedEditor.hasUpload)
        {
            jQuery('#background').val('');
        }

        if(editorModal.status) {
            if ($("#editorModal-feed-editor-textarea").val() != '') return false;
        } else {
            if ($("#feed-editor-textarea").val() != '') return false;
        }
        if (this.actionCount > 0 || this.hasUpload) return false;
        if ($(".feed-editor-feeling-container").css('display') != 'none'  && $(".feed-editor-feeling-container input[type=text]").val() != "") return false;
        if ($("#feed-geocomplete").val() != '') return false;
        return true;
    },

    post_feed : function(form) {
        if (this.validateEditor()) {
            this.show_error();
            return false;
        }
        form.ajaxSubmit({
            url : baseUrl + 'feed/add',
            dataType : 'json',
            type : 'POST',
            beforeSend : function() {
                feedEditor.toggleIndicator();


            },
            success : function(data) {
                var json = data;

                if (json.status == 0) {
                    feedEditor.show_error(json.message);
                } else {
                    feedEditor.reset(form);
                    var feed = $("<div></div>");
                    feed.html(json.feed).hide();
                    $("#feed-lists").prepend(feed);
                    feed.fadeIn('fast');
                    jQuery('#editorModal').modal('hide');
                    notifySuccess(json.message);
                    reloadInits();
                    if ($('.feed-empty').length > 0) {
                        $('.feed-empty').fadeOut().remove();
                    }
                }

                feedEditor.toggleIndicator();
            },
            uploadProgress : function(event, position, total, percent) {
                if (!feedEditor.hasUpload) return false;
                var uI = $("#feed-media-upload-indicator");
                uI.html(percent + '%').fadeIn();
                if (percent == 100) {
                    uI.fadeOut().html("0%")
                }
            },
            error : function() {
                feedEditor.toggleIndicator();
            }
        });
    },
    show_error : function(message) {
        var o = $("#feed-editor-error");
        if (!message) {
            message = o.data('error');
        }
        notifyError(message);
    },

    reset : function() {
        $("#editorModal-feed-editor-textarea").val('').css('height', $("#editorModal-feed-editor-textarea").data('height'));
         $("#feed-editor-textarea").val('').css('height', $("#feed-editor-textarea").data('height'));
        $("#feed-editor-image-input").val('');
        $("#editorModal #feed-editor-image-input").val('');
         $("#editorModal #feed-editor-video-input").val('');
          $("#editorModal #feed-editor-file-input").val('');
        $("#feed-editor-video-input").val('');
        $(".feed-editor-poll-container").css('display','none');
        $("#feed-editor-file-input").val('');


        $("#feed-editor-image-selector").find('span').hide();
        $("#feed-editor-video-selector").find('span').hide();
        $("#feed-editor-tags-container").hide();
        $("#feed-editor-tags-container .user").each(function() {
            $(this).remove();
        });
        $("#feed-editor-check-in-input-container").hide().find('input[type=text]').val('');
          $("#editorModal #feed-editor-check-in-input-container").hide().find('input[type=text]').val('');
        $(".feed-editor-footer li").each(function() {
            $(this).removeClass('active')
        });
        $('.feed-media-selected-info').hide();
        this.actionCount = 0;
        this.hasUpload = false;
        this.uploadType = ''
        this.removeLinkDetails(true);


        $('.feed-editor-feeling-container').hide();
        $('.feed-editor-feeling-container input[type=text]').val('').show();
        $("#feed-feeling-selected-suggestion").html('');
        $("#feed-feeling-suggestion").fadeOut();
        $("feed-editor-feeling-data").val("");


        $("#feed-poll-enable-input").val(0);
        $(".poll-options-container input[type=text]").val('');
        $(".feed-editor-poll-container").hide();
        var b = $("#feed-editor-poll-toggle");
        $("#feed-editor-textarea").prop('placeholder', b.data('revert'));
        $("#editorModal-feed-editor-textarea").prop('placeholder', b.data('revert'));
        feedEditor.toggleBackground('close', 'default', true);
    },
    toggleIndicator : function() {
        if(editorModal.status) {
             var obj = $("#editorModal #post-editor-indicator");
        } else {
             var obj = $("#post-editor-indicator");
        }

        if (obj.css('display') == 'none') {
            obj.fadeIn();
        } else {
            obj.fadeOut();
        }
    },
    toggleBackground : function(action, className, clear) {
        if (editorModal.status) {
            var colors = $('#editorModal .feed-editor-colors');
            var background = $('#editorModal .feed-editor-background');
            var textarea = $('#editorModal-feed-editor-textarea');
        } else {
            var colors = $('.feed-editor-colors');
            var background = $('.feed-editor-background');
            var textarea = $('#feed-editor-textarea');
        }
        var input = $('.feed-editor-background-input');
        if(action == 'open') {
            $(colors).css('display', 'block');
            $(textarea).css('display', 'none');
            $(background).css('display', 'block');
        } else if(action == 'close') {
            $(colors).css('display', 'none');
            $(textarea).css('display', 'block');
            $(background).css('display', 'none');
        } else {
            if($(colors).css('display') == 'none') {
                $(colors).css('display', 'block');
                $(textarea).css('display', 'none');
                $(background).css('display', 'block');
            } else {
                $(colors).css('display', 'none');
                $(textarea).css('display', 'block');
                $(background).css('display', 'none');
            }
        }
        if(className) {
            $(background).attr('class', 'feed-editor-background ' + className);
            $(input).val(className);
        }
        if(clear) {
            $(textarea).val('');
            $(background).find('textarea').val(' ');
        }
        return false;
    }
};

function delete_feed(id) {
    var c = $("#feed-wrapper-" + id);
    confirm.action(function() {
        c.css('opacity', '0.5');
        $.ajax({
            url : baseUrl + 'feed/delete?id=' + id + '&csrf_token=' + requestToken,
            success : function(r) {
                if (r == 1) {
                    c.slideUp('slow');
                    c.remove();


                } else {
                    c.css('opacity', 1);
                }
            },
            error: function() {
                c.css('opacity', 1);
            }
        })
    });
    return false;
}
function pin_feed(t) {
    var o = $(t);
    $.ajax({
        url : o.attr('href') + '?csrf_token=' + requestToken,
        success : function(data) {
            window.location = window.location;
        }
    })

    return false;
}
function show_feed_edit_form(id) {
    var c = $("#feed-edit-form-" + id);
    if (c.css('display') == 'none') {
        c.fadeIn(500).find('textarea').focus();
    } else {
        c.slideUp();
    }
    return false;
}

function save_feed(id) {
    var form = $("#feed-edit-form-" + id);
    var indicator = form.find('.feed-edit-form-indicator');
    form.ajaxSubmit({
        url : baseUrl + 'feed/save?id=' + id,
        type : 'POST',
        beforeSend : function() {
            indicator.fadeIn();
            form.css('opacity', '0.5');
        },
        success : function(data) {
            if (data == '0') {

            } else {
                $("#feed-content-" + id).find('.content').html(data);
                form.slideUp();
            }
            indicator.fadeOut();
            form.css('opacity', 1);
        },
        error : function () {
            indicator.fadeOut();
            form.css('opacity', 1);
        }
    })
    return false;
}

window.feed_paginating = false;
function paginate_feed() {
    if (window.feed_paginating) return false;
    window.feed_paginating = true;
    var c = $("#feed-lists");
    var limit = c.data('limit');
    var offset = c.data('offset');
    var type = c.data('type');
    var typeId = c.data('type-id');

    toggle_feed_paginate_indicator();
    if(typeof(sortFeed) != "undefined") {
        if(typeof(sortFeed.sortBy) != "undefined") {
            var sort = sortFeed.sortBy || null;
        } else {
            var sort = null;
        }
    } else {
        var sort = null;
    }
    $.ajax({
        url : baseUrl + 'feed/more?csrf_token=' + requestToken,
        dataType : 'html',
        type : 'GET',
        data : {
            offset: offset,
            type: type,
            type_id: typeId,
            sortby: sort
        },
        success : function(data) {
            window.feed_paginating = false;
            var json = jQuery.parseJSON(data);
            if (json.feeds == '') {
                $('.feed-load-more').fadeOut();
            } else {
                var div = $("<div style='display: none'></div>");
                div.html(json.feeds);
                c.append(div).data('offset', json.offset);
                setTimeout(function() {
                    div.fadeIn(300);
                    reloadInits();
                    toggle_feed_paginate_indicator();

                }, 500)


            }

        },
        error : function() {
            window.feed_paginating = false;
            toggle_feed_paginate_indicator();
        }
    })

}

function toggle_feed_paginate_indicator() {
    var  m = $('.feed-load-more img');
    if (m.css('display') == 'none') {
        m.css('display', 'block').fadeIn();
    } else {
        m.hide();
    }




}

function share_feed(id, m) {
    confirm.action(function() {
        $.ajax({
            url : baseUrl + 'feed/share?id=' + id + '&csrf_token=' + requestToken,
            success : function(data) {
                json = jQuery.parseJSON(data);
                if(json.count != '') $("#feed-share-count-" + id).html(json.count);
                notifySuccess(json.message)
            },
            error : function() {

            }
        })
    }, m);

    return false;
}

function toggle_feed_notification(id) {
    var o = $("#feed-notifications-" + id);
    var onT = o.data('on');
    var offT = o.data('off');
    var turned = o.attr('data-turned');

    if (turned == 1) {
        o.attr('data-turned', '0').html(onT);
        w = 0;
    } else {
        o.attr('data-turned', '1').html(offT);
        w = 1;
    }
    $.ajax({
        url : baseUrl + 'feed/notification?type=' + w+'&id='+id + '&csrf_token=' + requestToken,
    });

    return false;
}

function hide_feed(id) {
    var c = $("#feed-hide-container-" + id);
    var w = $("#feed-wrapper-" + id);
    $.ajax({
        url : baseUrl + 'feed/hide?id=' + id + '&csrf_token=' + requestToken,
        success : function() {
            w.fadeOut();
            c.fadeIn();
        },
        error : function() {
            notifyError(c.data('error'));
        }
    });
    return false;
}

function unhide_feed(id) {
    var c = $("#feed-hide-container-" + id);
    var w = $("#feed-wrapper-" + id);
    $.ajax({
        url : baseUrl + 'feed/unhide?id=' + id + '&csrf_token=' + requestToken,
        success : function() {
            w.fadeIn();
            c.fadeOut();
        },
        error : function() {
            notifyError(c.data('error'));
        }
    });
    return false;
}

function init_feed_realtime_update() {
    if (feedUpdate && loggedIn) {
        var c = $('#feed-lists');
        var type = 'feed';
        var typeId = '';
        var container = 0;
        if (c.length) {
            type = c.data('type');
            typeId = c.data('type-id');
            container = 1;

            $.ajax({
                url : baseUrl + 'check/new/feeds?csrf_token=' + requestToken,
                type : 'POST',
                data :{type:type,typeId:typeId, container: container},
                success : function(data) {
                    var json = jQuery.parseJSON(data);
                    if (json.count > 0) {
                        if (c.length > 0) {
                            var div = $("<div></div>");


                            if (json.feeds != '') {
                                div.html(json.feeds).hide();
                                c.prepend(div);

                            }
                            if (document.body.scrollTop > 50) {

                                var a = $("#feed-top-update-alert");
                                a.find('span').html(json.count);
                                a.fadeIn().click(function() {
                                    $('body').click().animate({scrollTop : 0}, 200);
                                    div.fadeIn();
                                    reloadInits();
                                    $(this).fadeOut();
                                    return false;
                                });
                            } else {
                                setTimeout(function() {
                                    div.fadeIn();
                                    reloadInits();
                                }, 300);
                            }
                        } else {

                        }

                    }


                },
                error : function() {

                }
            })
        }
    }

}


function show_poll_submit_button(id) {
    var c = $("#feed-poll-" + id);
    c.find('.poll-button').fadeIn();
}

function hide_poll_submit_button(id) {
    var c = $("#feed-poll-" + id);
    c.find('.poll-button').fadeOut();
    c.find("input[type=radio]").prop('checked', "");
}

function submit_feed_poll(f) {
    var f = $("#poll-form-" + f);
    f.css('opacity', '0.5');


    f.ajaxSubmit({
        url : baseUrl + 'feed/submit/poll',
        success : function(data) {
            $("#feed-poll-" + f.data('id')).html(data);
        }
    })
    return false;
}

function geoCompleteInit() {
    try{
        $("#feed-geocomplete").geocomplete()
            .bind("geocode:result", function(event, result){


            });
    } catch(e) {}
}
$(function() {
    feedEditor.init();
    setInterval(function() {
        init_feed_realtime_update();
    }, feedUpdateInterval);

    $(window).scroll(function() {
        
        if ($(this).scrollTop() > $(document).height() - $(this).height() - 800) {


            paginate_feed();
        }
    });

    $(document).on('click','.feed-load-more', function() {
        if ($('#feed-lists').length) {
            paginate_feed();
        };
        return false;
    });



    geoCompleteInit()
});

addPageHook("geoCompleteInit");


function show_voters(t, answer_id, page) {
    page = page || 1;
    var modal = $('#photoViewer');
    modal.modal('hide');
    var m = $("#likesModal");
    var o = $(t);
    var title = m.find('.modal-title');
    title.html(o.data('otitle'));
    m.modal("show");
    var indicator = m.find('.indicator');
    indicator.fadeIn();
    var lists = m.find('.user-lists');
    lists.html('');
    $.ajax({
        url : baseUrl + 'feed/load/voters?answer_id=' + answer_id + '&page=' + page + '&csrf_token=' + requestToken,
        success : function(data) {
            indicator.hide();
            lists.html(data);

        }
    })
    return false;
}

function paginate_voters(answer_id, page) {
    var modal = $('#photoViewer');
    modal.modal('hide');
    var m = $("#likesModal");
    m.modal("show");
    var indicator = m.find('.indicator');
    indicator.fadeIn();
    var lists = m.find('.user-lists');
    lists.html('');
    $.ajax({
        url : baseUrl + 'feed/load/voters?answer_id=' + answer_id + '&page=' + page + '&csrf_token=' + requestToken,
        success : function(data) {
            indicator.hide();
            lists.html(data);

        }
    });
    return false;
}

$(document).ready(function() {
    $('#feed-editor-textarea').change(function() {
        $('#feed-editor-textarea-bg').val($(this).val());
        $('#editorModal-feed-editor-textarea').val($(this).val());
        $('#editorModal-feed-editor-textarea-bg').val($(this).val());
    });
    $('#feed-editor-textarea-bg').change(function() {
        $('#feed-editor-textarea').val($(this).val());
        $('#editorModal-feed-editor-textarea').val($(this).val());
        $('#editorModal-feed-editor-textarea-bg').val($(this).val());
    });
    $('#editorModal-feed-editor-textarea').change(function() {
        $('#feed-editor-textarea').val($(this).val());
        $('#feed-editor-textarea-bg').val($(this).val());
        $('#editorModal-feed-editor-textarea-bg').val($(this).val());
    });
    $('#editorModal-feed-editor-textarea-bg').change(function() {
        $('#feed-editor-textarea').val($(this).val());
        $('#feed-editor-textarea-bg').val($(this).val());
        $('#editorModal-feed-editor-textarea').val($(this).val());
    });
});




function showEditorModal() {
    var editorModal = jQuery('#editorModal');
    if(jQuery(window).width() >= 768) {
        editorModal.modal('show');
    }
}





$('#editorModal-feed-editor-textarea').keyup(function(){
    var str = $(this).val();
    if (str == '') {
        feedEditor.hasLink = false;
        feedEditor.processedLink = '';
        feedEditor.processingLink = false;
    }
    if (feedEditor.hasLink || feedEditor.processingLink) return false;

    if(editorModal.status) {
        var container = $("#editorModal #feed-editor-link-container");
    } else {
        var container = $("#feed-editor-link-container");
    }
    var indicator = container.find('.link-indicator');
    var content = container.find('.link-content');
    content.html('');
    var split = str.split(" ");
    if (split.length > 0) {
        var foundLink = searchTextForLink(str);
        if (foundLink != '' && foundLink != feedEditor.processedLink) {
            feedEditor.processingLink = true;
            container.fadeIn();
            indicator.fadeIn();
            $.ajax({
                url : baseUrl + 'feed/link/get?csrf_token=' + requestToken,
                type : 'POST',
                cache : false,
                data : {link : foundLink},
                success : function(data) {
                    if (data) {
                        feedEditor.processingLink = false;
                        feedEditor.hasLink = true;
                        feedEditor.processedLink = foundLink;
                        indicator.hide();
                        content.html(data);
                    } else {
                        feedEditor.hasLink = false;
                        feedEditor.processedLink = '';
                        feedEditor.processingLink = false;
                    }
                },
                error : function() {
                    container.hide();
                    indicator.hide();
                    feedEditor.hasLink = false;
                    feedEditor.processedLink = '';
                    feedEditor.processingLink = false;
                }
            })
        }
    }
});
;function upload_game_profile_cover() {
    toggle_profile_cover_indicator(true);
    var id = $('#game-profile-container').data('id');
    $("#profile-cover-change-form").ajaxSubmit({
        url : baseUrl + 'game/change/cover?id=' + id,
        success: function(data) {
            var result = jQuery.parseJSON(data);
            if (result.status == 0) {
                alert(result.message);
            } else {
                var img = result.image;
                $('.profile-cover-wrapper img').attr('src', img);
                $('.profile-resize-cover-wrapper img').attr('src', result.original);
                reposition_user_profile_cover();
            }
            toggle_profile_cover_indicator(false);
        }
    })
}

function save_game_profile_cover() {
    var i = $('#profile-cover-resized-top').val();
    var id = $('#game-profile-container').data('id');
    var width = $('#game-profile-container').data('width');
    if (i == 0) {
        refresh_profile_cover_positioning()
    } else {
        toggle_profile_cover_indicator(true);
        $.ajax({
            url : baseUrl + 'game/cover/reposition?pos=' + i + '&id=' + id+'&width=' + width + '&csrf_token=' + requestToken,
            success: function(data) {
                $('.profile-cover-wrapper img').attr('src', data);
                toggle_profile_cover_indicator(false);
                refresh_profile_cover_positioning();
            },
            error : function() {
                toggle_profile_cover_indicator(false);
                refresh_profile_cover_positioning();
            }
        })
    }
    return false;
}

function remove_game_profile_cover(img) {

    $('.profile-cover-wrapper img').attr('src', img);
    $('.profile-resize-cover-wrapper img').attr('src', '');
    var id = $('#game-profile-container').data('id');
    $.ajax({
        url : baseUrl + 'game/cover/remove?id=' + id + '&csrf_token=' + requestToken,
    });
    return false;
}

$(function() {

})
;function getstarted_show_avatar() {
    var image = document.getElementById("getstarted-image-input");
    for(i = 0; i < image.files.length; i++) {
        if (typeof FileReader != "undefined") {

            var reader = new FileReader();
            reader.onload = function(e) {
                var img = $("#getstarted-avatar");
                img.css('background-image', 'url(' + e.target.result + ')');
            }
            reader.readAsDataURL(image.files[i]);
        }
    }
};function upload_group_profile_cover() {
    toggle_profile_cover_indicator(true);
    var id = $('#group-profile-container').data('id');
    $("#profile-cover-change-form").ajaxSubmit({
        url : baseUrl + 'group/change/cover?id=' + id,
        success: function(data) {
            var result = jQuery.parseJSON(data);
            if (result.status == 0) {
                notifyError(result.message);
            } else {
                var img = result.image;
                $('.profile-cover-wrapper img').attr('src', img);
                $('.profile-resize-cover-wrapper img').attr('src', result.original);
                reposition_user_profile_cover();
            }
            toggle_profile_cover_indicator(false);
        }
    })
}

function save_group_profile_cover() {
    var i = $('#profile-cover-resized-top').val();
    var id = $('#group-profile-container').data('id');
    var width = $('#group-profile-container').data('width');
    if (i == 0) {
        refresh_profile_cover_positioning()
    } else {
        toggle_profile_cover_indicator(true);
        $.ajax({
            url : baseUrl + 'group/cover/reposition?pos=' + i + '&id=' + id+'&width=' + width + '&csrf_token=' + requestToken,
            success: function(data) {
                $('.profile-cover-wrapper img').attr('src', data);
                toggle_profile_cover_indicator(false);
                refresh_profile_cover_positioning();
            },
            error : function() {
                toggle_profile_cover_indicator(false);
                refresh_profile_cover_positioning();
            }
        })
    }
    return false;
}

function remove_group_profile_cover(img) {

    $('.profile-cover-wrapper img').attr('src', img);
    $('.profile-resize-cover-wrapper img').attr('src', '');
    var id = $('#group-profile-container').data('id');
    $.ajax({
        url : baseUrl + 'group/cover/remove?id=' + id + '&csrf_token=' + requestToken,
    });
    return false;
}

function upload_group_logo() {
    var form = $("#group-profile-image-form");
    show_profile_image_indicator(true);
    var id = form.data('id');
    form.ajaxSubmit({
        url : baseUrl + 'group/change/logo?id=' + id,
        success : function(data) {
            data = jQuery.parseJSON(data);
            show_profile_image_indicator(false);
            if (data.status) {
                $(".profile-image").attr('src', data.image);
            } else {
                alertDialog(data.message);
            }
            form.find('input[type=file]').val('')
        },
        uploadProgress : function(event, position, total, percent) {
            var uI = $(".profile-image-indicator .percent-indicator");
            uI.html(percent + '%').fadeIn();

        },
        error : function() {
            show_profile_image_indicator(false);
            alertDialog("An error occurred");
            form.find('input[type=file]').val('')
        }
    })
}

function join_group(t) {
    var obj = $(t);
    var status = obj.data('status');
    var id = obj.data('id');
    obj.css('opacity', '0.5');
    $.ajax({
        url : baseUrl + 'group/join?id=' + id + '&status=' + status + '&csrf_token=' + requestToken,
        success : function() {


            window.location = window.location;
        },
        error : function() {
            obj.css('opacity', 1);
        }
    })

    return false;
}

function process_group_role(t, id, uid) {
    var obj = $(t);
    obj.css('opacity', '0.5');
    $.ajax({
        url : baseUrl + 'group/member/role?id=' + id + '&uid=' + uid + '&v=' + obj.val() + '&csrf_token=' + requestToken,
        success : function(data) {
            notifySuccess(data);
            obj.css('opacity', 1);
        }
    })
}

$(function() {
    $(document).on('click', '#group-tags-suggestion a', function() {
        $('#group-tags-suggestion').hide();
        var uid = $(this).data('id');
        var id = $('#group-tags-suggestion').data('id');
        $('#group-tags-suggestion-input').val('')
        $.ajax({
            url : baseUrl + 'group/add/member?id=' + id + '&uid=' + uid + '&csrf_token=' + requestToken,
            success : function(data) {
                notifySuccess(data);
            }
        })
        return false;
    });
})


function group_set_list_type(type) {
    $.ajax({url: baseUrl + 'group/ajax?action=set_list_type&type=' + type + '&csrf_token=' + requestToken});
};function help_open_menu(t) {
    var o = $(t);
    var ul = o.next();
    if (ul.css('display') == 'none') {
        ul.slideDown();
    } else {
        ul.slideUp();
    }

    return false;
};function like_item(type, typeId) {
    var o = $(".like-button-" + type + '-' + typeId);
    var count = $(".like-count-" + type + '-' + typeId);
    var status = o.attr('data-status');
    var dislike = $(".dislike-button-" + type + '-' + typeId);
    var dislikeCount = $(".dislike-count-" + type + '-' + typeId);
    if (status == 0) {


        dislike.removeClass('disliked');
        dislike.attr('data-status', 0);
        o.addClass('liked').attr('data-status', 1);
        w = 1;
    } else {


        o.removeClass('liked');
        o.attr('data-status', 0);
        w = 0;
    }

    $.ajax({
        url : baseUrl + 'like/item?type=' + type + '&type_id=' + typeId + '&w=' + w + '&action=like&csrf_token=' + requestToken,
        type : 'GET',
        success : function(data) {
            var json = jQuery.parseJSON(data);
            count.html(json.likes);
            dislikeCount.html(json.dislikes);
        }
    });
    return false;
}

function dislike_item(type, typeId) {
    var o = $(".dislike-button-" + type + '-' + typeId);
    var count = $(".dislike-count-" + type + '-' + typeId);
    var likeO = $(".like-button-" + type + '-' + typeId);
    var likeCount = $(".like-count-" + type + '-' + typeId);
    var status = o.attr('data-status');

    if (status == 0) {


        likeO.removeClass('liked');
        likeO.attr('data-status', 0);
        o.addClass('disliked').attr('data-status', 1);
        w = 1;
    } else {


        o.removeClass('disliked');
        o.attr('data-status', 0);
        w = 0;
    }

    $.ajax({
        url : baseUrl + 'like/item?type=' + type + '&type_id=' + typeId + '&w=' + w + '&action=dislike&csrf_token=' + requestToken,
        type : 'GET',
        success : function(data) {
            var json = jQuery.parseJSON(data);
            count.html(json.dislikes);
            likeCount.html(json.likes);
        }
    })

    return false
}

function show_likes(type, typeId) {
    var modal = $('#photoViewer');
    modal.modal('hide'); //hide photo viewer is open to prevent collission
    var m = $("#likesModal");
    var modal = $('#photoViewer');
    modal.modal('hide');
    var title = m.find('.modal-title');
    title.html(title.data('like'));
    m.modal("show");
    var indicator = m.find('.indicator');
    indicator.fadeIn();
    var lists = m.find('.user-lists');
    lists.html('');
    $.ajax({
        url : baseUrl + 'like/load/people?type='+type + "&id=" + typeId+'&action=1&csrf_token=' + requestToken,
        success : function(data) {
            indicator.hide();
            lists.html(data);

        }
    })
    return false;
}

function show_dislikes(type, typeId) {
    var m = $("#likesModal");
    var modal = $('#photoViewer');
    modal.modal('hide');
    var title = m.find('.modal-title');
    title.html(title.data('dislike'));
    m.modal("show");
    var indicator = m.find('.indicator');
    indicator.fadeIn();
    var lists = m.find('.user-lists');
    lists.html('');
    $.ajax({
        url : baseUrl + 'like/load/people?type='+type + "&id=" + typeId+'&action=0&csrf_token=' + requestToken,
        success : function(data) {
            indicator.hide();
            lists.html(data);

        }
    })
    return false;
}

function show_reactors(t,type, typeId) {
    var modal = $('#photoViewer');
    modal.modal('hide');
    var m = $("#likesModal");
    var o = $(t);
    var title = m.find('.modal-title');
    title.html(o.data('otitle'));
    m.modal("show");
    var indicator = m.find('.indicator');
    indicator.fadeIn();
    var lists = m.find('.user-lists');
    lists.html('');
    $.ajax({
        url : baseUrl + 'like/load/people?type='+type + "&id=" + typeId+'&action=3&csrf_token=' + requestToken,
        success : function(data) {
            indicator.hide();
            lists.html(data);

        }
    })
    return false;
}

function react(type, typeId, t) {
    var ob = $('.reactors-' + type + '-' + typeId);
    ob.css("opacity",'0.6');

    $.ajax({
        url : baseUrl + 'like/react?type=' +type + '&id=' + typeId + '&code=' + t + '&csrf_token=' + requestToken,
        success : function(data) {


            ob.css("opacity",1).html(data);
            reloadInits();
        }
    });
}

$(function() {
    $(document).on('mouseover', '.react-button', function() {
        var t = $(this);
        var target = t.data('target');
        var pane = $(".react-items-" +target);
        pane.fadeIn();
    });

    $(document).on('click', '.react-items a', function() {
        var $obj = $(this);
        var $type = $obj.data('type');
        var $typeId = $obj.data('target');
        var $code = $obj.data('code');
        var $b = $(".react-button-" + $type + '-' + $typeId);
        $b.addClass('liked');
        react($type, $typeId, $code);
        $('.react-items').fadeOut();
        return false;
    });

    $(document).on('click', '.react-button', function() {
        var $obj = $(this);
        var $type = $obj.data('type');
        var $typeId = $obj.data('target')
        if ($obj.hasClass('liked')) {
            react($type,$typeId, 0);
            $obj.removeClass('liked');
        } else {
            $obj.addClass('liked');
            react($type,$typeId, 1);
        }
        return false;
    });

    $(document).on('mousemove', 'body', function(e) {
        if(!$(e.target).closest($('.feed-react')).length ) $('.react-items').fadeOut();
    });
});
;$(function() {
    $(document).on('keyup', '.mention-input', function() {
        var str = $(this).val();
        var aStr = str.split(' ');
        var o = $(this);
        var container = $(o.data('mention'));
        container.find('.listing').html('').show();
        container.find('.indicator').fadeIn();
        if (aStr.length > 0) {
            var lStr = aStr[aStr.length - 1];
            var nStr = lStr.split('');
            if (lStr.length > 2 && nStr.length > 0) {
                var char = nStr[0];
                if (char.toLowerCase() == '@') {
                    container.fadeIn();
                    $(document).click(function(e) {
                        if(!$(e.target).closest(o.data('mention')).length) container.fadeOut();
                    });
                    $.ajax({
                        url : baseUrl + 'mention/find?csrf_token=' + requestToken,
                        data : {text: lStr.replace('@', '')},
                        case : false,
                        success : function(r) {


                            container.find('.indicator').fadeOut();
                            if (r != '') {
                                container.find('.listing').html(r).find('a').click(function() {
                                    var name = $(this).data('tag');
                                    aStr[aStr.length - 1] = name;
                                    var s = '';
                                    for(i = 0; i < aStr.length; i++) {
                                        s += aStr[i] + ' ';
                                    }
                                    o.select().val(s + ' ');

                                    container.fadeOut();
                                    return false;
                                })
                            } else{
                                container.fadeOut();
                            }
                        },
                        error : function() {
                            container.fadeOut();
                        }
                    })
                }
            }
        }
    })
});function show_notification_dropdown() {
    var dropdown = $(".notifications-dropdown");
    var indicator = dropdown.find('#notification-dropdown-indicator');
    var content = dropdown.find('.notification-dropdown-result-container');
    if (dropdown.css('display') == 'none') {
        dropdown.fadeIn();
        indicator.show();
        $.ajax({
            url : baseUrl + 'notification/load/latest?csrf_token=' + requestToken,
            success : function(data) {
                content.html(data);
                indicator.hide();
                reloadInits();
            }
        })
    } else {
        dropdown.fadeOut();
    }
    $(document).click(function(e) {
        if(!$(e.target).closest("#notification-dropdown-container").length) dropdown.hide();
    });
    return false;
}

function process_notification_mark(id) {
    var c = $("#notification-" + id);
    var b = c.find('.mark-button');
    var status = b.attr('data-status');
    var lRead = b.data('read');
    var lMark = b.data('mark');
    var type = (status == '0') ? 1 : 0;
    $.ajax({
        url : baseUrl + 'notification/mark?id=' + id + '&type=' + type + '&csrf_token=' + requestToken,
    });
    if (status == 0) {
        c.removeClass("notification-unread");
        b.attr('title', lRead).attr('data-status', type);
    } else {
        c.addClass("notification-unread");
        b.attr('title', lMark).attr('data-status', type);
    }
    return false;
}

function delete_notification(id) {
    var c = $("#notification-" + id);
    c.fadeOut();
    $('div[id=notification-' + id + ']').fadeOut();


    $.ajax({
        url : baseUrl + 'notification/delete?id=' + id + '&csrf_token=' + requestToken,
    });
    return false;
}

function push_notification(type, d) {
    if (type == 'notification') {
        var notyCounts = 0;
        var a = $("#notification-dropdown-container > a");
        if (!a.find('span').length) {
            a.append("<span class='count' style='display:none'></span>")
        }
        var span = a.find('span');
        var nIds = '';
        $.each(d, function(pushId, nId) {
            if (!Pusher.hasPushId(pushId)) {
                Pusher.addPushId(pushId);
                nIds += (nIds) ? ',' + nId : nId;
            }
            notyCounts +=1;
        });

        if (notyCounts > 0) {
            span.html(notyCounts).fadeIn();
            Pusher.addCount(notyCounts);
        } else {
            span.remove();
        }

        a.click(function() {
           Pusher.removeCount(notyCounts);
            span.hide();
        });
        if (nIds) {
            $.ajax({
                url : baseUrl + 'notification/preload?csrf_token=' + requestToken,
                data : {ids : nIds},
                success : function(data) {
                    var c = $(".notification-dropdown-result-container");
                    c.prepend(data);
                    if (data) {

                        initNotificationPopup(data);
                    }
                    reloadInits();
                }
            })
        }
    }
}

Pusher.addHook('push_notification');

function initNotificationPopup(data) {

    $("#notification-popup").find('#content').html(data);
    $("#notification-popup").fadeIn();
    setTimeout(function() {
        $("#notification-popup").fadeOut(300);
    }, 5000);

}

function closeNotificationpopup() {
    $("#notification-popup").fadeOut(300);
    return false;
}
$(function() {
   $(document).on('mouseover', '.notification', function() {
       $(this).find('.actions').show();
   });

    $(document).on('mouseout', '.notification', function() {
        $(this).find('.actions').hide();
    });
});;function upload_page_profile_cover() {
    toggle_profile_cover_indicator(true);
    var id = $('#page-profile-container').data('id');
    $("#profile-cover-change-form").ajaxSubmit({
        url : baseUrl + 'page/change/cover?id=' + id,
        success: function(data) {
            var result = jQuery.parseJSON(data);
            if (result.status == 0) {
                alert(result.message);
            } else {
                var img = result.image;
                $('.profile-cover-wrapper img').attr('src', img);
                $('.profile-resize-cover-wrapper img').attr('src', result.original);
                $("#profile-cover-viewer").data('id', result.id);
                $("#profile-cover-viewer").data('image', result.original);
                $("#profile-cover-viewer").addClass('photo-viewer');
                reposition_user_profile_cover();
            }
            toggle_profile_cover_indicator(false);
        }
    })
}

function save_page_profile_cover() {
    var i = $('#profile-cover-resized-top').val();
    var id = $('#page-profile-container').data('id');
    var width = $('#page-profile-container').data('width');
    if (i == 0) {
        refresh_profile_cover_positioning()
    } else {
        toggle_profile_cover_indicator(true);
        $.ajax({
            url : baseUrl + 'page/cover/reposition?pos=' + i + '&id=' + id+'&width=' + width + '&csrf_token=' + requestToken,
            success: function(data) {
                $('.profile-cover-wrapper img').attr('src', data);
                toggle_profile_cover_indicator(false);
                refresh_profile_cover_positioning();
            },
            error : function() {
                toggle_profile_cover_indicator(false);
                refresh_profile_cover_positioning();
            }
        })
    }
    return false;
}

function remove_page_profile_cover(img) {

    $('.profile-cover-wrapper img').attr('src', img);
    $('.profile-resize-cover-wrapper img').attr('src', '');
    var id = $('#page-profile-container').data('id');
    $.ajax({
        url : baseUrl + 'page/cover/remove?id=' + id + '&csrf_token=' + requestToken,
    });
    return false;
}

function upload_page_logo() {
    var form = $("#page-profile-image-form");
    show_profile_image_indicator(true);
    var id = form.data('id');
    form.ajaxSubmit({
        url : baseUrl + 'page/change/logo?id=' + id,
        success : function(data) {
            data = jQuery.parseJSON(data);
            show_profile_image_indicator(false);
            if (data.status) {
                $(".profile-image").attr('src', data.image);
                $("#profile-image-viewer").data('id', data.id);
                $("#profile-image-viewer").data('image', data.large);
            } else {
                alertDialog(data.message);
            }
            form.find('input[type=file]').val('')
        },
        uploadProgress : function(event, position, total, percent) {
            var uI = $(".profile-image-indicator .percent-indicator");
            uI.html(percent + '%').fadeIn();

        },
        error : function() {
            show_profile_image_indicator(false);
            alertDialog("An error occurred");
            form.find('input[type=file]').val('')
        }
    })
}

function page_invite_friend(l, u, p) {
    var obj = $(l);
    obj.css('opacity', '0.5');
    $.ajax({
        url : baseUrl + 'page/invite/friend?page=' + p + '&user=' + u + '&csrf_token=' + requestToken,
        success : function(data) {
            obj.remove();
        },
        error : function() {
            obj.css('opacity', 1);
        }
    });
    return false;
}

function page_search_invite_friend(i) {
    var input = $(i);
    var container = $(".invite-friends-list");
    if (input.val().length > 1) {
        $.ajax({
            url : baseUrl + 'page/invite/search?page=' + container.data('id') + '&term=' + input.val() + '&csrf_token=' + requestToken,
            success : function(data) {
                container.html(data);
            }
        })
    }
}

function page_hook_page_loaded() {
    var container = $(".invite-friends-list");


    container.slimScroll().bind('slimscroll', function(e, pos) {
        if (pos == 'bottom') {
            $.ajax({
                url : baseUrl + 'page/more/invite?offset=' + container.data('offset') + '&id=' + container.data('id') + '&csrf_token=' + requestToken,
                success : function(data) {
                    var json = jQuery.parseJSON(data);
                    container.append(json.users);
                    container.attr('data-offset', json.offset);
                    container.data('offset', json.offset);
                }
            })
        }
    });
}

addPageHook('page_hook_page_loaded');
$(function() {
    page_hook_page_loaded()
    $(document).on("click", "#page-user-role-suggestion a", function() {
        var o = $(this);
        var userid = o.data('id');
        if ($("#role-" + userid).length) {
            $("#page-user-role-suggestion").hide();
            return false;
        }
        var div = $("<div data-saved='false' id='role-"+userid+"' style='display: none' class='media media-lg'></div>");
        div.html($("#page-role-template").html())
        div.find(".media-object").html(o.find('.media-object'));
        div.find(".media-heading").html(o.find('.media-heading'));
        div.find('select').prop('name', 'val['+ o.data('id')+']');
        div.find('.role-delete-button').attr('data-userid', userid);
        $("#page-role-lists").append(div);
        div.fadeIn(500);
        $("#page-user-role-suggestion").hide();
        return false;
    });

    $(document).on('click', ".role-delete-button", function() {
        var pageId = $(this).data('page-id');
        var userid = $(this).attr('data-userid');
        var role = $("#role-" + userid);
        if (role.attr('data-saved') == 'false') {
            role.slideUp().remove();
            return false;
        }
        confirm.action(function() {
            role.css('opacity', '0.7');
            $.ajax({
                url : baseUrl + 'page/role/remove?csrf_token=' + requestToken,
                data: {page:pageId,user:userid},
                success : function() {
                    role.slideUp().remove();
                },
                error : function() {
                    role.css('opacity', 1);
                }
            })
        });
        return false;
    })
});

function page_set_list_type(type) {
    $.ajax({url: baseUrl + 'page/ajax?action=set_list_type&type=' + type + '&csrf_token=' + requestToken});
};function upload_album_photos(id) {
    var form = $("#photos-list .upload-photo form");
    var indicator = $("#photos-list .upload-photo .indicator");
    var input = form.find('input[type=file]');
    var imageInput = document.getElementById("album-photo-upload-input");
    if (imageInput.files.length > maxPhotosUpload) {
        alert('Max no of images allowed is ' + maxPhotosUpload);
        notifyError('Max no of images allowed is ' + maxPhotosUpload);
        indicator.fadeOut();
        input.val('');
        return false;
    }
    var container = $("#photos-list .upload-photo");
    form.ajaxSubmit({
        url : baseUrl + 'photo/album/upload?id=' +id,
        beforeSend : function () {
            indicator.show();
        },
        success : function(data) {
            var json = jQuery.parseJSON(data);
            if (json.status == 0) {
                notifyError(json.message);
            } else {
                notifySuccess(json.message);
                $(json.photos).insertAfter(container);
            }
            input.val('');
            indicator.fadeOut();
        },
        uploadProgress : function(event, position, total, percent) {

            var uI = indicator.find('span');
            uI.html(percent + '%').fadeIn();
            if (percent == 100) {
                uI.fadeOut().html("0%")
            }
        },
        error : function() {
            notifyError(form.data('error'));
            indicator.fadeOut();
            input.val('');
        }
    })
}

function upload_photos() {
    var form = $("#photos-list .upload-photo form");
    var indicator = $("#photos-list .upload-photo .indicator");
    var input = form.find('input[type=file]');
    var imageInput = document.getElementById("photo-upload-input");
    if (imageInput.files.length > maxPhotosUpload) {
        alert('Max no of images allowed is ' + maxPhotosUpload);
        notifyError('Max no of images allowed is ' + maxPhotosUpload);
        indicator.fadeOut();
        input.val('');
        return false;
    }
    var container = $("#photos-list .upload-photo");
    form.ajaxSubmit({
        url : baseUrl + 'photo/upload',
        beforeSend : function () {
            indicator.show();
        },
        success : function(data) {
            var json = jQuery.parseJSON(data);
            if (json.status == 0) {
                notifyError(json.message);
            } else {
                notifySuccess(json.message);
                $(json.photos).insertAfter(container);
            }
            input.val('');
            indicator.fadeOut();
        },
        uploadProgress : function(event, position, total, percent) {
            var uI = indicator.find('span');
            uI.html(percent + '%').fadeIn();
            if (percent == 100) {
                uI.fadeOut().html("0%")
            }
        },
        error : function() {
            notifyError(form.data('error'));
            indicator.fadeOut();
            input.val('');
        }
    })
}

function delete_photo_album(m, u) {
    confirm.url(u, m);
    return false;
}

window.paginatingAlbumPhotos = false;
function paginate_album_photos() {
    var container = $("#photos-list");
    var id = container.data('id');
    var type = container.data('type');
    var offset = container.data('offset');
    var indicator = $("#photos-list-indicator");
    var indicatorImg = indicator.find('img');
    indicatorImg.fadeIn();
    if (window.paginatingAlbumPhotos || indicator.css('display') == 'none') return false;
    window.paginatingAlbumPhotos = true;
    $.ajax({
        url : baseUrl + 'photo/album/photos/paginate?csrf_token=' + requestToken,
        data : {id : id, type : type,offset : offset},
        success : function(data) {
            var data = jQuery.parseJSON(data);


            if (data.photos != '') {
                indicatorImg.fadeOut();
                container.append(data.photos);
                container.data('offset', data.offset);

            } else {
                indicator.hide();
            }
            window.paginatingAlbumPhotos = false;
        },
        error : function() {
            indicatorImg.fadeOut();
            window.paginatingAlbumPhotos = false;
        }
    });

    return false;
}

function paginate_photo_albums() {
    var container = $("#photo-album-lists");

    var id = container.data('type-id');
    var type = container.data('type');
    var offset = container.data('offset');
    var category = container.data('category')
    var link = encodeURI(container.data('link')) ? encodeURI(container.data('link')) : container.data('link');
    var indicator = $("#photos-list-indicator");
    var indicatorImg = indicator.find('img');
    indicatorImg.fadeIn();
    if (window.paginatingAlbumPhotos || indicator.css('display') == 'none') return false;
    window.paginatingAlbumPhotos = true;
    $.ajax({
        url : baseUrl + 'photo/album/paginate?csrf_token=' + requestToken,
        data : {id : id, type : type,offset : offset,category: category, link : link},
        success : function(data) {
            var data = jQuery.parseJSON(data);


            if (data.albums != '') {
                indicatorImg.fadeOut();
                container.append(data.albums);
                container.data('offset', data.offset);

            } else {
                indicator.hide();
            }
            window.paginatingAlbumPhotos = false;
        },
        error : function() {
            indicatorImg.fadeOut();
            window.paginatingAlbumPhotos = false;
        }
    });

    return false;
}

function open_photo_viewer(obj) {
    var modal = $('#photoViewer');
    modal.modal('show');
    load_viewer_photo(obj);
}

function delete_photo(id, url) {
    var modal = $('#photoViewer');
    modal.modal('hide');
    var obj = $('#request-uri');
    var request_uri = obj.data('request-uri');
    url = request_uri && typeof request_uri !== 'undefined' ? url + '?link=' + request_uri : url;
    confirm.url(url);
    return false;
}

function make_photo_dp(id, url) {
    var modal = $('#photoViewer');
    modal.modal('hide');
    confirm.url(url);

    return false;
}

window.currentPageUrl = '';
function load_viewer_photo(obj) {
    var modal = $('#photoViewer');
    var image = obj.data('image');
    var id = obj.data('id');
    var photoPane = modal.find('.viewer-left');
    var contentPane = modal.find('.viewer-right');
    photoPane.html("<img src='"+image+"'/> ");
    contentPane.html('');
    if (id == undefined || id == '') {
        contentPane.hide();
        photoPane.css('width', '100%')
    } else{
        contentPane.show();
        photoPane.css('width', '70%');
        var timestamp = $.now();
        if (window.currentPageUrl) {



            window.history.pushState({},timestamp + window.currentPageUrl, window.currentPageUrl);
        } else {
            window.currentPageUrl = window.location.href;
        }
        var url = baseUrl + 'photo/view/' + id;
        window.history.pushState({}, timestamp + url, url);
        $.ajax({
            url : baseUrl + 'photo/load?id=' + id + '&csrf_token=' + requestToken,
            cache : false,
            success : function(data) {
                var json = jQuery.parseJSON(data);
                if (json.status == 1) {
                    photoPane.html(json.left);
                    contentPane.html(json.right);
                    reloadInits();
                }
            }
        })
    }


}

$(function() {
    $(window).scroll(function() {
        if (document.body.scrollHeight ==
            document.body.scrollTop +
                window.innerHeight ) {
            if ($('#photos-list').length) {
                paginate_album_photos();
            };

            if($('#photo-album-lists').length) {
                paginate_photo_albums();
            }
        }
    });

    $(document).on('click', '.photo-viewer', function() {
        open_photo_viewer($(this));
        return false;
    });

    $(document).on('click', '#photoViewer .close', function() {
        var timestamp = $.now();
        window.history.pushState({},timestamp + window.currentPageUrl, window.currentPageUrl);


    });

    $('#photoViewer').on('hidden.bs.modal', function (e) {


        var timestamp = $.now();
        window.history.pushState({},timestamp + window.currentPageUrl, window.currentPageUrl);
    });

    $(document).on('keydown', 'body', function(e) {
        if ((e.keyCode || e.which) == 37)
        {


            if ($("#photoViewer .nav-left a").length) load_viewer_photo($(".nav-left a"))
        }


        if ((e.keyCode || e.which) == 39)
        {


            if($("#photoViewer .nav-right a").length) load_viewer_photo($(".nav-right a"))
        }
    })

});function help_open_menu(t) {
    var o = $(t);
    var ul = o.next();
    if (ul.css('display') == 'none') {
        ul.slideDown();
    } else {
        ul.slideUp();
    }

    return false;
};function process_follow(userid) {
    var o = $("#follow-button-" + userid);
    var status = o.attr('data-status');
    var follow = o.data('follow');
    var unfollow = o.data('unfollow');
    if (status == 1) {


        o.removeClass('followed').html(follow).attr('data-status', 0);
        type = 'unfollow';
    } else {


        o.addClass('followed').html(unfollow).attr('data-status', 1);
        type = 'follow'
    }

    $.ajax({
        url : baseUrl + 'relationship/follow?type=' + type + '&userid=' + userid + '&csrf_token=' + requestToken,
    })
    return false;
}

function process_friend(userid) {
    var o = $(".friend-button-" + userid);
    var status = o.attr('data-status');
    var addText = o.data('add');
    var sentText = o.data('sent');

    if (status == 0) {



        o.css('opacity', '0.4');

        $.ajax({
            url : baseUrl + 'relationship/add/friend?userid=' + userid + '&csrf_token=' + requestToken,
            success : function(data) {
                if (data == 1) {
                    o.find('span').html(sentText);
                    o.attr('data-status', 1);
                }
                o.css('opacity', 1);
            }
        })
    } else if(status == 1 || status == 2) {


        message = (status == 1) ? o.data('cancel-warning') : o.data('remove-warning');
        confirm.action(function() {
            o.css('opacity', '0.4');
            $.ajax({
                url : baseUrl + 'relationship/remove/friend?userid=' + userid + '&csrf_token=' + requestToken,
                success: function(data) {
                    if (data == 1) {
                        o.find('span').html(addText);
                        o.removeClass('ready-friend').attr('data-status', 0);
                    }
                    o.css('opacity', 1);
                }
            })
        }, message)
    }
    return false;
}

function show_friend_request_dropdown() {
    var dropdown = $(".friend-request-dropdown");
    var indicator = dropdown.find('#friend-request-dropdown-indicator');
    var content = dropdown.find('.friend-request-dropdown-result-container');
    if (dropdown.css('display') == 'none') {
        dropdown.fadeIn();
        indicator.show();
        $.ajax({
            url : baseUrl + 'relationship/load/requests?csrf_token=' + requestToken,
            success : function(data) {
                content.html(data);
                indicator.hide();
            }
        })
    } else {
        dropdown.fadeOut();
    }
    $(document).click(function(e) {
        if(!$(e.target).closest("#friend-request-dropdown-container").length) dropdown.hide();
    });
    return false;
}

function confirm_friend_request(userid, b) {
    var c = $('#friend-request-' + userid);
    var requestButton = $("#friend-request-respond-button-" + userid);
    c.css('opacity', '0.4');
    requestButton.css('opacity', '0.4');
    $("#friend-requests-respond-dropdown-" + userid).hide();
    $.ajax({
        url : baseUrl + 'friend/request/confirm?userid=' + userid + '&csrf_token=' + requestToken,
        type : 'GET',
        success : function(data) {
            if (data == 'login') {
                login_required();
            } else {
                c.css('opacity', 1).find('.actions').fadeOut();
                requestButton.hide();
                var button = $('.friend-button-' + userid);
                var frTrans = button.data('friends');
                button.show().attr('data-status', '2').html(frTrans).addClass('ready-friend');
            }
        }
    })
    return false;
}

function delete_friend_request(userid, b) {
    var c = $('#friend-request-' + userid);
    var requestButton = $("#friend-request-respond-button-" + userid);
    c.css('opacity', '0.4');
    requestButton.css('opacity', '0.4');
    $("#friend-requests-respond-dropdown-" + userid).hide();
    $.ajax({
        url : baseUrl + 'relationship/remove/friend?userid=' + userid + '&csrf_token=' + requestToken,
        success: function(data) {
            if (data == 1) {
                c.slideUp();
                requestButton.hide();
                var button = $('.friend-button-' + userid);
                var frTrans = button.data('add');
                button.show().attr('data-status', '0').html(frTrans);
            } else {
                login_required();
            }

        }
    });
    return false;
}
function push_friend_requests(type, d) {
    if (type == 'friend-request') {
        var notyCounts = 0;
        var a = $("#friend-request-dropdown-container > a");
        if (!a.find('span').length) {
            a.append("<span class='count' style='display:none'></span>")
        }
        var span = a.find('span');
        var nIds = '';
        $.each(d, function(pushId, nId) {
            if (!Pusher.hasPushId(pushId)) {
                Pusher.addPushId(pushId);
                nIds += (nIds) ? ',' + nId : nId;
            }
            notyCounts +=1;
        });

        if (notyCounts > 0) {
            span.html(notyCounts).fadeIn();
            Pusher.addCount(notyCounts);
        }

        a.click(function() {
            Pusher.removeCount(notyCounts);
            span.hide();
        });
        if (nIds) {
            $.ajax({
                url : baseUrl + 'friend/requests/preload?csrf_token=' + requestToken,
                success : function(data) {
                    var c = $(".friend-request-dropdown-result-container");
                    c.prepend(data);
                    reloadInits();
                }
            })
        }
    }
}
Pusher.addHook('push_friend_requests');;$(function() {
    $(document).on('click', '.report-btn', function() {
        var modal = $("#reportModal");
        modal.find('.link').val($(this).data('link'));
        modal.find('.type').val($(this).data('type'));
        modal.modal('show');

        return false;
    });

    $(document).on('submit', '#reportModal form', function() {
        $(this).css('opacity', '0.6');
        var sM = $("#reportModal").data('success');
        var eM = $("#reportModal").data('error');
        $(this).ajaxSubmit({
            url : baseUrl + 'report',
            success : function () {
                $("#reportModal").modal('hide');
                notifySuccess(sM);
                $(this).css('opacity', 1);
            },
            error : function () {
                $("#reportModal").modal('hide');
                notifyError(eM);
            }
        })
        return false;
    });
});window.last_search = '';
function process_search_dropdown() {
    var input = $("#header-search-input");
    var dropdown = $("#search-dropdown");
    var fullSearch = $('#search-dropdown-full-search-button');
    var dContent  = $('.search-dropdown-result-container');
    var indicator = $('#search-dropdown-indicator');
    if (input.val().length > 1) {
        dropdown.fadeIn();
        fullSearch.find('span').html(input.val());
        fullSearch.prop('href', baseUrl + 'search?term=' + encodeURIComponent(input.val()) + '&csrf_token=' + requestToken);
        if (window.last_search != input.val()) {
            indicator.fadeIn();
            $.ajax({
                url : baseUrl + 'search/dropdown?csrf_token=' + requestToken,
                data : {term:input.val()},
                success : function(data) {
                    dContent.html(data);
                    indicator.fadeOut();
                }
            })
        }
        window.last_search = input.val();
    } else {
        dropdown.fadeOut();
    }
}

$(function() {
    $(document).click(function(e) {
        if (!$(e.target).closest("#header-search").length){
            $("#search-dropdown").fadeOut();
        }
    });
});function social_switch_service() {

    var importedContacts = $("#social-imported-contacts-pane");
    importedContacts.html('').hide();
    var servicesContainer = $("#social-import-services-pane");
    servicesContainer.show();
    return false;
}

function social_invite_user(t) {
    var button = $(t);
    var email = button.data('email');
    button.css('opacity', '0.6');
    $.ajax({
        url : baseUrl + 'social/invite/user?email=' + email + '&csrf_token=' + requestToken,
        success : function(d) {
            button.fadeOut();
        }
    });
}

$(function() {
    $(document).on('click', '.social-invite-all-button', function() {
        $('.social-invite-button').each(function() {
            social_invite_user(this);
        }) ;
        $(this).hide();
        return false;
    });
    $(document).on('click', '.facebook-send-dialog', function() {
        var width;
        var height;
        var topPosition;
        var leftPosition;
        width = 1000;
        height = 530;
        leftPosition = (window.screen.width / 2) - ((width / 2) + 10);
        topPosition = (window.screen.height / 2) - ((height / 2) + 50);
        var link  = $(this).data('url');
        window.open(link, 'getcontacts', 'resizable=no,scrollbar=no,left=' + leftPosition + ',top=' + topPosition + ',height=' + height + ',width=' + width);
        return false;
    });

    $(document).on("click", ".social-search-contact-button", function() {
        width = 700;
        height = 500;
        leftPosition = (window.screen.width / 2) - ((width / 2) + 10);


        topPosition = (window.screen.height / 2) - ((height / 2) + 50);
        window.gmailContact = window.open($(this).data('url'), "getcontacts", "resizable=no,scrollbar=no,left="+leftPosition+",top="+topPosition+",height=500,width=700");
        window.contactLoading = true;
        window.gmailInterval = setInterval(function() {
            if (window.gmailContact.closed && window.contactLoading) {
                window.contactLoading = false;


                $.get(baseUrl + 'social/confirm/import', function(data) {
                    if (data == 1) {

                        $.get(baseUrl + 'social/get/imports', function(data) {
                            var servicesContainer = $("#social-import-services-pane");
                            servicesContainer.hide();
                            var importedContacts = $("#social-imported-contacts-pane");
                            importedContacts.html(data).fadeIn();
                        });

                    }  else {


                    }
                });
                clearInterval(window.gmailInterval)
            }
        }, 100)
        return false;
    });
});;function social_switch_service() {

    var importedContacts = $("#social-imported-contacts-pane");
    importedContacts.html('').hide();
    var servicesContainer = $("#social-import-services-pane");
    servicesContainer.show();
    return false;
}

function social_invite_user(t) {
    var button = $(t);
    var email = button.data('email');
    button.css('opacity', '0.6');
    $.ajax({
        url : baseUrl + 'social/invite/user?email=' + email + '&csrf_token=' + requestToken,
        success : function(d) {
            button.fadeOut();
        }
    });
}

$(function() {
    $(document).on('click', '.social-invite-all-button', function() {
        $('.social-invite-button').each(function() {
            social_invite_user(this);
        }) ;
        $(this).hide();
        return false;
    });
    $(document).on('click', '.facebook-send-dialog', function() {
        var width;
        var height;
        var topPosition;
        var leftPosition;
        width = 1000;
        height = 530;
        leftPosition = (window.screen.width / 2) - ((width / 2) + 10);
        topPosition = (window.screen.height / 2) - ((height / 2) + 50);
        var link  = $(this).data('url');
        window.open(link, 'getcontacts', 'resizable=no,scrollbar=no,left=' + leftPosition + ',top=' + topPosition + ',height=' + height + ',width=' + width);
        return false;
    });

    $(document).on("click", ".social-search-contact-button", function() {
        width = 700;
        height = 500;
        leftPosition = (window.screen.width / 2) - ((width / 2) + 10);


        topPosition = (window.screen.height / 2) - ((height / 2) + 50);
        window.gmailContact = window.open($(this).data('url'), "getcontacts", "resizable=no,scrollbar=no,left="+leftPosition+",top="+topPosition+",height=500,width=700");
        window.contactLoading = true;
        window.gmailInterval = setInterval(function() {
            if (window.gmailContact.closed && window.contactLoading) {
                window.contactLoading = false;


                $.get(baseUrl + 'social/confirm/import', function(data) {
                    if (data == 1) {

                        $.get(baseUrl + 'social/get/imports', function(data) {
                            var servicesContainer = $("#social-import-services-pane");
                            servicesContainer.hide();
                            var importedContacts = $("#social-imported-contacts-pane");
                            importedContacts.html(data).fadeIn();
                        });

                    }  else {


                    }
                });
                clearInterval(window.gmailInterval)
            }
        }, 100)
        return false;
    });
});;function upload_upgrade_file(t) {
    var form = $(t);
    var button = form.find('button');
    button.attr('disabled', 'disabled');

    form.ajaxSubmit({
        url : baseUrl + 'admincp/upgrade/upload',
        uploadProgress : function(event, position, total, percent) {

            var uI = $(".upgrade-upload-indicator");
            uI.html(percent + '%').fadeIn();
            uI.attr('value', percent).prop('value', percent);
            if (percent == 100) {


            }
        },
        success : function(response) {
            var data = JSON.parse(response);
            if (data.status == 0) {
                alert(data.message);
            } else {
                window.location = data.redirect_url;
            }
            percent = 0;
            var uI = $(".upgrade-upload-indicator");
            uI.html(percent + '%').fadeIn();
            uI.attr('value', percent).prop('value', percent);
            button.prop('disabled', '').removeAttr('disabled');
        }, error : function() {
            percent = 0;
            var uI = $(".upgrade-upload-indicator");
            uI.html(percent + '%').fadeIn();
            uI.attr('value', percent).prop('value', percent);
            button.prop('disabled', '').removeAttr('disabled');
            alert("Please only zip file is allowed and make sure allow_max_filesize is set to higher value in php.ini settings");
        }
    })
    return false;
}

function upgrade_now(t) {
    var form = $(t);
    var button = form.find('button');
    button.attr('disabled', 'disabled');

    form.ajaxSubmit({
        url : baseUrl + 'admincp/upgrade/now',

        success : function(data) {
            var json = jQuery.parseJSON(data);
            if (json.status == 0) {
                alert(json.message);
            } else {
                alert(json.message);
                window.location = json.url;
            }

            button.prop('disabled', '').removeAttr('disabled');
        }, error : function() {

            button.prop('disabled', '').removeAttr('disabled');
            alert("Failed to finish up upgrade");
        }
    })
    return false;
};

var featuredVideo = "";
var featuredMedia = "";
var frameHolder="";

function change_video_source(t) {
    var o = $(t);
    var v = o.val();
    $(".video-source-selector .source").hide();
    $(".video-source-selector  ." + v).fadeIn();
    if (v == 'upload') {
        $('.video-details-container').show();
    } else {
        $('.video-details-container').hide();
    }
    return true;
}


function video_form_list_url() {
    var form = $('#video-list-search');
    var v = form.find('input[type=text]').val();
    var cat = $("#video-category-list").val();

    var type = form.find('.video-type-input').val();
    var filter = $("#video-filter-select").val();
    var url = baseUrl + 'videos?term=' + v + "&category=" + cat + "&type=" + type + '&filter=' + filter;

    return url;
}

function video_submit_search(t) {
    url = video_form_list_url();
    loadPage(url);
    return false;
}

function video_list_change_category(t) {
    url = video_form_list_url();
    loadPage(url);
};
(function($){


	$.fn.iframeTracker = function(handler){
		var target = this.get();
		if (handler === null || handler === false) {
			$.iframeTracker.untrack(target);
		} else if (typeof handler == "object") {
			$.iframeTracker.track(target, handler);
		} else {
			throw new Error("Wrong handler type (must be an object, or null|false to untrack)");
		}
	};


	$.iframeTracker = {


		focusRetriever: null,  // Element used for restoring focus on window (element)
		focusRetrieved: false, // Says if the focus was retrived on the current page (bool)
		handlersList: [],      // Store a list of every trakers (created by calling $(selector).iframeTracker...)
		isIE8AndOlder: false,  // true for Internet Explorer 8 and older


		init: function(){


			try {
				if ($.browser.msie == true && $.browser.version < 9) {
					this.isIE8AndOlder = true;
				}
			} catch(ex) {
				try {
					var matches = navigator.userAgent.match(/(msie) ([\w.]+)/i);
					if (matches[2] < 9) {
						this.isIE8AndOlder = true;
					}
				} catch(ex2) {}
			}


			$(window).focus();
			$(window).blur(function(e){
				$.iframeTracker.windowLoseFocus(e);
			});


			$('body').append('<div style="position:fixed; top:0; left:0; overflow:hidden;"><input style="position:absolute; left:-300px;" type="text" value="" id="focus_retriever" readonly="true" /></div>');
			this.focusRetriever = $('#focus_retriever');
			this.focusRetrieved = false;
			$(document).mousemove(function(e){
				if (document.activeElement && document.activeElement.tagName == 'IFRAME') {
					$.iframeTracker.focusRetriever.focus();
					$.iframeTracker.focusRetrieved = true;
				}
			});


			if (this.isIE8AndOlder) {


				this.focusRetriever.blur(function(e){
					e.stopPropagation();
					e.preventDefault();
					$.iframeTracker.windowLoseFocus(e);
				});


				$('body').click(function(e){ $(window).focus(); });
				$('form').click(function(e){ e.stopPropagation(); });


				try {
					$('body').on('click', 'form', function(e){ e.stopPropagation(); });
				} catch(ex) {
					console.log("[iframeTracker] Please update jQuery to 1.7 or newer. (exception: " + ex.message + ")");
				}
			}
		},






		track: function(target, handler){


			handler.target = target;


			$.iframeTracker.handlersList.push(handler);


			$(target)
				.bind('mouseover', {handler: handler}, $.iframeTracker.mouseoverListener)
				.bind('mouseout',  {handler: handler}, $.iframeTracker.mouseoutListener);
		},




		untrack: function(target){
			if (typeof Array.prototype.filter != "function") {
				console.log("Your browser doesn't support Array filter, untrack disabled");
				return;
			}


			$(target).each(function(index){
				$(this)
					.unbind('mouseover', $.iframeTracker.mouseoverListener)
					.unbind('mouseout', $.iframeTracker.mouseoutListener);
			});


			var nullFilter = function(value){
				return value === null ? false : true;
			};
			for (var i in this.handlersList) {


				for (var j in this.handlersList[i].target) {
					if ($.inArray(this.handlersList[i].target[j], target) !== -1) {
						this.handlersList[i].target[j] = null;
					}
				}
				this.handlersList[i].target = this.handlersList[i].target.filter(nullFilter);


				if (this.handlersList[i].target.length == 0) {
					this.handlersList[i] = null;
				}
			}
			this.handlersList = this.handlersList.filter(nullFilter);
		},


		mouseoverListener: function(e){
			e.data.handler.over = true;
			try {e.data.handler.overCallback(this);} catch(ex) {}
		},


		mouseoutListener: function(e){
			e.data.handler.over = false;
			$.iframeTracker.focusRetriever.focus();
			try {e.data.handler.outCallback(this);} catch(ex) {}
		},


		windowLoseFocus: function(event){
			for (var i in this.handlersList) {
				if (this.handlersList[i].over == true) {
					try {this.handlersList[i].blurCallback();} catch(ex) {}
				}
			}
		}
	};


	$(document).ready(function(){
		$.iframeTracker.init();
	});
})(jQuery);;


jQuery(function()
{
    var mywindow = $(window);
    var top="";
    var offset="";


    addToPlaylist();

     
    window.onYouTubeIframeAPIReady=function() {


        jQuery('iframe').filter(function(){ return this.src.indexOf('https://www.youtube.com/') == 0}).each( function (k, v) {
            if (!this.id) { this.id='embeddedvideoiframe' + k }
            players.push(new YT.Player(this.id, {
                events: {

                    'onStateChange': onPlayerStateChange
                        }
                    }))
                });
        };

         function onPlayerStateChange( event ) {

            active=event.target.getIframe();



            if (event.data == YT.PlayerState.PLAYING) {
                jQuery.each(players, function(k, v) {
                    if (this.getIframe().id != event.target.getIframe().id) {

                        try
                        {
                            this.pauseVideo();
                          }catch(e)
                          {

                          }

                    }
                });
            }

            var isPlay  = 1 === event.data;
            var isPause = 2 === event.data;
            var isEnd   = 0 === event.data;



            if ( isPause ) {

              frameHolder.removeClass( "is-sticky" );
           }

           if ( isEnd ) {
              frameHolder.removeClass( "is-sticky" );
           }
        }


    

    $('.iframe iframe').iframeTracker({

       blurCallback: function(){

         this._holder.toggleClass('is-playing');
         featuredMedia=this._holder;
         frameHolder=jQuery(this._holder).find('.frame-holder');
         console.log(frameHolder);
         stickyclose=jQuery(this._holder).find('.sticky-close');
         featuredVideo=jQuery('#'+this._holderId+' iframe');
         top = featuredMedia.offset().top;
         offset = Math.floor( top + ( featuredMedia.outerHeight() / 2 ) );
         for(var x in allIframe)
         {
            var id=allIframe[x];
           if(id != this._holderId)
           {
              jQuery('#'+id).removeClass('is-playing');
              var iframeHolder=jQuery('#'+id+ ' .frame-holder');
              var iframe=jQuery('#'+id+ ' iframe');
              var cSticky=jQuery('#'+id+ ' .frame-holder .sticky-close');
              iframeHolder.removeClass('is-sticky');
              var src=iframe.attr('src');
              iframeHolder.find('sticky-close').addClass('hidden');
              console.log(cSticky);
              cSticky.addClass('hidden');

              try
              {
                iframe.attr('src',iframe.attr('src'));
              }
              catch(e)
              {

              }

           }
         }

        },
        overCallback: function(element){
          this._holderId = $(element).parents('.iframe').attr('id');
          this._holder=$(element).parents('.iframe');


        },
        outCallback: function(element){
          this._holderId = null;
          this._holderId = null;
        },
        _holderId: null,
        _holder:null

      });


        mywindow
        .on( "resize", function() {

          try
          {
            top = featuredMedia.offset().top;
            offset = Math.floor( top + ( featuredMedia.outerHeight() / 2 ) );
          }catch(Exception)
          {

          }

        })

          .on( "scroll", function() {

            try
            {
              var diff=parseInt(offset)-parseInt(mywindow.scrollTop());
              frameHolder.removeClass( "hidden",diff<315);
              frameHolder.toggleClass( "is-sticky",
              mywindow.scrollTop() >= offset || diff>=315  && featuredMedia.hasClass( "is-playing"));
              if (frameHolder.hasClass('is-sticky'))
              {

                stickyclose.removeClass('hidden');

              }
             else
             {
                stickyclose.addClass('hidden');
             }
             if(! featuredMedia.hasClass("is-playing"))
             {
              frameHolder.removeClass('is-sticky')
              stickyclose.addClass('hidden');
             }

            }catch(e)
            {
                console.log(e);
            }

          });
    });




function addToPlaylist()
{

    allIframe=[];
    jQuery('.iframe iframe').each(function(v)
    {
        allIframe.push($(this).closest('.iframe').attr('id'));
    });
}


function removeSticky()
{

  featuredVideo.attr('src',featuredVideo.attr('src'));
  frameHolder.addClass('hidden');
  featuredMedia.removeClass("is-playing");
  stickyclose.addClass('hidden');


}

