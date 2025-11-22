class AddTranslationsToArtworks < ActiveRecord::Migration[7.1]
  def change
    add_column :artworks, :translations, :jsonb, default: {}
    add_index :artworks, :translations, using: :gin
  end
end

