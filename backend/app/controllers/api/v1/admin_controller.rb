module Api
  module V1
    class AdminController < ApplicationController
      include Authenticatable

      def login
        admin = ::Admin.find_by(email: params[:email])
        
        unless admin && admin.authenticate(params[:password])
          render json: { error: 'Invalid credentials' }, status: :unauthorized
          return
        end
        
        token = generate_token(admin.id)
        
        # Log the login (async to avoid blocking)
        begin
          if defined?(::AuditLog) && ::AuditLog.table_exists?
            Thread.new do
              begin
                ::AuditLog.log(
                  'login',
                  admin: admin,
                  ip_address: request.remote_ip,
                  description: "Admin logged in: #{admin.email}"
                )
              rescue => e
                Rails.logger.warn("Could not create audit log: #{e.message}")
              end
            end
          end
        rescue => e
          Rails.logger.warn("Could not create audit log: #{e.message}")
        end
        
        render json: { 
          token: token, 
          message: 'Login successful',
          user: {
            id: admin.id,
            email: admin.email,
            role: admin.role || 'admin'
          }
        }
      end

      def show_current_user
        return unless authenticate_admin_for_current_user
        
        render json: {
          id: @current_admin.id,
          email: @current_admin.email,
          role: @current_admin.role
        }
      end

      private

      def authenticate_admin_for_current_user
        token = request.headers['Authorization']&.split(' ')&.last
        unless token
          render json: { error: 'Unauthorized' }, status: :unauthorized
          return false
        end

        begin
          decoded = JWT.decode(token, Rails.application.secret_key_base, true, { algorithm: 'HS256' })
          admin_id = decoded[0]['admin_id']
          @current_admin = ::Admin.find_by(id: admin_id)
          
          unless @current_admin
            render json: { error: 'Unauthorized' }, status: :unauthorized
            return false
          end
          return true
        rescue JWT::DecodeError
          render json: { error: 'Invalid token' }, status: :unauthorized
          return false
        end
      end
    end
  end
end

