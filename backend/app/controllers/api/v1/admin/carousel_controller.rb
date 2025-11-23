module Api
  module V1
    module Admin
      class CarouselController < ApplicationController
        include Authenticatable
        before_action :authenticate_admin
        before_action :require_admin_role

        def index
          @artworks = Artwork.where(in_carousel: true).order(created_at: :desc)
          render json: @artworks
        end

        def update
          @artwork = Artwork.find(params[:id])
          old_value = @artwork.in_carousel
          @artwork.update(in_carousel: params[:in_carousel])
          action_desc = params[:in_carousel] ? "Added artwork to carousel" : "Removed artwork from carousel"
          log_audit('update', resource: @artwork, description: "#{action_desc}: #{@artwork.translated_title('en')}", changes: { in_carousel: [old_value, params[:in_carousel]] })
          render json: @artwork
        end
      end
    end
  end
end

