class Message < ApplicationRecord
  belongs_to :chat, inverse_of: :messages
end
