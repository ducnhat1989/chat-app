10.times do |i|
  User.create do |user|
    user.name = "name #{i}"
    user.email = "email_#{i}@mail.com"
    user.password = "12345678"
    user.password_confirmation = "12345678"
  end
end

user_ids = User.pluck :id

500.times do |i|
  ChatMessage.create do |chat|
    chat.content = "Content #{i}"
    chat.user_id = user_ids.sample
    chat.created_at = 1.day.ago + i.minutes
    chat.updated_at = 1.day.ago + i.minutes
  end
end
