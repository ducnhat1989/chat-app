class Api::V1::ChatMessagesController < ApplicationController
  def index
    limit = (params[:limit].presence || 20).to_i
    @nextPage = (params[:nextPage].presence || 0).to_i
    offset = @nextPage * limit
    @chat_messages = ChatMessage.preload(:user).order(id: :desc)
      .limit(limit).offset(offset)
  end
end