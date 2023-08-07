class ChatGptService
  attr_reader :user_message, :message

  def initialize(user_message)
    @user_message = user_message
  end

  def call
    create && broadcast
  end

  protected

  def create
    @message = chat.messages.create(
      text: chat_response,
      from_user: false
    )
  end

  def broadcast
    ActionCable.server.broadcast('chat_channel', @message)
  end

  def chat
    @chat ||= user_message.chat
  end

  def chat_response
    return @chat_response if @chat_response.present?

    response = client.chat(
      parameters: {
        model: 'gpt-3.5-turbo-16k',
        n: 1,
        messages: messages
      }
    )

    if response['error'].present?
      raise response.dig('error', 'message')
    end

    @chat_response = response&.dig('choices', 0, 'message', 'content')
  end

  def messages
    chat.messages.order(created_at: :desc).limit(10).reverse.map do |message|
      { role: (message.from_user? ? 'user' : 'system'), content: message.text }
    end
  end

  def client
    @client ||= OpenAI::Client.new(
      access_token: ENV.fetch('OPENAI_ACCESS_TOKEN')
    )
  end
end
