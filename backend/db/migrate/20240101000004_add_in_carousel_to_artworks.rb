class AddInCarouselToArtworks < ActiveRecord::Migration[7.1]
  def change
    add_column :artworks, :in_carousel, :boolean, default: false
  end
end

