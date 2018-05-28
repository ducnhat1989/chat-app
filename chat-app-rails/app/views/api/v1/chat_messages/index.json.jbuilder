json.nextPage @nextPage
json.chat_messages @chat_messages do |chat_message|
  json._id chat_message.id
  json.text chat_message.content
  json.createdAt chat_message.created_at
  json.user do
    json._id chat_message.user.id
    json.name chat_message.user.name
  end
end