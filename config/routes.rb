Rails.application.routes.draw do
  devise_for :users
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"

  resources :chats, only: %i[index create] do
    resources :messages, only: %i[index create]
  end

  root to: "home#index"
end
