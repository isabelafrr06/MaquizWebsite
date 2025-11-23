class CreateAuditLogs < ActiveRecord::Migration[7.1]
  def up
    unless table_exists?(:audit_logs)
      create_table :audit_logs do |t|
        t.references :admin, null: true, foreign_key: true
        t.string :action, null: false
        t.string :resource_type
        t.integer :resource_id
        t.jsonb :changes, default: {}
        t.string :ip_address
        t.text :description

        t.timestamps
      end
    end

    # Add indexes only if they don't exist
    add_index :audit_logs, [:resource_type, :resource_id], if_not_exists: true unless index_exists?(:audit_logs, [:resource_type, :resource_id])
    add_index :audit_logs, :created_at, if_not_exists: true unless index_exists?(:audit_logs, :created_at)
    # admin_id index is automatically created by t.references :admin above
  end

  def down
    drop_table :audit_logs if table_exists?(:audit_logs)
  end
end

