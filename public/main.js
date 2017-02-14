	  
$(function() {
	var FADE_TIME = 500; // ms
	var TYPING_TIMER_LENGTH = 1000; // ms
	var MESSAGECOLOR = '#ffffff';
	var USERCOLOR = '#D5DBDB';
	var MAINCOLOR = '#2471A3';

	var PREV_USER = '';
	
	// Initialize variables
	var $window = $(window);
	var $usernameInput = $('.usernameInput'); // Input for username
	var $messages = $('.messages'); // Messages area
	var $inputMessage = $('.inputMessage'); // Input message input box
	var $colorSelector = $('.colorSelector'); // ColorSelector Input
	var $loginPage = $('.login.page'); // The login page
	var $chatPage = $('.chat.page'); // The chatroom page

	// Prompt for setting a username
	var username;
	var connected = false;
	var typing = false;
	var lastTypingTime;
	var $currentInput = $usernameInput.focus();

	var socket = io();

	var pattern = /\:\)|\:\(|\;\)|\:0|\;D|\;d|\:D|\:d|\:P|\:p|\:K|\:k|\:X|\:x/;
		
		
	$colorSelector.change(function(){
		MAINCOLOR = $colorSelector.val();
		$loginPage.css('background-color', MAINCOLOR);
		$inputMessage.css('border', '5px solid'+ MAINCOLOR);
	});

	function addParticipantsMessage (data) {
		var message = '';
		if (data.numUsers === 1) {
			message += "there is only 1 participant";
		} else {
			message += "there are " + data.numUsers + " participants";
		}
		log(message);
	}


	// Sets the client's username
	function setUsername () {
		username = cleanInput($usernameInput.val().trim());

		// If the username is valid
		if (username) {
			$loginPage.fadeOut();
			$chatPage.show();
			$loginPage.off('click');
			$currentInput = $inputMessage.focus();

			// Tell the server your username
			socket.emit('add user', username);
		}
	}

	// Sends a chat message
	function sendMessage () {
		var message = $inputMessage.val();
		// Prevent markup from being injected into the message
		message = cleanInput(message);
		// if there is a non-empty message and a socket connection
		if (message && connected) {
			$inputMessage.val('');
			addChatMessageSelf({
				username: username,
				message: message
			});

			// tell server to execute 'new message' and send along one parameter
			socket.emit('new message', message);
		}
	}


	// Log a message
	function log (message, options) {
		var $el = $('<li>').addClass('log').text(message);
		addMessageElement($el, options);
	}

	
	// Adds the SELF message to the message list
	function addChatMessageSelf (data, options) {

		// Don't fade the message in if there is an 'X was typing'
		var $typingMessages = getTypingMessages(data);
		options = options || {};
		if ($typingMessages.length !== 0) {
			options.fade = false;
			$typingMessages.remove();
		}

		var $messageBodyDiv = $('<li class="messageBodySelf"/>')
		.css('color', MESSAGECOLOR)
		.css('background-color', MAINCOLOR);

		if(pattern.test(data.message)){
			var arrOfStrings = (data.message).split(pattern);
			var si=0;
			var pic;
			for(var i=0; i<arrOfStrings.length; i++){
				si = si + arrOfStrings[i].length;
				var symbol = (data.message).substring(si,si+2);
				si = si + 2;			
				switch(symbol) {
					case ':)' : pic = 'emo/happy.png';
						break;
					case ':(' : pic = 'emo/sad.png';
						break;
					case ';)' : pic = 'emo/wink.png';
						break;
					case ':0' : pic = 'emo/shock.png';
						break;
					case ';D' : pic = 'emo/happyCD.png';
						break;
					case ';d' : pic = 'emo/happyCD.png';
						break;
					case ':D' : pic = 'emo/happyD.png';
						break;
					case ':d' : pic = 'emo/happyD.png';
						break;
					case ':P' : pic = 'emo/happyP.png';
						break;
					case ':p' : pic = 'emo/happyP.png';
						break;
					case ':K' : pic = 'emo/kiss.png';
						break;
					case ':k' : pic = 'emo/kiss.png';
						break;
					case ':X' : pic = 'emo/confused.png';
						break;
					case ':x' : pic = 'emo/confused.png';
						break;
					
				}
				var $text = $('<span>'+arrOfStrings[i]+' </span>');
				var pic = $('<img src="'+pic+'" />');
				$messageBodyDiv.append($text);
				$messageBodyDiv.append(pic);
				pic = '';
			}
		} else {
			$messageBodyDiv.text(data.message);
		}
		
		
		var typingClass = data.typing ? 'typing' : '';
		var $messageDiv = $('<li class="message"/>')
		.data('username', data.username)
		.addClass(typingClass)
		.append($messageBodyDiv);

		if(!(PREV_USER === '')){
			$messageDiv.css('padding','7px 1px 1px 1px');
		}
		
		PREV_USER = '';
		
		addMessageElement($messageDiv, options);
	}
	

	// Adds the visual chat message to the message list
	function addChatMessage (data, options) {
			
		// Don't fade the message in if there is an 'X was typing'
		var $typingMessages = getTypingMessages(data);
		options = options || {};
		if ($typingMessages.length !== 0) {
			options.fade = false;
			$typingMessages.remove();
		}

		var $messageBodyDiv = $('<li class="messageBody"/>')
		.css('color', MESSAGECOLOR)
		.css('background-color', MAINCOLOR);

		if(pattern.test(data.message)){
			var arrOfStrings = (data.message).split(pattern);
			var si=0;
			var pic;
			for(var i=0; i<arrOfStrings.length; i++){
				si = si + arrOfStrings[i].length;
				var symbol = (data.message).substring(si,si+2);
				si = si + 2;			
				switch(symbol) {
					case ':)' : pic = 'emo/happy.png';
						break;
					case ':(' : pic = 'emo/sad.png';
						break;
					case ';)' : pic = 'emo/wink.png';
						break;
					case ':0' : pic = 'emo/shock.png';
						break;
					case ';D' : pic = 'emo/happyCD.png';
						break;
					case ';d' : pic = 'emo/happyCD.png';
						break;
					case ':D' : pic = 'emo/happyD.png';
						break;
					case ':d' : pic = 'emo/happyD.png';
						break;
					case ':P' : pic = 'emo/happyP.png';
						break;
					case ':p' : pic = 'emo/happyP.png';
						break;
					case ':K' : pic = 'emo/kiss.png';
						break;
					case ':k' : pic = 'emo/kiss.png';
						break;
					case ':X' : pic = 'emo/confused.png';
						break;
					case ':x' : pic = 'emo/confused.png';
						break;
					
				}
				var $text = $('<span>'+arrOfStrings[i]+' </span>');
				var pic = $('<img src="'+pic+'" />');
				$messageBodyDiv.append($text);
				$messageBodyDiv.append(pic);
				pic = '';
			}
		} else {
			$messageBodyDiv.text(data.message);
		}
		
		var typingClass = data.typing ? 'typing' : '';
		var $messageDiv = $('<li class="message"/>')
		.data('username', data.username)
		.addClass(typingClass);
		
		if(PREV_USER === data.username) {				
			$messageDiv.append($messageBodyDiv);
		} else {
			var $usernameDiv = $('<li class="username"/>')
			.text(data.username)
			.css('color', USERCOLOR)
			.css('background-color', MAINCOLOR);
			
			$messageDiv.css('padding','7px 1px 1px 1px')
			.append($usernameDiv, $messageBodyDiv);
		}
		
		if(!(data.message === 'is typing')){
			PREV_USER = data.username;
		}
		
		addMessageElement($messageDiv, options);
	}

	// Adds the visual chat typing message
	function addChatTyping (data) {
		data.typing = true;
		data.message = 'is typing';
		addChatMessage(data);
	}

	// Removes the visual chat typing message
	function removeChatTyping (data) {
		getTypingMessages(data).fadeOut(function () {
			$(this).remove();
		});
	}

	// Adds a message element to the messages and scrolls to the bottom
	// el - The element to add as a message
	// options.fade - If the element should fade-in (default = true)
	// options.prepend - If the element should prepend
	//   all other messages (default = false)
	function addMessageElement (el, options) {
		var $el = $(el);

		// Setup default options
		if (!options) {
			options = {};
		}
		
		if (typeof options.fade === 'undefined') {
			options.fade = true;
		}
		
		if (typeof options.prepend === 'undefined') {
			options.prepend = false;
		}

		// Apply options
		if (options.fade) {
			$el.hide().fadeIn(FADE_TIME);
		}
		
		if (options.prepend) {
			$messages.prepend($el);
		} else {
			$messages.append($el);
		}
		
		$messages[0].scrollTop = $messages[0].scrollHeight;
	}

	// Prevents input from having injected markup
	function cleanInput (input) {
		return $('<div/>').text(input).text();
	}

	// Updates the typing event
	function updateTyping () {
		if (connected) {
			if (!typing) {
				typing = true;
				socket.emit('typing');
			}
			
			lastTypingTime = (new Date()).getTime();

			setTimeout(function () {
				var typingTimer = (new Date()).getTime();
				var timeDiff = typingTimer - lastTypingTime;
				if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
					socket.emit('stop typing');
					typing = false;
				}
			}, TYPING_TIMER_LENGTH);
		}
	}

	// Gets the 'X is typing' messages of a user
	function getTypingMessages (data) {
		return $('.typing.message').filter(function (i) {
		return $(this).data('username') === data.username;
		});
	}

	// Keyboard events

	$window.keydown(function (event) {
		// Auto-focus the current input when a key is typed
		if (!(event.ctrlKey || event.metaKey || event.altKey)) {
			$currentInput.focus();
		}
		// When the client hits ENTER on their keyboard
		if (event.which === 13) {
			if (username) {
				sendMessage();
				socket.emit('stop typing');
				typing = false;
			} else {
				setUsername();
			}
		}
	});

	$inputMessage.on('input', function() {
		updateTyping();
	});



	// Click events

	// Focus input when clicking anywhere on login page
	$loginPage.click(function () {
		$currentInput.focus();
	});

	// Focus input when clicking on the message input's border
	$inputMessage.click(function () {
		$inputMessage.focus();
	});



	// Socket events

	// Whenever the server emits 'login', log the login message
	socket.on('login', function (data) {
		connected = true;

		// Display the welcome message
		var message = "Welcome";
		log(message, {
			prepend: true
		});
		addParticipantsMessage(data);
		if(!window.Notification) {
			alert('You will not recieve notifications because they are not supported by your browser. To get notifications switch to a latest version of the browser, or switch to another browser.');
		} else {
			Notification.requestPermission();
		}
	});

	// Whenever the server emits 'new message', update the chat body
	socket.on('new message', function (data) {
		addChatMessage(data);
		
		if(!document.hasFocus()) {
			var notify = new Notification('New message from ' + data.username, {
				body : data.message,
				icon : '/newmessage.png',
				tag  : 'NEW_MESSAGE'
			});
			// Notification events
			// Wheneverthe user clicks on notification, focus on the app
			notify.onclick = function(){
				$window.focus();
			}
		}
		
	});

	// Whenever the server emits 'user joined', log it in the chat body
	socket.on('user joined', function (data) {
		log(data.username + ' joined');
		addParticipantsMessage(data);
		
		if(!document.hasFocus()){
			var notify = new Notification(data.username + ' joined', {
				icon : '/newuser.png',
				tag  : 'NEW_USER'
			});
			// Notification events
			// Wheneverthe user clicks on notification, focus on the app
			notify.onclick = function(){
				$window.focus();
			}
		}
			
	});

	// Whenever the server emits 'user left', log it in the chat body
	socket.on('user left', function (data) {
		log(data.username + ' left');
		if(!document.hasFocus()){
			var notify = new Notification(data.username + ' left', {
				icon : '/newusergone.png',
				tag  : 'NEW_USER'
			});
			// Notification events
			// Wheneverthe user clicks on notification, focus on the app
			notify.onclick = function(){
				$window.focus();
			}
		}
		addParticipantsMessage(data);
		removeChatTyping(data);
	});

	// Whenever the server emits 'typing', show the typing message
	socket.on('typing', function (data) {
		addChatTyping(data);
	});

	// Whenever the server emits 'stop typing', kill the typing message
	socket.on('stop typing', function (data) {
		removeChatTyping(data);
	});
});
