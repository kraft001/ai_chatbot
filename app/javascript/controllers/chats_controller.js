import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [ "list" ];
  static outlets = [ "messages" ];

  initialize() {
    this.token = document.querySelector('meta[name="csrf-token"]').content;
  }

  connect() {
    this.list();
  }

  create() {
    fetch('/chats.json', {
      method: 'POST',
      headers: {
        "X-CSRF-Token": this.token,
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(chat => this.append(chat.data.id))
  };

  list() {
    this.deleteAll();
    fetch("/chats.json")
      .then(response => response.json())
      .then(chats => chats.data.forEach(chat => this.append(chat.id)))
  };

  deleteAll(){
    this.listTarget.innerHTML = "";
  }

  append(chatId) {
    this.listTarget.insertAdjacentHTML(
      'beforeend',
      `
        <p>
          <a href="" data-action="chats#load:prevent" data-chats-chat-id-param="${chatId}">
            Chat Room #${chatId}
          </a>
        </p>
      `
    );
  };

  load({ params: { chatId } }) {
    this.messagesOutlet.chatIdValue = chatId;
  }
}
