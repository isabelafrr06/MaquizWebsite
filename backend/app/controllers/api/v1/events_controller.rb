module Api
  module V1
    class EventsController < ApplicationController
      def index
        locale = params[:locale] || request.headers['Accept-Language']&.split(',')&.first&.split('-')&.first || 'es'
        
        events = PortfolioEvent.all.ordered
        
        # Group by event type
        result = {
          exhibitions_individual: events.exhibitions_individual.map { |e| event_json(e, locale) },
          exhibitions_duo: events.exhibitions_duo.map { |e| event_json(e, locale) },
          exhibitions_collective: events.exhibitions_collective.map { |e| event_json(e, locale) },
          awards: events.awards.map { |e| event_json(e, locale) },
          publications: events.publications.map { |e| event_json(e, locale) },
          upcoming: events.upcoming.map { |e| event_json(e, locale) }
        }
        
        render json: result
      end
      
      private
      
      def event_json(event, locale = 'es')
        {
          id: event.id,
          event_type: event.event_type,
          title: event.translated_title(locale),
          description: event.translated_description(locale),
          year: event.year,
          display_order: event.display_order,
          created_at: event.created_at,
          updated_at: event.updated_at
        }
      end
    end
  end
end

