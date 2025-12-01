# Use official Ruby 3.3.0 image
FROM ruby:3.3.0-slim

# Install system dependencies
RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Install bundler
RUN gem install bundler:2.5.3

# Copy Gemfile and Gemfile.lock first for better caching
COPY Gemfile Gemfile.lock ./

# Install gems (production only, no dev/test)
RUN bundle install --jobs=4 --retry=3 --without development test && \
    bundle clean --force

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p tmp/pids /data/storage

# Expose port
EXPOSE 8080

# Start command (will be overridden by Railway's startCommand)
CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]

