class MessagesController < ApplicationController
  def index
    chat = current_user.chats.find(params[:chat_id])
    @messages = chat.messages.order(:created_at)
  end

  def create
    if params[:text].blank?
      head :unprocessable_entity
      return
    end

    chat = current_user.chats.find(params[:chat_id])
    @message = chat.messages.create(text: params[:text], from_user: true)

    ActionCable.server.broadcast('chat_channel', @message)
  end
end
