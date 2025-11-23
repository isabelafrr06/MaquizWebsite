module Api
  module V1
    class ArtistProfileController < ApplicationController
      def show
        profile = ArtistProfile.instance
        locale = params[:locale] || 'es'
        
        render json: {
          photo_url: profile.photo.attached? ? url_for(profile.photo) : nil,
          photo_attached: profile.photo.attached?,
          name: profile.translated_name(locale),
          artistic_name: profile.translated_artistic_name(locale),
          birthdate: profile.translated_birthdate(locale),
          country: profile.translated_country(locale),
          email: profile.translated_email(locale),
          phone: profile.translated_phone(locale),
          technique: profile.translated_technique(locale),
          location: profile.translated_location(locale),
          bio: profile.translated_bio(locale),
          translations: profile.translations || {}
        }
      end
    end
  end
end

