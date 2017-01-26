"use strict";

var Click2Eliza = (function(){

	var _eliza;
	var _initialiseFunction;
	var _addButtonFunction;
	var _pageCheckerInterval;

	var _elizaResponse = function(userInput){

		if (userInput === '' || userInput === undefined){
			return;
		}
		var chatResponse = $("#chat-response");

        chatResponse.append("YOU: " + userInput + "\n");
        chatResponse.append("ASC: " + _eliza.transform(userInput) + "\n");
	};

	var _startElizaChat = function(){
		_eliza = new ElizaBot();
		var initial = _eliza.getInitial();
		$("#chat-response").append(initial + "\n");
	};

	var _openElizaDialog = function(){
		$("#chat-dialog" ).dialog( "open" );
        $("#chat-text")[0].value = '';
    };

	var initialiseChatDialog = function(){

		$.get(chrome.extension.getURL('html/chat.html'), function(data) {
			// $($.parseHTML(data)).appendTo('body')
		    $(data).appendTo('body');

			$("#chat-dialog").dialog({
				resizable: false,
				autoOpen: false,
				width: 310,
				height: 320
			});

			var chatTextBox = $('#chat-text');

            chatTextBox.keypress(function (e) {
  				if (e.which == 13) {
    				$('#chat-form').submit();
    				return false;
  				}
			});

			$("#chat-form").submit(function(event){
				var chatText = chatTextBox[0].value;
				_elizaResponse(chatText);
                chatTextBox[0].value = '';
  				event.preventDefault();
			});


			_addButtonFunction();
		});
	};

	var addButtonToPlatformResults = function (){

        var click2chatBtn = $("#click2chat-btn");

        click2chatBtn.appendTo("#resultSummaryButtonContainer");
        click2chatBtn.show();
        click2chatBtn.click(function(){
			_openElizaDialog();
			_startElizaChat();
		});		
	};

	var checkValidPage = function(){
		if (_initialiseFunction === undefined || document.title.indexOf("Veracode") === -1){
			return;
		}

		if (document.getElementById ("resultSummaryButtonContainer")){
			clearInterval (_pageCheckerInterval);
			_initialiseFunction();
		}
	};

	var startPageChecker = function(initialiseFunctionCallback, addButtonFunctionCallback){
		// functions as parameters for injection (unit testing)
		_initialiseFunction = initialiseFunctionCallback;
		_addButtonFunction = addButtonFunctionCallback;

		// We have to use interval checking due to async page loading.
		// Can't rely on normal DOM ready functions		
		_pageCheckerInterval = setInterval (checkValidPage, 111);
	};

	return {
		checkValidPage:checkValidPage,
		initialiseChatDialog:initialiseChatDialog,
		addButtonToPlatformResults:addButtonToPlatformResults,
		startPageChecker:startPageChecker
	}
}());

$(function(){
	Click2Eliza.startPageChecker(Click2Eliza.initialiseChatDialog, Click2Eliza.addButtonToPlatformResults);
});
