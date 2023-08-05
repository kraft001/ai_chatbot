class ChatgptService
  attr_reader :system_message, :user_message, :attempts

  def initialize(system_message, user_message)
    @system_message = system_message
    @user_message = user_message
    @attempts = 5
  end

  def chat_response
    return @chat_response if @chat_response.present?

    response = client.chat(
      parameters: {
        model: 'gpt-3.5-turbo-16k',
        temperature: 1.15,
        max_tokens: 300,
        top_p: 1.0,
        frequency_penalty: 1.0,
        presence_penalty: 1.0,
        n: 1,
        messages: [
          { role: 'system', content: system_message },
          { role: 'user', content: limited_user_message }
        ]
      }
    )

    if response.code == 500
      raise response.dig('error', 'message')
    end

    @chat_response = response
  rescue => err
    Rollbar.warning(
      'ChatGPT request failed',
      system_message:,
      user_message:,
      attempts:,
      error_message: err.message
    )

    @attempts -= 1
    if attempts.positive?
      sleep 1
      retry
    end
    raise err
  end

  protected

  def client
    OpenAI::Client.new(access_token:, request_timeout: 30)
  end

  def access_token
    ENV.fetch('OPENAI_ACCESS_TOKEN').split(',').sample
  end

  def limited_user_message
    return user_message if user_message.length < 11000

    user_message.truncate_words(
      2325, # (3500 - 300 - 100) * 0.75
      omission: '.'
    )
  end
end
