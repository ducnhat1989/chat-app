class ChatMessage < ApplicationRecord
  after_create_commit do
    ChatMessageCreationEventBroadcaseJob.perform_later self
  end

  belongs_to :user
end
