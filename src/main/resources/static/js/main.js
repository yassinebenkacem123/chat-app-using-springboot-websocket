"use strict";

var usernamePager = document.querySelector("#username-page");
var chatPage = document.querySelector("#chat-page");
var usernameForm = document.querySelector("#username-form");
var messageForm = document.querySelector("#message-form");
var messageInput = document.querySelector("#message");
var messageArea = document.querySelector("#messageArea");
var connectingElement = document.querySelector(".connecting");


var stompClient = null;

var username = null;

var colors = [
    '#2ecc71',
    '#3498db',
    '#9b59b6',
    '#34495e',
    '#1abc9c',
    '#27ae60',
    '#2980b9',
    '#8e44ad',
    '#2c3e50',
]


function  connect(event){
    username = document.querySelector("#name").value.trim();
    if(username){
        usernamePager.classList.add("hidden");
        chatPage.classList.remove("hidden");

    //  add the logic of the socket later ....

        var socket = new SockJS('/ws');

        stompClient = Stomp.over(socket);
        stompClient.connect({}, onConnected, onError);
    }
    event.preventDefault();
}

function onConnected(){
    stompClient.subscribe('/topic/public', onMessageReceived);

    stompClient.send('/app/chat.addUser', {},JSON.stringify(
        {
            'sender':username,
            'type':'JOIN'
        }
    ));
    connectingElement.classList.add("hidden");
}

function getAvatarColor(messageSender) {
    var hash = 0;
    for (var i = 0; i < messageSender.length; i++){
        hash = 31 * hash + messageSender.charCodeAt(i);
    }
    var index = Math.abs(hash % colors.length);

    return colors[index];
}

function onMessageReceived(payload) {
    var message = JSON.parse(payload.body);

    var messageElement = document.createElement("li");

    if (message.type === 'JOIN' || message.type === 'LEAVE') {
        messageElement.classList.add("event-message");
        message.content = message.sender + (message.type === 'JOIN' ? " joined!" : " left!");
    } else {
        messageElement.classList.add("chat-message");

        var avatarElement = document.createElement('i');
        var avatarText = document.createTextNode(message.sender[0]);
        avatarElement.appendChild(avatarText);
        avatarElement.style['background-color'] = getAvatarColor(message.sender);

        messageElement.appendChild(avatarElement);

        var usernameElement = document.createElement('span');
        var usernameText = document.createTextNode(message.sender);
        usernameElement.appendChild(usernameText);
        messageElement.appendChild(usernameElement);
    }

    var textElement = document.createElement("p");
    var messageText = document.createTextNode(message.content);
    textElement.appendChild(messageText);
    messageElement.appendChild(textElement);

    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
}

function onError(){
    connectingElement.textContent = "Could not connect to this room, please try again later.";
    connectingElement.style.color = "red";
}
usernameForm.addEventListener("submit", connect,true);

function sendMessage(event) {
    var messageContent = messageInput.value.trim();
    if(messageContent && stompClient){
        stompClient.send("/app/chat.sendMessage",{},JSON.stringify(
            {
                'sender':username,
                'content':messageContent,
                'type':'CHAT'
            }));
        messageInput.value = '';
    }


    event.preventDefault();



}

messageForm.addEventListener("submit", sendMessage,true)