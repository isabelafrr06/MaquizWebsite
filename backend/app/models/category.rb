class Category < ApplicationRecord
  validates :name, presence: true, uniqueness: true

  # Get translated name, fallback to default language or original name
  def translated_name(locale = 'es')
    translations.dig(locale, 'name') || translations.dig('es', 'name') || name
  end

  # Set translation for a specific locale
  def set_translation(locale, value)
    self.translations ||= {}
    self.translations[locale] ||= {}
    self.translations[locale]['name'] = value
  end
end
