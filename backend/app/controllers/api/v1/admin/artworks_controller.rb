module Api
  module V1
    module Admin
      class ArtworksController < ApplicationController
        include Authenticatable
        before_action :authenticate_admin

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
          
          if params[:image].present?
            @artwork.image.attach(params[:image])
          end
          
          if @artwork.save
            render json: artwork_json(@artwork), status: :created
          else
            render json: { errors: @artwork.errors.full_messages }, status: :unprocessable_entity
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
          
          if @artwork.update(artwork_params.except(:image, :translations))
            render json: artwork_json(@artwork)
          else
            render json: { errors: @artwork.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def destroy
          @artwork = Artwork.find(params[:id])
          @artwork.destroy
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

