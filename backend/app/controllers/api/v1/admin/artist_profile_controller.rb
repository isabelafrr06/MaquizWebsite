module Api
  module V1
    module Admin
      class ArtistProfileController < ApplicationController
        include Authenticatable
        before_action :authenticate_admin
        before_action :require_admin_role

        def show
          profile = ArtistProfile.instance
          render json: profile_json(profile)
        end

        def update
          profile = ArtistProfile.instance

          # Handle photo upload/removal
          if params[:remove_photo].present? && (params[:remove_photo] == 'true' || params[:remove_photo] == true)
            profile.photo.purge if profile.photo.attached?
          elsif params[:photo].present?
            profile.photo.attach(params[:photo])
          end

          # Handle artist information fields
          if params[:name].present?
            profile.name = params[:name]
          end
          if params[:artistic_name].present?
            profile.artistic_name = params[:artistic_name]
          end
          if params[:birthdate].present?
            profile.birthdate = params[:birthdate]
          end
          if params[:country].present?
            profile.country = params[:country]
          end
          if params[:email].present?
            profile.email = params[:email]
          end
          if params[:phone].present?
            profile.phone = params[:phone]
          end
          if params[:technique].present?
            profile.technique = params[:technique]
          end
          if params[:location].present?
            profile.location = params[:location]
          end
          if params[:bio].present?
            profile.bio = params[:bio]
          end

          # Handle translations
          if params[:translations].present?
            profile.translations = JSON.parse(params[:translations]) if params[:translations].is_a?(String)
            profile.translations = params[:translations] if params[:translations].is_a?(Hash)
          end

          if profile.save
            action_desc = if params[:remove_photo].present? && (params[:remove_photo] == 'true' || params[:remove_photo] == true)
              "Removed artist photo"
            elsif params[:photo].present?
              "Updated artist photo"
            else
              "Updated artist profile"
            end
            log_audit('update', resource: profile, description: action_desc)
            render json: profile_json(profile)
          else
            render json: { errors: profile.errors.full_messages }, status: :unprocessable_entity
          end
        end

        private

        def profile_json(profile)
          {
            id: profile.id,
            photo_url: profile.photo.attached? ? url_for(profile.photo) : nil,
            photo_attached: profile.photo.attached?,
            name: profile.name,
            artistic_name: profile.artistic_name,
            birthdate: profile.birthdate,
            country: profile.country,
            email: profile.email,
            phone: profile.phone,
            technique: profile.technique,
            location: profile.location,
            bio: profile.bio,
            translations: profile.translations || {}
          }
        end
      end
    end
  end
end

