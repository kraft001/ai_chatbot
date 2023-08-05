class ChatGptJob < ApplicationJob
  queue_as :default

  def perform(message)
    # Do something later
    ChatGptService.new(message).call
  end
end
