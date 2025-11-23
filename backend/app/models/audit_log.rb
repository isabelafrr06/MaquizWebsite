class AuditLog < ApplicationRecord
  belongs_to :admin, optional: true

  # Action types
  ACTIONS = {
    login: 'login',
    logout: 'logout',
    create: 'create',
    update: 'update',
    delete: 'delete',
    view: 'view'
  }.freeze

  validates :action, presence: true

  scope :recent, -> { order(created_at: :desc) }
  scope :by_admin, ->(admin_id) { where(admin_id: admin_id) }
  scope :by_action, ->(action) { where(action: action) }
  scope :by_resource, ->(resource_type, resource_id = nil) do
    scope = where(resource_type: resource_type)
    scope = scope.where(resource_id: resource_id) if resource_id
    scope
  end

  def self.log(action, admin:, resource: nil, changes: {}, ip_address: nil, description: nil)
    create!(
      admin: admin,
      action: action,
      resource_type: resource&.class&.name,
      resource_id: resource&.id,
      changes_data: changes,
      ip_address: ip_address,
      description: description
    )
  end
end

