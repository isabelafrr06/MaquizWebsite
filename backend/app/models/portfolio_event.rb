class PortfolioEvent < ApplicationRecord
  # Event types: exhibition_individual, exhibition_duo, exhibition_collective, award, publication, upcoming
  validates :event_type, presence: true
  validates :title, presence: true
  validates :event_type, inclusion: { 
    in: %w[exhibition_individual exhibition_duo exhibition_collective award publication upcoming] 
  }
  
  # Get translated field, fallback to default language or original field
  def translated_title(locale = 'es')
    translations.dig(locale, 'title') || translations.dig('es', 'title') || title
  end
  
  def translated_description(locale = 'es')
    translations.dig(locale, 'description') || translations.dig('es', 'description') || description
  end
  
  # Set translation for a specific locale
  def set_translation(locale, field, value)
    self.translations ||= {}
    self.translations[locale] ||= {}
    self.translations[locale][field] = value
  end
  
  # Scope for ordering (newest first)
  scope :ordered, -> { order(year: :desc, display_order: :asc, created_at: :desc) }
  
  # Scopes by event type
  scope :exhibitions_individual, -> { where(event_type: 'exhibition_individual') }
  scope :exhibitions_duo, -> { where(event_type: 'exhibition_duo') }
  scope :exhibitions_collective, -> { where(event_type: 'exhibition_collective') }
  scope :awards, -> { where(event_type: 'award') }
  scope :publications, -> { where(event_type: 'publication') }
  scope :upcoming, -> { where(event_type: 'upcoming') }
end

