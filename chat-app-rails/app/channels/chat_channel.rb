class ChatChannel < ApplicationCable::Channel
  def subscribed
    stream_from 'chat_channel'
  end

  def unsubscribed
  end

  def create messages
    messages["content"].each do |message|
      user_id = message["user"]["_id"]
      ChatMessage.create content: message["text"], user_id: user_id
      push_notification message["text"], Device.where.not(user_id: user_id).pluck(:device_token)
    end
  end

  private
  def push_notification message, device_tokens
    fcm = FCM.new Settings.fcm_server_key, timeout: 3

    registration_ids = device_tokens # an array of one or more client registration tokens
    options = {
      data: {
        title: "You have a new message",
        body: message
      },
      collapse_key: "updated_score"
    }
    fcm.send registration_ids, options
  end
end