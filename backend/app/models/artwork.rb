class Artwork < ApplicationRecord
  has_one_attached :image
  
  # Store translations as JSON: { "es": { "title": "...", "description": "...", "category": "..." }, "en": { ... } }
  validates :title, presence: { message: "Title is required" }
  validate :image_or_url_present
  
  # Get translated field, fallback to default language or original field
  def translated_title(locale = 'es')
    translations.dig(locale, 'title') || translations.dig('es', 'title') || title
  end
  
  def translated_description(locale = 'es')
    translations.dig(locale, 'description') || translations.dig('es', 'description') || description
  end
  
  def translated_category(locale = 'es')
    translations.dig(locale, 'category') || translations.dig('es', 'category') || category
  end

  def translated_theme(locale = 'es')
    translations.dig(locale, 'theme') || translations.dig('es', 'theme') || theme
  end
  
  # Set translation for a specific locale
  def set_translation(locale, field, value)
    self.translations ||= {}
    self.translations[locale] ||= {}
    self.translations[locale][field] = value
  end
  
  def image_url_or_attachment
    if image.attached?
      Rails.application.routes.url_helpers.url_for(image)
    else
      image_url
    end
  end
  
  private
  
  def image_or_url_present
    unless image.attached? || image_url.present?
      errors.add(:base, "Either an image file or image URL must be provided. Please upload an image file or provide an image URL.")
    end
  end
end

