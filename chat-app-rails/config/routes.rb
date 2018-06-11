Rails.application.routes.draw do
  mount_devise_token_auth_for 'User', at: 'auth', controllers: {
    sessions: 'devise_token_auth_extend/customer_sessions'
  }

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  mount ActionCable.server => '/cable'

  namespace :api do
    namespace :v1 do
      resources :chat_logs, only: :index, defaults: {format: :json}
      resources :chat_messages, only: :index, defaults: {format: :json}
    end
  end
end
