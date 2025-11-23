module Api
  module V1
    module Admin
      class ArtistProfileController < ApplicationController
        include Authenticatable
        before_action :authenticate_admin
        before_action :require_admin_role

        def show
          profile = ArtistProfile.instance
          render json: {
            id: profile.id,
            photo_url: profile.photo.attached? ? url_for(profile.photo) : nil,
            photo_attached: profile.photo.attached?
          }
        end

        def update
          profile = ArtistProfile.instance

          if params[:remove_photo].present? && (params[:remove_photo] == 'true' || params[:remove_photo] == true)
            profile.photo.purge if profile.photo.attached?
          elsif params[:photo].present?
            profile.photo.attach(params[:photo])
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
            render json: {
              id: profile.id,
              photo_url: profile.photo.attached? ? url_for(profile.photo) : nil,
              photo_attached: profile.photo.attached?
            }
          else
            render json: { errors: profile.errors.full_messages }, status: :unprocessable_entity
          end
        end
      end
    end
  end
end

