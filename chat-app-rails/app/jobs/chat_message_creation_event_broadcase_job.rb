class ChatMessageCreationEventBroadcaseJob < ApplicationJob
  queue_as :default

  def perform chat_message
    ActionCable.server
      .broadcast(
        'chat_channel',
        _id: chat_message.id,
        text: chat_message.content,
        createdAt: chat_message.created_at,
        user: {
          _id: chat_message.user.id,
          name: chat_message.user.name
        }
      )
  end
end