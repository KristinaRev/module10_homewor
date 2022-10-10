/*Задание 3.
1.Реализовать чат на основе эхо-сервера wss://echo-ws-service.herokuapp.com.
Интерфейс состоит из input, куда вводится текст сообщения, и кнопки «Отправить».
При клике на кнопку «Отправить» сообщение должно появляться в окне переписки.
Эхо-сервер будет отвечать вам тем же сообщением, его также необходимо выводить в чат:

2.Добавить в чат механизм отправки гео-локации: 
При клике на кнопку «Гео-локация» необходимо отправить данные серверу и в чат вывести ссылку на https://www.openstreetmap.org/ с вашей гео-локацией. Сообщение, которое отправит обратно эхо-сервер, не выводить.
*/

document.addEventListener("DOMContentLoaded", pageLoaded);

const wsUri = "wss://echo-ws-service.herokuapp.com";
const infoOutput = document.querySelector(".info_output");
const board = document.querySelector(".board");
const input = document.querySelector("input");
const btnText = document.querySelector(".btn-text");
const btnGeo = document.querySelector(".btn-geo");

function pageLoaded() {
    let socket = new WebSocket(wsUri);
    
    socket.onopen = () => {
      infoOutput.innerText = "Соединение установлено";
    }

    socket.onmessage = (event) => {
        writeToChat(event.data, true);
      }
      
      socket.onerror = () => {
        infoOutput.innerText = "При передаче данных произошла ошибка";
      }
      
      btnText.addEventListener("click", sendMessage);
      
      function sendMessage() {
        if (!input.value) return;
        socket.send(input.value);
        writeToChat(input.value, false);
        input.value === "";
      }
      
      function writeToChat(message, isRecieved) {
        let messageHTML = `<div class="${isRecieved? "recieved" : "sent"}">${message}</div>`;
        board.innerHTML += messageHTML;
      }

      
      
      btnGeo.addEventListener("click", getLocation);
       
      function getLocation() {
        if ("geolocation" in navigator) {
          let locationOptions = {
            enableHighAccuracy: true
          };
          navigator.geolocation.getCurrentPosition(locationSuccess, locationError, locationOptions);
        } else {
          writeOutput("Ваш браузер не поддерживает функцию определения местоположения");
        }
      }
      
      function locationSuccess(data) {
        let link = `https://www.openstreetmap.org/#map=18/${data.coords.longitude}/${data.coords.latitude}}`;
        writeOutput(`<a href="${link}" target="_blank" class="recieved">Геолокация</a>`);
      }
      
      function locationError() {
        writeOutput("При получении местоположения произошла ошибка");
      }
      
      function writeOutput(message) {
        board.innerHTML += `<p>${message}</p>`;
      }
}