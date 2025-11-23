class ArtistProfile < ApplicationRecord
  has_one_attached :photo
  
  # Ensure only one profile exists
  def self.instance
    first_or_create!
  end

  # Get translated field, fallback to default language or original field
  def translated_name(locale = 'es')
    translations.dig(locale, 'name') || translations.dig('es', 'name') || name
  end

  def translated_artistic_name(locale = 'es')
    translations.dig(locale, 'artistic_name') || translations.dig('es', 'artistic_name') || artistic_name
  end

  def translated_birthdate(locale = 'es')
    translations.dig(locale, 'birthdate') || translations.dig('es', 'birthdate') || birthdate
  end

  def translated_country(locale = 'es')
    translations.dig(locale, 'country') || translations.dig('es', 'country') || country
  end

  def translated_email(locale = 'es')
    translations.dig(locale, 'email') || translations.dig('es', 'email') || email
  end

  def translated_phone(locale = 'es')
    translations.dig(locale, 'phone') || translations.dig('es', 'phone') || phone
  end

  def translated_technique(locale = 'es')
    translations.dig(locale, 'technique') || translations.dig('es', 'technique') || technique
  end

  def translated_location(locale = 'es')
    translations.dig(locale, 'location') || translations.dig('es', 'location') || location
  end

  def translated_bio(locale = 'es')
    translations.dig(locale, 'bio') || translations.dig('es', 'bio') || bio
  end

  # Set translation for a specific locale
  def set_translation(locale, field, value)
    self.translations ||= {}
    self.translations[locale] ||= {}
    self.translations[locale][field] = value
  end
end


