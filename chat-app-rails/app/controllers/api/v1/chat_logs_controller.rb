class Api::V1::ChatLogsController < ApplicationController
  def index
    limit = 20
    num_chat_in_page = limit * 2
    offset = [
      limit * (params[:currentPage].to_i - 1),
      (ChatMessage.count(:id) - num_chat_in_page)
    ].min
    @chat_messages = ChatMessage.order(id: :desc)
      .limit(num_chat_in_page).offset(offset)
      .reverse
  end
end