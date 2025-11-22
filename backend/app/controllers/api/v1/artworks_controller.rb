module Api
  module V1
    class ArtworksController < ApplicationController
      def index
        @artworks = Artwork.all
        locale = params[:locale] || request.headers['Accept-Language']&.split(',')&.first&.split('-')&.first || 'es'
        render json: @artworks.map { |artwork| artwork_json(artwork, locale) }
      end

      def show
        @artwork = Artwork.find(params[:id])
        locale = params[:locale] || request.headers['Accept-Language']&.split(',')&.first&.split('-')&.first || 'es'
        render json: artwork_json(@artwork, locale)
      end
      
      private
      
      def artwork_json(artwork, locale = 'es')
        image_url = if artwork.image.attached?
          url_for(artwork.image)
        else
          artwork.image_url
        end
        
        {
          id: artwork.id,
          title: artwork.translated_title(locale),
          description: artwork.translated_description(locale),
          category: artwork.translated_category(locale),
          theme: artwork.translated_theme(locale),
          year: artwork.year,
          for_sale: artwork.for_sale,
          price: artwork.price,
          in_carousel: artwork.in_carousel,
          image_url: image_url,
          translations: artwork.translations || {},
          created_at: artwork.created_at,
          updated_at: artwork.updated_at
        }
      end
    end
  end
end

