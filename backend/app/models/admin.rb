class Admin < ApplicationRecord
  has_secure_password
  validates :email, presence: true, uniqueness: true
  validates :role, presence: true, inclusion: { in: %w[admin artwork_manager] }

  # Role constants
  ROLE_ADMIN = 'admin'
  ROLE_ARTWORK_MANAGER = 'artwork_manager'

  def admin?
    role == ROLE_ADMIN
  end

  def artwork_manager?
    role == ROLE_ARTWORK_MANAGER
  end

  def can_manage_artworks?
    admin? || artwork_manager?
  end

  def can_manage_users?
    admin?
  end

  def can_manage_texts?
    admin?
  end

  def can_manage_events?
    admin?
  end

  def can_manage_categories?
    admin?
  end

  def can_manage_carousel?
    admin?
  end

  def can_manage_artist_profile?
    admin?
  end

  def can_view_logs?
    admin?
  end
end

