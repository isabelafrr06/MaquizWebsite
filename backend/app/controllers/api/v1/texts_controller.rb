module Api
  module V1
    class TextsController < ApplicationController
      def index
        locale = params[:locale] || request.headers['Accept-Language']&.split(',')&.first&.split('-')&.first || 'es'
        
        # Get ALL site texts (including hidden ones) so frontend knows which keys exist in DB
        # This prevents fallback to static translations for texts that exist but are hidden
        site_texts = SiteText.all
        result = {}
        all_keys_structure = {} # Track all keys that exist in database (even if hidden)
        
        site_texts.each do |text|
          # Convert dot notation key (e.g., "home.quote") to nested hash
          keys = text.key.split('.')
          current = result
          keys_current = all_keys_structure
          
          keys[0..-2].each do |key|
            current[key] ||= {}
            current = current[key]
            keys_current[key] ||= {}
            keys_current = keys_current[key]
          end
          
          # Mark that this key exists in database (nested structure matching the key path)
          keys_current[keys.last] = true
          
          # Only include value if text is NOT hidden
          unless text.hidden == true
            value = text.translated_value(locale)
            # Include value even if empty string (but not if nil)
            current[keys.last] = value unless value.nil?
          end
        end
        
        # Include metadata about which keys exist in database
        render json: {
          texts: result,
          _meta: {
            all_keys: all_keys_structure, # All keys that exist in DB (even if hidden), nested structure
            locale: locale
          }
        }
      end
    end
  end
end

