json.currentPage params[:currentPage]
json.chat_logs @chat_messages do |chat_message|
  json.key chat_message.id
  json.user_name "Name #{chat_message.id}"
  json.created_at chat_message.created_at.strftime('%H:%M')
  json.content chat_message.content
end