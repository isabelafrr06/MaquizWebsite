module Api
  module V1
    module Admin
      class EventsController < ApplicationController
        include Authenticatable
        before_action :authenticate_admin
        before_action :require_admin_role

        def index
          @events = PortfolioEvent.all.order(year: :desc, display_order: :asc, created_at: :desc)
          render json: @events.map { |event| event_json(event) }
        end

        def show
          @event = PortfolioEvent.find(params[:id])
          render json: event_json(@event)
        end

        def create
          @event = PortfolioEvent.new(event_params.except(:translations))
          
          # Parse translations JSON if provided
          if params[:translations].present?
            @event.translations = JSON.parse(params[:translations]) if params[:translations].is_a?(String)
            @event.translations = params[:translations] if params[:translations].is_a?(Hash)
          end
          
          if @event.save
            log_audit('create', resource: @event, description: "Created event: #{@event.translated_title('en')}")
            render json: event_json(@event), status: :created
          else
            render json: { errors: @event.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def update
          @event = PortfolioEvent.find(params[:id])
          
          # Parse translations JSON if provided
          if params[:translations].present?
            @event.translations = JSON.parse(params[:translations]) if params[:translations].is_a?(String)
            @event.translations = params[:translations] if params[:translations].is_a?(Hash)
          end
          
          changes = @event.changes
          if @event.update(event_params.except(:translations))
            log_audit('update', resource: @event, description: "Updated event: #{@event.translated_title('en')}", changes: changes)
            render json: event_json(@event)
          else
            render json: { errors: @event.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def destroy
          @event = PortfolioEvent.find(params[:id])
          title = @event.translated_title('en')
          @event.destroy
          log_audit('delete', resource: @event, description: "Deleted event: #{title}")
          head :no_content
        end

        private

        def event_params
          params.permit(:event_type, :title, :description, :year, :display_order, :translations)
        end
        
        def event_json(event)
          event.as_json.merge(
            translations: event.translations || {}
          )
        end
      end
    end
  end
end

