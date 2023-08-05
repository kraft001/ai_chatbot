import { Controller } from "@hotwired/stimulus"
import consumer from '../channels/consumer';

export default class extends Controller {
  static values = { chatId: Number }
  static targets = [ "title", "chatBox", "list", "text" ];

  initialize() {
    this.token = document.querySelector('meta[name="csrf-token"]').content;
  }

  connect() {
    this.load();
    this.channel = consumer.subscriptions.create('ChatChannel', {
      // connected: this._cableConnected.bind(this),
      // disconnected: this._cableDisconnected.bind(this),
      received: this._cableReceived.bind(this),
    });
  }

  _cableReceived(data) {
    if (data.chat_id == this.chatIdValue) {
      this.append(data);
    } else {
      console.log('Chat Id doesn\'t match');
      console.log(data.chat_id);
      console.log(this.chatIdValue);
    }
  }

  create() {
    fetch(`/chats/${this.chatIdValue}/messages.json`, {
      method: 'POST',
      headers: {
        "X-CSRF-Token": this.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: this.textTarget.value })
    });

    this.textTarget.value = '';
  };

  load() {
    if (!this.chatIdValue) {
      this.clear();
      return;
    }

    this.titleTarget.innerText = `Chat Room #${this.chatIdValue}`;
    this.listTarget.innerHTML = "";
    this.chatBoxTarget.classList.remove("hidden");

    fetch(`/chats/${this.chatIdValue}/messages.json`)
      .then(response => response.json())
      .then(messages => messages.data.forEach(message => this.append(message)))
  };

  append(message) {
    let userClass = "";
    if (message.from_user) { userClass = "from-user "}

    this.listTarget.insertAdjacentHTML(
      'beforeend',
      `
        <div class="message ${userClass}" data-message-id="${message.id}">
          <div class="text">${message.text}</div>
          <div class="date">${message.created_at}</div>
        </div>
      `
    );
  };

  chatIdValueChanged() {
    this.load();
  }

  clear() {
    this.titleTarget.innerText = "<< Select a Chat Room";
    this.chatBoxTarget.classList.add("hidden");
    this.listTarget.innerHTML = "";
  }
}
