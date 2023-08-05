import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = { chatId: Number }
  static targets = [ "title", "chatBox", "list", "text" ];

  connect() {
    this.load();
  }

  create(event) {
    event.preventDefault();
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
