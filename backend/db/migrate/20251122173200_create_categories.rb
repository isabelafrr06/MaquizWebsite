class CreateCategories < ActiveRecord::Migration[7.1]
  def change
    create_table :categories do |t|
      t.string :name, null: false
      t.jsonb :translations, default: {}

      t.timestamps
    end

    add_index :categories, :name, unique: true
    add_index :categories, :translations, using: :gin
  end
end
