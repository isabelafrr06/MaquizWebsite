Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # Allow all origins in development, specific origins in production
    origins Rails.env.development? ? '*' : ENV.fetch('FRONTEND_URL', '*').split(',')
    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true
  end
end

