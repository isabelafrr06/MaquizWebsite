module Api
  module V1
    module Admin
      class TextsController < ApplicationController
        include Authenticatable
        before_action :authenticate_admin
        before_action :require_admin_role

        def index
          @texts = SiteText.all.order(:key)
          render json: @texts.map { |text| text_json(text) }
        end

        def show
          # Handle key with dots - Rails will decode it automatically
          key = params[:key] || params[:id]
          @text = SiteText.find_by(key: key)
          if @text
            render json: text_json(@text)
          else
            render json: { error: 'Text not found' }, status: :not_found
          end
        end

        def create
          @text = SiteText.new(text_params.except(:translations))
          
          if params[:translations].present?
            @text.translations = JSON.parse(params[:translations]) if params[:translations].is_a?(String)
            @text.translations = params[:translations] if params[:translations].is_a?(Hash)
          end
          
          if @text.save
            render json: text_json(@text), status: :created
          else
            render json: { errors: @text.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def update
          # Handle key with dots - Rails will decode it automatically
          key = params[:key] || params[:id]
          @text = SiteText.find_by(key: key)
          
          unless @text
            render json: { error: 'Text not found' }, status: :not_found
            return
          end
          
          if params[:translations].present?
            @text.translations = JSON.parse(params[:translations]) if params[:translations].is_a?(String)
            @text.translations = params[:translations] if params[:translations].is_a?(Hash)
          end
          
          if @text.update(text_params.except(:translations))
            render json: text_json(@text)
          else
            render json: { errors: @text.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def destroy
          # Handle key with dots - Rails will decode it automatically
          key = params[:key] || params[:id]
          @text = SiteText.find_by(key: key)
          if @text
            @text.destroy
            head :no_content
          else
            render json: { error: 'Text not found' }, status: :not_found
          end
        end

        private

        def text_params
          params.permit(:key, :description, :translations)
        end
        
        def text_json(text)
          text.as_json.merge(
            translations: text.translations || {}
          )
        end
      end
    end
  end
end

