class AddHiddenToSiteTexts < ActiveRecord::Migration[7.1]
  def change
    add_column :site_texts, :hidden, :boolean, default: false, null: false
    add_index :site_texts, :hidden
  end
end

