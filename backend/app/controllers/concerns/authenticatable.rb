module Authenticatable
  extend ActiveSupport::Concern

  private

  def authenticate_admin
    token = request.headers['Authorization']&.split(' ')&.last
    return render json: { error: 'Unauthorized' }, status: :unauthorized unless token

    begin
      decoded = JWT.decode(token, Rails.application.secret_key_base, true, { algorithm: 'HS256' })
      admin_id = decoded[0]['admin_id']
      @current_admin = ::Admin.find_by(id: admin_id)
      
      unless @current_admin
        render json: { error: 'Unauthorized' }, status: :unauthorized
      end
    rescue JWT::DecodeError
      render json: { error: 'Invalid token' }, status: :unauthorized
    end
  end

  def generate_token(admin_id)
    payload = { admin_id: admin_id, exp: 24.hours.from_now.to_i }
    JWT.encode(payload, Rails.application.secret_key_base, 'HS256')
  end

  def require_admin_role
    unless @current_admin&.admin?
      render json: { error: 'Admin access required' }, status: :forbidden
    end
  end

  def require_artwork_access
    unless @current_admin&.can_manage_artworks?
      render json: { error: 'Access denied' }, status: :forbidden
    end
  end
end

