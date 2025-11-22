class CreateSiteTexts < ActiveRecord::Migration[7.1]
  def change
    create_table :site_texts do |t|
      t.string :key, null: false, index: { unique: true }
      t.jsonb :translations, default: {}
      t.text :description # For admin reference

      t.timestamps
    end
    
    add_index :site_texts, :translations, using: :gin
  end
end
