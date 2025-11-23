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
          @artwork.update(in_carousel: params[:in_carousel])
          render json: @artwork
        end
      end
    end
  end
end

