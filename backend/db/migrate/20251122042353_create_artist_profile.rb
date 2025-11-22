class CreateArtistProfile < ActiveRecord::Migration[7.1]
  def change
    create_table :artist_profiles do |t|

      t.timestamps
    end
  end
end
