class ApplicationController < ActionController::API
  include Authenticatable
  include ActionController::UrlFor
  include Rails.application.routes.url_helpers
end

