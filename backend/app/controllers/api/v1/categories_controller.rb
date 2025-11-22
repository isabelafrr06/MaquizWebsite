module Api
  module V1
    class CategoriesController < ApplicationController
      def index
        locale = params[:locale] || request.headers['Accept-Language']&.split(',')&.first&.split('-')&.first || 'es'
        @categories = Category.all.order(:name)
        render json: @categories.map { |category| category_json(category, locale) }
      end

      private

      def category_json(category, locale = 'es')
        {
          id: category.id,
          name: category.translated_name(locale),
          translations: category.translations || {}
        }
      end
    end
  end
end

