class Chat < ApplicationRecord
  belongs_to :user, inverse_of: :chats
  has_many :messages, inverse_of: :chat, dependent: :destroy
end
