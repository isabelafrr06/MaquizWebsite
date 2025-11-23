module Api
  module V1
    module Admin
      class UsersController < ApplicationController
        include Authenticatable
        before_action :authenticate_admin
        before_action :require_admin_role, except: [:index, :show]

        def index
          users = ::Admin.all.order(created_at: :desc)
          render json: users.map { |user| user_json(user) }
        end

        def show
          user = ::Admin.find(params[:id])
          render json: user_json(user)
        end

        def create
          user = ::Admin.new(user_params)
          if user.save
            log_audit('create', user, "Created admin user: #{user.email}")
            render json: user_json(user), status: :created
          else
            render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
          end
        rescue => e
          Rails.logger.error("Error creating user: #{e.message}")
          Rails.logger.error(e.backtrace.join("\n"))
          render json: { errors: [e.message] }, status: :internal_server_error
        end

        def update
          user = ::Admin.find(params[:id])
          old_email = user.email
          changes = user.changes

          if user.update(user_params)
            log_audit('update', user, "Updated admin user: #{old_email}", changes)
            render json: user_json(user)
          else
            render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
          end
        rescue => e
          Rails.logger.error("Error updating user: #{e.message}")
          Rails.logger.error(e.backtrace.join("\n"))
          render json: { errors: [e.message] }, status: :internal_server_error
        end

        def destroy
          user = ::Admin.find(params[:id])
          email = user.email
          
          if user.destroy
            log_audit('delete', user, "Deleted admin user: #{email}")
            head :no_content
          else
            render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
          end
        rescue => e
          Rails.logger.error("Error deleting user: #{e.message}")
          Rails.logger.error(e.backtrace.join("\n"))
          render json: { errors: [e.message] }, status: :internal_server_error
        end

        private

        def user_params
          permitted = params.require(:user).permit(:email, :password, :password_confirmation, :role)
          
          # Ensure password_confirmation is present if password is present
          if permitted[:password].present? && permitted[:password_confirmation].blank?
            permitted[:password_confirmation] = permitted[:password]
          end
          
          # Only admins can set roles, and only admins can create other admins
          unless @current_admin&.admin?
            permitted.delete(:role)
          end
          
          # Default role for new users
          permitted[:role] ||= Admin::ROLE_ARTWORK_MANAGER unless permitted[:role].present?
          
          permitted
        end

        def log_audit(action, resource, description, changes = {})
          begin
            # Check if AuditLog class exists and table exists
            if defined?(::AuditLog) && ::AuditLog.table_exists?
              ::AuditLog.log(
                action,
                admin: @current_admin,
                resource: resource,
                changes: changes,
                description: description
              )
            end
          rescue NameError, ActiveRecord::StatementInvalid => e
            # Log table might not exist yet, continue anyway
            Rails.logger.warn("Could not create audit log: #{e.message}")
          rescue => e
            # Any other error, log but don't fail
            Rails.logger.warn("Could not create audit log: #{e.message}")
          end
        end

        def user_json(user)
          {
            id: user.id,
            email: user.email,
            role: user.role,
            created_at: user.created_at,
            updated_at: user.updated_at
          }
        end
      end
    end
  end
end

