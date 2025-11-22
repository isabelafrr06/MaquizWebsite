module Api
  module V1
    class TextsController < ApplicationController
      def index
        locale = params[:locale] || request.headers['Accept-Language']&.split(',')&.first&.split('-')&.first || 'es'
        
        # Get all site texts and format them for the frontend
        site_texts = SiteText.all
        result = {}
        
        site_texts.each do |text|
          # Convert dot notation key (e.g., "home.quote") to nested hash
          keys = text.key.split('.')
          current = result
          
          keys[0..-2].each do |key|
            current[key] ||= {}
            current = current[key]
          end
          
          # Get translated value for the requested locale
          value = text.translated_value(locale)
          current[keys.last] = value if value.present?
        end
        
        render json: result
      end
    end
  end
end

