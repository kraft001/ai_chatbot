class ChatsController < ApplicationController
  def index
    @chats = current_user.chats
  end

  def create
    @chat = current_user.chats.create
  end
end
