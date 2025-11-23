module Api
  module V1
    module Admin
      class AuditLogsController < ApplicationController
        include Authenticatable
        before_action :authenticate_admin
        before_action :require_admin_role

        def index
          unless defined?(AuditLog) && AuditLog.table_exists?
            render json: []
            return
          end
          
          logs = AuditLog.recent
          logs = logs.by_admin(params[:admin_id]) if params[:admin_id].present?
          logs = logs.by_action(params[:action]) if params[:action].present?
          logs = logs.by_resource(params[:resource_type], params[:resource_id]) if params[:resource_type].present?
          logs = logs.limit(1000) # Limit to prevent huge responses

          render json: logs.map { |log| log_json(log) }
        end

        def show
          unless defined?(AuditLog) && AuditLog.table_exists?
            render json: { error: 'Audit logs not available' }, status: :not_found
            return
          end
          
          log = AuditLog.find(params[:id])
          render json: log_json(log)
        end

        private

        def log_json(log)
          {
            id: log.id,
            action: log.action,
            resource_type: log.resource_type,
            resource_id: log.resource_id,
            changes: log.changes,
            ip_address: log.ip_address,
            description: log.description,
            admin_email: log.admin&.email,
            created_at: log.created_at
          }
        end
      end
    end
  end
end

