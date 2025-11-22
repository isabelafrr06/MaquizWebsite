class ArtistProfile < ApplicationRecord
  has_one_attached :photo
  
  # Ensure only one profile exists
  def self.instance
    first_or_create!
  end
end

