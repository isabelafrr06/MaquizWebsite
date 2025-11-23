module Api
  module V1
    module Admin
      class ArtworksController < ApplicationController
        include Authenticatable
        before_action :authenticate_admin
        before_action :require_artwork_access, except: [:index, :show]

        def index
          @artworks = Artwork.all.order(created_at: :desc)
          render json: @artworks.map { |artwork| artwork_json(artwork) }
        end

        def show
          @artwork = Artwork.find(params[:id])
          render json: artwork_json(@artwork)
        end

        def create
          @artwork = Artwork.new(artwork_params.except(:image, :translations))
          
          # Parse translations JSON if provided
          if params[:translations].present?
            @artwork.translations = JSON.parse(params[:translations]) if params[:translations].is_a?(String)
            @artwork.translations = params[:translations] if params[:translations].is_a?(Hash)
          end
          
          # Set title from translations if title param is not provided
          if @artwork.title.blank? && @artwork.translations.present?
            @artwork.title = @artwork.translations.dig('es', 'title') || 
                            @artwork.translations.dig('en', 'title') || 
                            @artwork.translations.dig('it', 'title') || 
                            ''
          end
          
          if params[:image].present?
            @artwork.image.attach(params[:image])
          end
          
          if @artwork.save
            begin
              log_audit('create', resource: @artwork, description: "Created artwork: #{@artwork.translated_title('en')}")
            rescue => e
              Rails.logger.error("Failed to log artwork creation: #{e.message}")
              Rails.logger.error(e.backtrace.first(10).join("\n"))
            end
            render json: artwork_json(@artwork), status: :created
          else
            # Return detailed error messages
            error_messages = @artwork.errors.full_messages
            render json: { 
              errors: error_messages,
              error_details: @artwork.errors.messages
            }, status: :unprocessable_entity
          end
        end

        def update
          @artwork = Artwork.find(params[:id])
          
          # Parse translations JSON if provided
          if params[:translations].present?
            @artwork.translations = JSON.parse(params[:translations]) if params[:translations].is_a?(String)
            @artwork.translations = params[:translations] if params[:translations].is_a?(Hash)
          end
          
          if params[:image].present?
            @artwork.image.attach(params[:image])
          end
          
          changes = @artwork.changes
          if @artwork.update(artwork_params.except(:image, :translations))
            begin
              log_audit('update', resource: @artwork, description: "Updated artwork: #{@artwork.translated_title('en')}", changes: changes)
            rescue => e
              Rails.logger.error("Failed to log artwork update: #{e.message}")
              Rails.logger.error(e.backtrace.first(10).join("\n"))
            end
            render json: artwork_json(@artwork)
          else
            # Return detailed error messages
            error_messages = @artwork.errors.full_messages
            render json: { 
              errors: error_messages,
              error_details: @artwork.errors.messages
            }, status: :unprocessable_entity
          end
        end

        def destroy
          @artwork = Artwork.find(params[:id])
          title = @artwork.translated_title('en')
          artwork_id = @artwork.id
          @artwork.destroy
          begin
            # Create a temporary object for logging since the artwork is destroyed
            temp_artwork = OpenStruct.new(class: Artwork, id: artwork_id)
            log_audit('delete', resource: temp_artwork, description: "Deleted artwork: #{title}")
          rescue => e
            Rails.logger.error("Failed to log artwork deletion: #{e.message}")
          end
          head :no_content
        end

        private

        def artwork_params
          params.permit(:title, :description, :image_url, :category, :theme, :year, :for_sale, :price, :in_carousel, :image, :translations)
        end
        
        def artwork_json(artwork)
          image_url = if artwork.image.attached?
            url_for(artwork.image)
          else
            artwork.image_url
          end
          
          artwork.as_json.merge(
            image_url: image_url,
            image_attached: artwork.image.attached?,
            translations: artwork.translations || {}
          )
        end
      end
    end
  end
end

