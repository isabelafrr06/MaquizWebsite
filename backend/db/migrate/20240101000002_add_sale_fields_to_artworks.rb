class AddSaleFieldsToArtworks < ActiveRecord::Migration[7.1]
  def change
    add_column :artworks, :for_sale, :boolean, default: false
    add_column :artworks, :price, :decimal, precision: 10, scale: 2
  end
end

