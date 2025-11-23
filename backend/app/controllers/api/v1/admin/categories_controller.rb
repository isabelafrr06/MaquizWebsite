module Api
  module V1
    module Admin
      class CategoriesController < ApplicationController
        include Authenticatable
        before_action :authenticate_admin
        before_action :require_admin_role
        before_action :set_category, only: [:show, :update, :destroy]

        def index
          @categories = Category.all.order(:name)
          render json: @categories.map { |category| category_json(category) }
        end

        def show
          render json: category_json(@category)
        end

        def create
          @category = Category.new(category_params.except(:translations))

          if params[:translations].present?
            @category.translations = JSON.parse(params[:translations]) if params[:translations].is_a?(String)
            @category.translations = params[:translations] if params[:translations].is_a?(Hash)
          end

          if @category.save
            render json: category_json(@category), status: :created
          else
            render json: { errors: @category.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def update
          if params[:translations].present?
            @category.translations = JSON.parse(params[:translations]) if params[:translations].is_a?(String)
            @category.translations = params[:translations] if params[:translations].is_a?(Hash)
          end

          if @category.update(category_params.except(:translations))
            render json: category_json(@category)
          else
            render json: { errors: @category.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def destroy
          @category.destroy
          head :no_content
        end

        private

        def set_category
          @category = Category.find(params[:id])
        end

        def category_params
          params.permit(:name, :translations)
        end

        def category_json(category)
          category.as_json.merge(
            translations: category.translations || {}
          )
        end
      end
    end
  end
end

