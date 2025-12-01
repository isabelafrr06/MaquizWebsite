max_threads_count = ENV.fetch("RAILS_MAX_THREADS") { 5 }
min_threads_count = ENV.fetch("RAILS_MIN_THREADS") { max_threads_count }
threads min_threads_count, max_threads_count

# Railway sets PORT automatically, default to 8080 if not set
port ENV.fetch("PORT") { 8080 }
environment ENV.fetch("RAILS_ENV") { "development" }

# Only use pidfile in development, Railway manages processes in production
if ENV["RAILS_ENV"] == "production"
  # Create tmp directories if they don't exist
  require "fileutils"
  FileUtils.mkdir_p("tmp/pids") unless File.directory?("tmp/pids")
  pidfile ENV.fetch("PIDFILE") { "tmp/pids/server.pid" }
else
  pidfile ENV.fetch("PIDFILE") { "tmp/pids/server.pid" }
end

workers ENV.fetch("WEB_CONCURRENCY") { 2 }

preload_app!

