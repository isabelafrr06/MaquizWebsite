Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :artworks, only: [:index, :show]
      resources :events, only: [:index]
      resources :texts, only: [:index]
      resources :categories, only: [:index]
      get 'artist_profile', to: 'artist_profile#show'
      
      # Admin routes
      post 'admin/login', to: 'admin#login'
      
      namespace :admin do
        resources :artworks
        resources :events
        resources :texts, param: :key, constraints: { key: /[^\/]+/ }
        resources :categories
        get 'carousel', to: 'carousel#index'
        put 'carousel/:id', to: 'carousel#update'
        patch 'carousel/:id', to: 'carousel#update'
        get 'artist_profile', to: 'artist_profile#show'
        put 'artist_profile', to: 'artist_profile#update'
        patch 'artist_profile', to: 'artist_profile#update'
      end
    end
  end
end

