class AddThemeToArtworks < ActiveRecord::Migration[7.1]
  def change
    add_column :artworks, :theme, :string
  end
end
