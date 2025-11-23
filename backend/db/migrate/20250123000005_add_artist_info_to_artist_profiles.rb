class AddArtistInfoToArtistProfiles < ActiveRecord::Migration[7.1]
  def change
    add_column :artist_profiles, :name, :string
    add_column :artist_profiles, :artistic_name, :string
    add_column :artist_profiles, :birthdate, :string
    add_column :artist_profiles, :country, :string
    add_column :artist_profiles, :email, :string
    add_column :artist_profiles, :phone, :string
    add_column :artist_profiles, :technique, :string
    add_column :artist_profiles, :location, :string
    add_column :artist_profiles, :bio, :text
    add_column :artist_profiles, :translations, :jsonb, default: {}
  end
end

