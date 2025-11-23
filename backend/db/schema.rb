# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2025_11_22_173200) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "admins", force: :cascade do |t|
    t.string "email", null: false
    t.string "password_digest", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "role", default: "admin", null: false
    t.index ["email"], name: "index_admins_on_email", unique: true
    t.index ["role"], name: "index_admins_on_role"
  end

  create_table "artist_profiles", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "artworks", force: :cascade do |t|
    t.string "title"
    t.text "description"
    t.string "image_url"
    t.string "category"
    t.integer "year"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "for_sale", default: false
    t.decimal "price", precision: 10, scale: 2
    t.boolean "in_carousel", default: false
    t.jsonb "translations", default: {}
    t.string "theme"
    t.index ["translations"], name: "index_artworks_on_translations", using: :gin
  end

  create_table "audit_logs", force: :cascade do |t|
    t.bigint "admin_id"
    t.string "action", null: false
    t.string "resource_type"
    t.integer "resource_id"
    t.jsonb "changes", default: {}
    t.string "ip_address"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["admin_id"], name: "index_audit_logs_on_admin_id"
    t.index ["created_at"], name: "index_audit_logs_on_created_at"
    t.index ["resource_type", "resource_id"], name: "index_audit_logs_on_resource_type_and_resource_id"
  end

  create_table "categories", force: :cascade do |t|
    t.string "name", null: false
    t.jsonb "translations", default: {}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_categories_on_name", unique: true
    t.index ["translations"], name: "index_categories_on_translations", using: :gin
  end

  create_table "portfolio_events", force: :cascade do |t|
    t.string "event_type", null: false
    t.text "title", null: false
    t.text "description"
    t.integer "year"
    t.jsonb "translations", default: {}
    t.integer "display_order", default: 0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["event_type", "year", "display_order"], name: "idx_on_event_type_year_display_order_ec726da57f"
    t.index ["event_type"], name: "index_portfolio_events_on_event_type"
    t.index ["translations"], name: "index_portfolio_events_on_translations", using: :gin
    t.index ["year"], name: "index_portfolio_events_on_year"
  end

  create_table "site_texts", force: :cascade do |t|
    t.string "key", null: false
    t.jsonb "translations", default: {}
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["key"], name: "index_site_texts_on_key", unique: true
    t.index ["translations"], name: "index_site_texts_on_translations", using: :gin
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "audit_logs", "admins"
end
