class SiteText < ApplicationRecord
  validates :key, presence: true, uniqueness: true
  
  # Get translated value for a specific locale
  def translated_value(locale = 'es')
    translations.dig(locale) || translations.dig('es') || ''
  end
  
  # Set translation for a specific locale
  def set_translation(locale, value)
    self.translations ||= {}
    self.translations[locale] = value
  end
end

