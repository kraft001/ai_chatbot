import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = { chatId: Number }
  static targets = [ "list", "text" ];

  connect() {
  }

  create(event) {
    event.preventDefault();
  };

  load() {
  };

  chatIdValueChanged() {
    this.load();
  }
}
