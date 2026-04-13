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
    '##2ecc71',
    '##3498db',
    '##9b59b6',
    '##34495e',
    '##1abc9c',
    '##27ae60',
    '##2980b9',
    '##8e44ad',
    '##2c3e50',
]


function  connect(event){
    username = document.querySelector("#name").values.trim();
    if(username){
        usernamePager.classList.add("hidden");
        chatPage.classList.remove("hidden");

    //  add the logic of the socket later ....
    }
}

usernameForm.addEventListener("submit", connect,true)