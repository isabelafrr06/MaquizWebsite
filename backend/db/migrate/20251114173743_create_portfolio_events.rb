class CreatePortfolioEvents < ActiveRecord::Migration[7.1]
  def change
    create_table :portfolio_events do |t|
      t.string :event_type, null: false # 'exhibition_individual', 'exhibition_duo', 'exhibition_collective', 'award', 'publication', 'upcoming'
      t.text :title, null: false
      t.text :description
      t.integer :year
      t.jsonb :translations, default: {}
      t.integer :display_order, default: 0 # For ordering within same type/year

      t.timestamps
    end
    
    add_index :portfolio_events, :event_type
    add_index :portfolio_events, :year
    add_index :portfolio_events, [:event_type, :year, :display_order]
    add_index :portfolio_events, :translations, using: :gin
  end
end
