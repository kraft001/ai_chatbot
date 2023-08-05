class MessagesController < ApplicationController
  def index
    chat = current_user.chats.find(params[:chat_id])
    @messages = chat.messages.order(:created_at)
  end

  def create
  end
end
