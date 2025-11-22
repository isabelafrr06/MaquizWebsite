module Api
  module V1
    class AdminController < ApplicationController
      include Authenticatable

      def login
        admin = ::Admin.find_by(email: params[:email])
        
        if admin && admin.authenticate(params[:password])
          token = generate_token(admin.id)
          render json: { token: token, message: 'Login successful' }
        else
          render json: { error: 'Invalid credentials' }, status: :unauthorized
        end
      end
    end
  end
end

