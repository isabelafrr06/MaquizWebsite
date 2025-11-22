class CreateArtworks < ActiveRecord::Migration[7.1]
  def change
    create_table :artworks do |t|
      t.string :title
      t.text :description
      t.string :image_url
      t.string :category
      t.integer :year

      t.timestamps
    end
  end
end

