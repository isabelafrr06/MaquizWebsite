class RenameChangesToChangesDataInAuditLogs < ActiveRecord::Migration[7.1]
  def up
    if table_exists?(:audit_logs) && column_exists?(:audit_logs, :changes)
      rename_column :audit_logs, :changes, :changes_data
    end
  end

  def down
    if table_exists?(:audit_logs) && column_exists?(:audit_logs, :changes_data)
      rename_column :audit_logs, :changes_data, :changes
    end
  end
end

