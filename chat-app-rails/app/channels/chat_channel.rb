class ChatChannel < ApplicationCable::Channel
  def subscribed
    stream_from 'chat_channel'
  end

  def unsubscribed
  end

  def create messages
    messages["content"].each do |message|
      ChatMessage.create content: message["text"], user_id: message["user"]["_id"]
    end
  end
end