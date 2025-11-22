module Api
  module V1
    class ArtistProfileController < ApplicationController
      def show
        profile = ArtistProfile.instance
        render json: {
          photo_url: profile.photo.attached? ? url_for(profile.photo) : nil,
          photo_attached: profile.photo.attached?
        }
      end
    end
  end
end

