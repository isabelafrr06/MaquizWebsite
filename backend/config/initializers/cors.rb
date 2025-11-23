Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # In development, allow localhost origins
    # In production, use FRONTEND_URL environment variable
    if Rails.env.development?
      origins ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173', 'http://127.0.0.1:3000']
      resource '*',
        headers: :any,
        methods: [:get, :post, :put, :patch, :delete, :options, :head],
        credentials: true
    else
      # Production: use specific origins from environment variable
      frontend_urls = ENV.fetch('FRONTEND_URL', '').split(',').map(&:strip).reject(&:empty?)
      if frontend_urls.any?
        origins frontend_urls
        resource '*',
          headers: :any,
          methods: [:get, :post, :put, :patch, :delete, :options, :head],
          credentials: true
      else
        # Fallback: allow all origins but without credentials (less secure)
        origins '*'
        resource '*',
          headers: :any,
          methods: [:get, :post, :put, :patch, :delete, :options, :head],
          credentials: false
      end
    end
  end
end

