class AddRoleToAdmins < ActiveRecord::Migration[7.1]
  def change
    add_column :admins, :role, :string, default: 'admin', null: false
    add_index :admins, :role
  end
end

