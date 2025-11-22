# Categories
Category.destroy_all

puts "Creating categories..."
categories_data = [
  {
    name: 'Acrílico',
    translations: {
      'es' => { 'name' => 'Acrílico' },
      'en' => { 'name' => 'Acrylic' },
      'it' => { 'name' => 'Acrilico' }
    }
  },
  {
    name: 'Mosaico',
    translations: {
      'es' => { 'name' => 'Mosaico' },
      'en' => { 'name' => 'Mosaic' },
      'it' => { 'name' => 'Mosaico' }
    }
  },
  {
    name: 'Óleo',
    translations: {
      'es' => { 'name' => 'Óleo' },
      'en' => { 'name' => 'Oil' },
      'it' => { 'name' => 'Olio' }
    }
  },
  {
    name: 'Bisutería',
    translations: {
      'es' => { 'name' => 'Bisutería' },
      'en' => { 'name' => 'Jewelry' },
      'it' => { 'name' => 'Bigiotteria' }
    }
  },
  {
    name: 'Cuidado Personal',
    translations: {
      'es' => { 'name' => 'Cuidado Personal' },
      'en' => { 'name' => 'Personal Care' },
      'it' => { 'name' => 'Cura Personale' }
    }
  }
]

categories_data.each do |cat_data|
  category = Category.create!(
    name: cat_data[:name],
    translations: cat_data[:translations]
  )
  puts "Created category: #{category.name}"
end

puts "Created #{Category.count} categories"

# Artworks by Magaly Quirós Cruz (Maquiz)
Artwork.destroy_all


artworks = [
  {
    title: "En el bosque de la conciencia",
    description: "Acrílico sobre lienzo. DISPONIBLE. Una inmersión en la naturaleza y la conciencia, donde los colores vibrantes reflejan la energía del bosque.",
    image_filename: "maquiz-image1.jpg",
    category: "Acrílico",
    theme: "Espiritual",
    year: 2017
  },
  {
    title: "Remembranzas",
    description: "Acrílico sobre lienzo.",
    image_filename: "maquiz-image2.jpg",
    category: "Acrílico",
    theme: "Espiritual",
    year: 2017
  },
  {
    title: "Y aprenderás a volar",
    description: "Acrílico sobre lienzo, 93x 66.5 cms. DISPONIBLE. Obra expuesta en Isaac Barcat Art Gallery, explorando temas de crecimiento y transformación.",
    image_filename: "maquiz-image3.jpg",
    category: "Acrílico",
    theme: "Espiritual",
    year: 2017,
    for_sale: true,
    price: 2000.00
  },
  {
    title: "Vuela alto",
    description: "Acrílico sobre lienzo, 64x64cm. COLECCIÓN PRIVADA. Una representación de libertad y elevación espiritual.",
    image_filename: "maquz-image4.jpg",
    category: "Acrílico",
    theme: "Naturaleza",
    year: 2017,
    for_sale: true,
    price: 2000.00
  }
]

puts "Creating artworks..."
artworks.each do |artwork_data|
  image_filename = artwork_data.delete(:image_filename)
  artwork = Artwork.new(artwork_data)
  
  # Attach image before saving to pass validation
  if image_filename
    seeds_images_path = Rails.root.join('db', 'seeds', 'images')
    image_file = seeds_images_path.join(image_filename)
    
    if File.exist?(image_file)
      artwork.image.attach(
        io: File.open(image_file),
        filename: image_filename,
        content_type: "image/#{File.extname(image_filename)[1..-1]}"
      )
    end
  end
  
  if artwork.save
    print "Created: #{artwork.title}"
    if image_filename && File.exist?(seeds_images_path.join(image_filename))
      puts " ✓ Attached: #{image_filename}"
    else
      puts ""
    end
  else
    puts "Error creating #{artwork_data[:title]}: #{artwork.errors.full_messages.join(', ')}"
  end
end

puts "Created #{Artwork.count} artworks by Magaly Quirós Cruz (Maquiz)"

# Create admin user
# Credentials can come from:
# 1. Environment variables (for Railway/production) - ADMIN_EMAIL, ADMIN_PASSWORD
# 2. seeds_credentials.rb file (for local development) - ADMIN_CREDENTIALS hash
Admin.destroy_all

admin_email = nil
admin_password = nil

# Try environment variables first (for Railway/production)
if ENV['ADMIN_EMAIL'].present? && ENV['ADMIN_PASSWORD'].present?
  admin_email = ENV['ADMIN_EMAIL']
  admin_password = ENV['ADMIN_PASSWORD']
  puts "Using credentials from environment variables"
# Fallback to local credentials file (for local development)
elsif File.exist?(Rails.root.join('db', 'seeds_credentials.rb'))
  begin
    require_relative 'seeds_credentials'
    if defined?(ADMIN_CREDENTIALS)
      admin_email = ADMIN_CREDENTIALS[:email]
      admin_password = ADMIN_CREDENTIALS[:password]
      puts "Using credentials from seeds_credentials.rb"
    end
  rescue LoadError, NameError => e
    puts "Warning: Could not load credentials from seeds_credentials.rb: #{e.message}"
  end
end

if admin_email && admin_password
  admin = Admin.create!(
    email: admin_email,
    password: admin_password,
    password_confirmation: admin_password
  )
  puts "Created admin user: #{admin.email}"
else
  puts "Warning: Admin credentials not found"
  puts "Skipping admin user creation."
  puts ""
  puts "For local development, create backend/db/seeds_credentials.rb:"
  puts "  ADMIN_CREDENTIALS = {"
  puts "    email: 'your-email@example.com',"
  puts "    password: 'your-password',"
  puts "    password_confirmation: 'your-password'"
  puts "  }"
  puts ""
  puts "For Railway/production, set environment variables:"
  puts "  ADMIN_EMAIL=your-email@example.com"
  puts "  ADMIN_PASSWORD=your-password"
end

# Portfolio Events
PortfolioEvent.destroy_all

puts "\nCreating portfolio events..."

# Individual Exhibitions
individual_exhibitions = [
  {
    year: 2017,
    translations: {
      'es' => { 'title' => 'Sistemas Galileo, Barreal de Heredia, Costa Rica' },
      'en' => { 'title' => 'Galileo Systems, Barreal de Heredia, Costa Rica' },
      'it' => { 'title' => 'Sistemi Galileo, Barreal de Heredia, Costa Rica' }
    },
    display_order: 0
  },
  {
    year: 2017,
    translations: {
      'es' => { 'title' => 'Galería de Arte Isaac Barcat, sala III' },
      'en' => { 'title' => 'Isaac Barcat Art Gallery, Room III' },
      'it' => { 'title' => 'Galleria d\'Arte Isaac Barcat, sala III' }
    },
    display_order: 1
  },
  {
    year: 2015,
    translations: {
      'es' => { 'title' => 'Casa Universitaria del Libro, UNAM. México DF Salón de los Vitrales' },
      'en' => { 'title' => 'University Book House, UNAM. Mexico DF Vitrales Hall' },
      'it' => { 'title' => 'Casa Universitaria del Libro, UNAM. Messico DF Salone dei Vitrali' }
    },
    display_order: 0
  },
  {
    year: 2013,
    translations: {
      'es' => { 'title' => 'Casona de Laly, Escazú' },
      'en' => { 'title' => 'Casona de Laly, Escazú' },
      'it' => { 'title' => 'Casona de Laly, Escazú' }
    },
    display_order: 0
  },
  {
    year: 2012,
    translations: {
      'es' => { 'title' => 'Escuela de Artes Musicales, Universidad de Costa Rica' },
      'en' => { 'title' => 'School of Musical Arts, University of Costa Rica' },
      'it' => { 'title' => 'Scuola di Arti Musicali, Università della Costa Rica' }
    },
    display_order: 0
  },
  {
    year: 2011,
    translations: {
      'es' => { 'title' => 'Correo Central, San José (20 nov.- 2 dic.)' },
      'en' => { 'title' => 'Central Post Office, San José (Nov 20 - Dec 2)' },
      'it' => { 'title' => 'Ufficio Postale Centrale, San José (20 nov - 2 dic)' }
    },
    display_order: 0
  },
  {
    year: 2010,
    translations: {
      'es' => { 'title' => 'Correo Central, San José (20 dic.- 7 enero)' },
      'en' => { 'title' => 'Central Post Office, San José (Dec 20 - Jan 7)' },
      'it' => { 'title' => 'Ufficio Postale Centrale, San José (20 dic - 7 gen)' }
    },
    display_order: 0
  }
]

# Duo Exhibitions
duo_exhibitions = [
  {
    year: 2019,
    translations: {
      'es' => { 'title' => 'Vicerrectoría de Acción Social Universidad de Costa Rica, San José, Costa Rica' },
      'en' => { 'title' => 'Vice-Rectorate of Social Action, University of Costa Rica, San José, Costa Rica' },
      'it' => { 'title' => 'Vice-Rettorato di Azione Sociale, Università della Costa Rica, San José, Costa Rica' }
    },
    display_order: 0
  },
  {
    year: 2018,
    translations: {
      'es' => { 'title' => 'Correo Central, San José, Costa Rica' },
      'en' => { 'title' => 'Central Post Office, San José, Costa Rica' },
      'it' => { 'title' => 'Ufficio Postale Centrale, San José, Costa Rica' }
    },
    display_order: 0
  },
  {
    year: 2015,
    translations: {
      'es' => { 'title' => 'Instituto de México, San Pedro. Pintura e inauguración y presentación del libro de poemas En las Mejillas del Tiempo' },
      'en' => { 'title' => 'Mexican Institute, San Pedro. Painting and inauguration and presentation of the poetry book En las Mejillas del Tiempo' },
      'it' => { 'title' => 'Istituto del Messico, San Pedro. Pittura e inaugurazione e presentazione del libro di poesie En las Mejillas del Tiempo' }
    },
    display_order: 0
  },
  {
    year: 2012,
    translations: {
      'es' => { 'title' => 'Casa Cultural La Guaricha, David, Chiriquí, Panamá' },
      'en' => { 'title' => 'La Guaricha Cultural House, David, Chiriquí, Panama' },
      'it' => { 'title' => 'Casa Culturale La Guaricha, David, Chiriquí, Panama' }
    },
    display_order: 0
  },
  {
    year: 2010,
    translations: {
      'es' => { 'title' => 'Hotel El Tirol (marzo-diciembre)' },
      'en' => { 'title' => 'Hotel El Tirol (March-December)' },
      'it' => { 'title' => 'Hotel El Tirol (marzo-dicembre)' }
    },
    display_order: 0
  },
  {
    year: 2009,
    translations: {
      'es' => { 'title' => 'Sistemas Galileo- Barreal de Heredia (diciembre)' },
      'en' => { 'title' => 'Galileo Systems - Barreal de Heredia (December)' },
      'it' => { 'title' => 'Sistemi Galileo - Barreal de Heredia (dicembre)' }
    },
    display_order: 0
  }
]

# Collective Exhibitions
collective_exhibitions = [
  {
    year: 2024,
    translations: {
      'es' => { 'title' => '2022-2024 Múltiples exposiciones digitales y presenciales en diversos países' },
      'en' => { 'title' => '2022-2024 Multiple digital and in-person exhibitions in various countries' },
      'it' => { 'title' => '2022-2024 Multiple mostre digitali e in presenza in vari paesi' }
    },
    display_order: 0
  },
  {
    year: 2021,
    translations: {
      'es' => { 'title' => '1ra Bienal Internacional de Arte Visual, Universidad de Panamá' },
      'en' => { 'title' => '1st International Visual Arts Biennial, University of Panama' },
      'it' => { 'title' => '1a Biennale Internazionale di Arte Visiva, Università di Panama' }
    },
    display_order: 0
  },
  {
    year: 2020,
    translations: {
      'es' => { 'title' => 'Dubai Print Festival, Museo de las Américas' },
      'en' => { 'title' => 'Dubai Print Festival, Museum of the Americas' },
      'it' => { 'title' => 'Dubai Print Festival, Museo delle Americhe' }
    },
    display_order: 0
  },
  {
    year: 2019,
    translations: {
      'es' => { 'title' => 'Exposición Internacional de Arte Contemporáneo, Festival de Arte, Plaza de la República, Roma, Italia' },
      'en' => { 'title' => 'International Contemporary Art Exhibition, Art Festival, Piazza della Repubblica, Rome, Italy' },
      'it' => { 'title' => 'Mostra Internazionale di Arte Contemporanea, Festival dell\'Arte, Piazza della Repubblica, Roma, Italia' }
    },
    display_order: 0
  },
  {
    year: 2019,
    translations: {
      'es' => { 'title' => 'Festival Intercultural Guayaquil Puerto de las Artes y las Culturas, Ecuador' },
      'en' => { 'title' => 'Guayaquil Intercultural Festival Port of Arts and Cultures, Ecuador' },
      'it' => { 'title' => 'Festival Interculturale Guayaquil Porto delle Arti e delle Culture, Ecuador' }
    },
    display_order: 1
  },
  {
    year: 2017,
    translations: {
      'es' => { 'title' => '2017-2024 Exposiciones internacionales con Mondial Art Academia (MAA) en Costa Rica, Colombia, España, Italia, Ecuador, Perú, Argentina, Suiza, Venezuela, Panamá, Turquía, India, Corea del Sur, Francia, Canadá, Cuba, Australia, Dinamarca' },
      'en' => { 'title' => '2017-2024 International exhibitions with Mondial Art Academia (MAA) in Costa Rica, Colombia, Spain, Italy, Ecuador, Peru, Argentina, Switzerland, Venezuela, Panama, Turkey, India, South Korea, France, Canada, Cuba, Australia, Denmark' },
      'it' => { 'title' => '2017-2024 Mostre internazionali con Mondial Art Academia (MAA) in Costa Rica, Colombia, Spagna, Italia, Ecuador, Perù, Argentina, Svizzera, Venezuela, Panama, Turchia, India, Corea del Sud, Francia, Canada, Cuba, Australia, Danimarca' }
    },
    display_order: 0
  },
  {
    year: 2002,
    translations: {
      'es' => { 'title' => '2002-2019 Múltiples exposiciones en Casa del Artista, FANAL, OUTLET MALL, y otros espacios en Costa Rica' },
      'en' => { 'title' => '2002-2019 Multiple exhibitions at Casa del Artista, FANAL, OUTLET MALL, and other spaces in Costa Rica' },
      'it' => { 'title' => '2002-2019 Multiple mostre a Casa del Artista, FANAL, OUTLET MALL, e altri spazi in Costa Rica' }
    },
    display_order: 0
  }
]

# Awards
awards = [
  {
    year: 2025,
    translations: {
      'es' => { 'title' => 'Reconocimiento al Mérito en Poesía y Crítica en Semiótica Estética por su valiosa obra "Un need inmaterial". Academia de arte y poesía ITALIA' },
      'en' => { 'title' => 'Recognition of Merit in Poetry and Criticism in Aesthetic Semiotics for her valuable work "Un need inmaterial". Academy of Art and Poetry ITALY' },
      'it' => { 'title' => 'Riconoscimento al Merito in Poesia e Critica in Semiotica Estetica per la sua preziosa opera "Un need inmaterial". Accademia di arte e poesia ITALIA' }
    },
    display_order: 0
  },
  {
    year: 2024,
    translations: {
      'es' => { 'title' => 'Premio a la Excelencia Creativa en Fundación Círculo de las Artes, Francia' },
      'en' => { 'title' => 'Creative Excellence Award at Circle of Arts Foundation, France' },
      'it' => { 'title' => 'Premio all\'Eccellenza Creativa alla Fondazione Cerchio delle Arti, Francia' }
    },
    display_order: 0
  },
  {
    year: 2023,
    translations: {
      'es' => { 'title' => 'Tercer lugar en poesía, en la Fundación Árboles y Vida, Heredia, Costa Rica' },
      'en' => { 'title' => 'Third place in poetry, at the Trees and Life Foundation, Heredia, Costa Rica' },
      'it' => { 'title' => 'Terzo posto in poesia, alla Fondazione Alberi e Vita, Heredia, Costa Rica' }
    },
    display_order: 0
  },
  {
    year: 2022,
    translations: {
      'es' => { 'title' => 'Certificado de Artista por el Museo de las Américas' },
      'en' => { 'title' => 'Artist Certificate by the Museum of the Americas' },
      'it' => { 'title' => 'Certificato di Artista dal Museo delle Americhe' }
    },
    display_order: 0
  },
  {
    year: 2022,
    translations: {
      'es' => { 'title' => 'Certificado de excelencia por ARTAVITA' },
      'en' => { 'title' => 'Certificate of Excellence by ARTAVITA' },
      'it' => { 'title' => 'Certificato di eccellenza da ARTAVITA' }
    },
    display_order: 1
  },
  {
    year: 2022,
    translations: {
      'es' => { 'title' => 'Certificado de excelencia en el Premio de Arte Global Dr. Mostafa Sadek II. Egipto' },
      'en' => { 'title' => 'Certificate of Excellence in the Dr. Mostafa Sadek II Global Art Award. Egypt' },
      'it' => { 'title' => 'Certificato di eccellenza al Premio d\'Arte Globale Dr. Mostafa Sadek II. Egitto' }
    },
    display_order: 2
  },
  {
    year: 2020,
    translations: {
      'es' => { 'title' => 'Premio Internacional FRIDA KAHLO, curadores Francesco y Salvatore Russo. Italia' },
      'en' => { 'title' => 'International FRIDA KAHLO Award, curators Francesco and Salvatore Russo. Italy' },
      'it' => { 'title' => 'Premio Internazionale FRIDA KAHLO, curatori Francesco e Salvatore Russo. Italia' }
    },
    display_order: 0
  },
  {
    year: 2020,
    translations: {
      'es' => { 'title' => 'Certificado de excelencia 2020 otorgado por ARTAVITA. EE. UU.' },
      'en' => { 'title' => 'Certificate of Excellence 2020 awarded by ARTAVITA. USA' },
      'it' => { 'title' => 'Certificato di eccellenza 2020 assegnato da ARTAVITA. USA' }
    },
    display_order: 1
  },
  {
    year: 2019,
    translations: {
      'es' => { 'title' => 'Participación de 668 artistas a nivel mundial, en la tercera edición de la elección El Artista del año 2019' },
      'en' => { 'title' => 'Participation of 668 artists worldwide, in the third edition of the Artist of the Year 2019 selection' },
      'it' => { 'title' => 'Partecipazione di 668 artisti a livello mondiale, nella terza edizione della selezione L\'Artista dell\'anno 2019' }
    },
    display_order: 0
  },
  {
    year: 2020,
    translations: {
      'es' => { 'title' => 'Mención Honorífica 2020. Premio otorgado por FUNDACIÓN CIRCLE PARA LAS ARTES, otorgado en FRANCIA, por el cuadro "El Péndulo del Tiempo"' },
      'en' => { 'title' => 'Honorary Mention 2020. Award granted by CIRCLE FOUNDATION FOR THE ARTS, awarded in FRANCE, for the painting "The Pendulum of Time"' },
      'it' => { 'title' => 'Menzione d\'Onore 2020. Premio assegnato dalla FONDAZIONE CERCHIO PER LE ARTI, assegnato in FRANCIA, per il dipinto "Il Pendolo del Tempo"' }
    },
    display_order: 2
  }
]

# Publications
publications = [
  {
    year: 2025,
    translations: {
      'es' => { 'title' => 'Publicación del libro de poesía: OTRA VEZ, VOLVIÓ A AManecer' },
      'en' => { 'title' => 'Publication of the poetry book: OTRA VEZ, VOLVIÓ A AManecer' },
      'it' => { 'title' => 'Pubblicazione del libro di poesie: OTRA VEZ, VOLVIÓ A AManecer' }
    },
    display_order: 0
  },
  {
    year: 2021,
    translations: {
      'es' => { 'title' => '2021-2022 Múltiples ediciones de la revista digital Fusion Art World ACAM' },
      'en' => { 'title' => '2021-2022 Multiple editions of the digital magazine Fusion Art World ACAM' },
      'it' => { 'title' => '2021-2022 Multiple edizioni della rivista digitale Fusion Art World ACAM' }
    },
    display_order: 0
  },
  {
    year: 2021,
    translations: {
      'es' => { 'title' => 'Cuando la luna nos ve. Antología de poetas' },
      'en' => { 'title' => 'When the moon sees us. Poets anthology' },
      'it' => { 'title' => 'Quando la luna ci vede. Antologia di poeti' }
    },
    display_order: 1
  },
  {
    year: 2017,
    translations: {
      'es' => { 'title' => '2017-2018 Libro Mondial Art Academia' },
      'en' => { 'title' => '2017-2018 Mondial Art Academia Book' },
      'it' => { 'title' => '2017-2018 Libro Mondial Art Academia' }
    },
    display_order: 0
  },
  {
    year: 2015,
    translations: {
      'es' => { 'title' => 'Libro En las Mejillas del Tiempo, libro de poesía' },
      'en' => { 'title' => 'Book En las Mejillas del Tiempo, poetry book' },
      'it' => { 'title' => 'Libro En las Mejillas del Tiempo, libro di poesie' }
    },
    display_order: 0
  }
]

# Create Individual Exhibitions
individual_exhibitions.each do |event_data|
  event = PortfolioEvent.create!(
    event_type: 'exhibition_individual',
    title: event_data[:translations]['es']['title'],
    year: event_data[:year],
    display_order: event_data[:display_order],
    translations: event_data[:translations]
  )
  puts "Created individual exhibition: #{event.title}"
end

# Create Duo Exhibitions
duo_exhibitions.each do |event_data|
  event = PortfolioEvent.create!(
    event_type: 'exhibition_duo',
    title: event_data[:translations]['es']['title'],
    year: event_data[:year],
    display_order: event_data[:display_order],
    translations: event_data[:translations]
  )
  puts "Created duo exhibition: #{event.title}"
end

# Create Collective Exhibitions
collective_exhibitions.each do |event_data|
  event = PortfolioEvent.create!(
    event_type: 'exhibition_collective',
    title: event_data[:translations]['es']['title'],
    year: event_data[:year],
    display_order: event_data[:display_order],
    translations: event_data[:translations]
  )
  puts "Created collective exhibition: #{event.title}"
end

# Create Awards
awards.each do |event_data|
  event = PortfolioEvent.create!(
    event_type: 'award',
    title: event_data[:translations]['es']['title'],
    year: event_data[:year],
    display_order: event_data[:display_order],
    translations: event_data[:translations]
  )
  puts "Created award: #{event.title}"
end

# Create Publications
publications.each do |event_data|
  event = PortfolioEvent.create!(
    event_type: 'publication',
    title: event_data[:translations]['es']['title'],
    year: event_data[:year],
    display_order: event_data[:display_order],
    translations: event_data[:translations]
  )
  puts "Created publication: #{event.title}"
end

puts "\nCreated #{PortfolioEvent.count} portfolio events"

# Site Texts - Import from translation files
SiteText.destroy_all

puts "\nCreating site texts..."

# Translation data from frontend files
translations_data = {
  'es' => {
    'nav.home' => 'Inicio',
    'nav.gallery' => 'Galería',
    'nav.products' => 'Productos',
    'nav.about' => 'Acerca de',
    'nav.contact' => 'Contacto',
    'home.heroTitle' => 'Bienvenido a Mi Arte',
    'home.heroSubtitle' => 'Explorando la belleza del color, la forma y la emoción a través de la expresión artística',
    'home.featuredWorks' => 'Obras Destacadas',
    'home.aboutTitle' => 'Acerca de la Artista',
    'home.aboutText' => 'Bienvenido a mi mundo creativo. Soy Magaly Quirós Cruz, una artista que trabaja bajo el nombre artístico Maquiz. Me apasiona capturar momentos, emociones e historias a través de mi arte. Cada pieza es un viaje hacia el color, la textura y la imaginación, creada con acrílico sobre lienzo. Mi trabajo ha sido expuesto en galerías de Costa Rica, Italia, España, México, Panamá.',
    'home.quote' => '¡La esencia gravitacional del universo! Aprendiendo a extraerla, lograremos encontrar la paz en todo lo que hacemos. Dios es la fuerza que sostiene al mundo; a través de su amor infinito!',
    'home.footer' => '© 2025 Maquiz. Todos los derechos reservados.',
    'gallery.title' => 'Galería',
    'gallery.subtitle' => 'Explora la colección completa de obras',
    'gallery.allCategories' => 'Todas las Categorías',
    'gallery.forSale' => 'En Venta',
    'gallery.noArtworks' => 'No se encontraron obras',
    'about.title' => 'Acerca de la Artista',
    'about.artisticName' => 'Nombre Artístico',
    'about.birthdate' => 'Fecha de Nacimiento',
    'about.country' => 'País',
    'about.technique' => 'Medio(s) Utilizado(s)',
    'about.location' => 'Ubicación',
    'about.contact' => 'Contacto',
    'about.email' => 'Correo Electrónico',
    'about.phone' => 'Teléfono',
    'about.exhibitions' => 'Exposiciones',
    'about.individual' => 'Exposiciones Individuales',
    'about.duo' => 'Exposiciones a Dúo',
    'about.collective' => 'Exposiciones Colectivas',
    'about.awards' => 'Recompensas y Premios',
    'about.publications' => 'Publicaciones',
    'about.upcoming' => 'Próximos Eventos',
    'about.philosophy' => 'Filosofía Artística',
    'contact.title' => 'Contacto',
    'contact.subtitle' => 'Ponte en contacto con la artista',
    'contact.getInTouch' => 'Ponte en Contacto',
    'contact.infoText' => 'Me encantaría saber de ti. Ya sea que estés interesado en comprar una obra, encargar una pieza personalizada o simplemente quieras conectarte, no dudes en contactarme.',
    'contact.email' => 'Correo Electrónico',
    'contact.location' => 'Ubicación',
    'contact.follow' => 'Sigue Mi Trabajo',
    'contact.name' => 'Nombre',
    'contact.subject' => 'Asunto',
    'contact.message' => 'Mensaje',
    'contact.send' => 'Enviar Mensaje',
    'contact.successMessage' => '¡Gracias! Tu mensaje ha sido enviado exitosamente.',
    'products.title' => 'Obras en Venta',
    'products.subtitle' => 'Descubre las piezas disponibles de la colección',
    'products.forSale' => 'En Venta',
    'products.price' => 'Precio',
    'products.inquire' => 'Consultar Sobre Esta Pieza',
    'products.noProducts' => 'Actualmente no hay obras disponibles para la venta. Por favor, vuelve a consultar más tarde o contáctanos para más información.',
    'products.note' => 'Para consultas sobre la compra de obras o encargar una pieza personalizada, por favor usa el formulario de contacto o envía un correo directamente. Todos los precios están sujetos a disponibilidad.',
    'artist.name' => 'Magaly Quirós Cruz',
    'artist.artisticName' => 'MAQUIZ',
    'artist.birthdate' => '27 de diciembre de 1969',
    'artist.country' => 'Costa Rica',
    'artist.email' => 'maquizcr@gmail.com',
    'artist.phone' => '83564418',
    'artist.technique' => 'Acrílico, mosaico, pintura al óleo',
    'artist.location' => 'San José, Costa Rica',
    'artist.bio' => 'Mujer, madre, artista y poeta, muchas facetas se mueven diariamente en mi vida y en mi hogar, cuyas vivencias se enriquecen al calor y el color del arte. Soy artista plástica y poeta costarricense. He expuesto dentro y fuera del país mi arte y mi poesía: en Panamá, México, España, Colombia, Argentina, Perú, Ecuador, Canadá, Italia, Suecia, Suiza, Austria, Dubai, Venezuela, India, Turquía, Seúl, Australia, Dinamarca, Francia, Cuba, entre otros. Soy miembro de la Asociación Cultural Antonio Montes de Málaga, España. Delegada y Dama Académica de Mondial Art Academia, Francia. Artista Certificada del Museo de las Américas, USA. He publicado dos libros de poesía: En las Mejillas del Tiempo y Otra vez, volvió a amanecer. Mi técnica favorita es el acrílico sobre lienzo, poseo dos estilos: las vasijas humanizadas en las que plasmo mis sentimientos llenos de poesía y los animales desestructurados donde el mensaje principal es buscar y conservar la esencia a pesar de las vicisitudes de la vida.',
    'artist.quote' => 'En la vida vamos surcando vivencias con matices, a veces dolorosos, otras veces tan cálidos y dulces que nos acompañan y abrigan para siempre en cada noche fría, en forma de recuerdos y en dulces melodías.',
    'artist.artisticFocus.title' => 'Enfoque Artístico',
    'artist.artisticFocus.style1.title' => 'Estilos Intermedios 1',
    'artist.artisticFocus.style1.description' => 'Pinto la naturaleza de un camino diferente, desfragmentado y libre, estilizando sus formas e invitando a este camino a romper paradigmas y programas, sin perder la esencia de lo que realmente somos, y un mensaje que esperamos; para que sopesemos todas nuestras vidas, siempre seamos felices.',
    'artist.artisticFocus.style2.title' => 'Estilos Intermedios 2',
    'artist.artisticFocus.style2.description' => 'Pinto los sentimientos a través de las formas de mes vasijas humanizadas, son acrílicos cargados de texturas y de poesía, con un sentimiento explícito que habla, en silencio, con sus formas y colores al espectador.',
    'artist.artisticFocus.style3.title' => 'Fauna Desestructurada',
    'artist.artisticFocus.style3.description' => 'Uno de los estilos que comparto es el de los motivos de la fauna en su mayoría costarricense, en forma desestructurada, en el que el mensaje viene oculto en una especie de rompecabezas, donde cada quien con su propia imaginación descubre todo aquello que desee encontrar, invitando de esta manera a romper paradigmas y programaciones, sin perder la esencia de lo que realmente somos. Son obras en acrílico, cargadas de texturas y de poesía, con un sentimiento explícito que habla, en silencio, con sus formas y colores.',
    'footer.copyright' => '© 2024 Maquiz. Todos los derechos reservados.',
    'footer.tagline' => 'Explorando la esencia del universo a través del arte',
    'footer.quickLinks' => 'Enlaces Rápidos',
    'footer.followUs' => 'Síguenos',
    'footer.adminLogin' => 'Acceso de Administrador',
    'admin.loginTitle' => 'Acceso de Administrador',
    'admin.loginSubtitle' => 'Accede al panel de administración para gestionar tu sitio web',
    'admin.email' => 'Correo Electrónico',
    'admin.password' => 'Contraseña',
    'admin.login' => 'Iniciar Sesión',
    'admin.backToSite' => '← Volver al Sitio',
    'admin.dashboard' => 'Panel de Administración',
    'admin.logout' => 'Cerrar Sesión',
    'admin.artworks' => 'Obras',
    'admin.texts' => 'Textos',
    'admin.carousel' => 'Carrusel',
    'admin.manageArtworks' => 'Gestionar Obras',
    'admin.manageTexts' => 'Gestionar Textos',
    'admin.manageCarousel' => 'Gestionar Carrusel',
    'admin.addArtwork' => 'Agregar Obra'
  },
  'en' => {
    'nav.home' => 'Home',
    'nav.gallery' => 'Gallery',
    'nav.products' => 'Products',
    'nav.about' => 'About',
    'nav.contact' => 'Contact',
    'home.heroTitle' => 'Welcome to My Art',
    'home.heroSubtitle' => 'Exploring the beauty of color, form, and emotion through artistic expression',
    'home.featuredWorks' => 'Featured Works',
    'home.aboutTitle' => 'About the Artist',
    'home.aboutText' => 'Welcome to my creative world. I am Magaly Quirós Cruz, an artist working under the artistic name Maquiz. I am passionate about capturing moments, emotions, and stories through my art. Each piece is a journey into color, texture, and imagination, created with acrylic on canvas. My work has been exhibited in galleries in Costa Rica, Italy, Spain, Mexico, Panama.',
    'home.quote' => 'The essence of the gravitational universe! Learning to extract it, we will achieve peace in everything we do. God is the force that sustains the world; through his infinite love!',
    'home.footer' => '© 2025 Maquiz. All rights reserved.',
    'gallery.title' => 'Gallery',
    'gallery.subtitle' => 'Explore the complete collection of artworks',
    'gallery.allCategories' => 'All Categories',
    'gallery.forSale' => 'For Sale',
    'gallery.noArtworks' => 'No artworks found',
    'about.title' => 'About the Artist',
    'about.artisticName' => 'Artistic Name',
    'about.birthdate' => 'Date of Birth',
    'about.country' => 'Country',
    'about.technique' => 'Medium(s) Used',
    'about.location' => 'Location',
    'about.contact' => 'Contact',
    'about.email' => 'Email',
    'about.phone' => 'Phone',
    'about.exhibitions' => 'Exhibitions',
    'about.individual' => 'Solo Exhibitions',
    'about.duo' => 'Duo Exhibitions',
    'about.collective' => 'Collective Exhibitions',
    'about.awards' => 'Awards and Recognition',
    'about.publications' => 'Publications',
    'about.upcoming' => 'Upcoming Events',
    'about.philosophy' => 'Artistic Philosophy',
    'contact.title' => 'Contact',
    'contact.subtitle' => 'Get in touch with the artist',
    'contact.getInTouch' => 'Get in Touch',
    'contact.infoText' => 'I would love to hear from you. Whether you are interested in purchasing artwork, commissioning a piece, or simply want to connect, feel free to reach out.',
    'contact.email' => 'Email',
    'contact.location' => 'Location',
    'contact.follow' => 'Follow My Work',
    'contact.name' => 'Name',
    'contact.subject' => 'Subject',
    'contact.message' => 'Message',
    'contact.send' => 'Send Message',
    'contact.successMessage' => 'Thank you! Your message has been sent successfully.',
    'products.title' => 'Artworks for Sale',
    'products.subtitle' => 'Discover available pieces from the collection',
    'products.forSale' => 'For Sale',
    'products.price' => 'Price',
    'products.inquire' => 'Inquire About This Piece',
    'products.noProducts' => 'Currently, there are no artworks available for sale. Please check back later or contact us for more information.',
    'products.note' => 'For inquiries about purchasing artwork or commissioning a custom piece, please use the contact form or email directly. All prices are subject to availability.',
    'artist.name' => 'Magaly Quirós Cruz',
    'artist.artisticName' => 'MAQUIZ',
    'artist.birthdate' => 'December 27, 1969',
    'artist.country' => 'Costa Rica',
    'artist.email' => 'maquizcr@gmail.com',
    'artist.phone' => '83564418',
    'artist.technique' => 'Acrylic, mosaic, oil painting',
    'artist.location' => 'San José, Costa Rica',
    'artist.bio' => 'Woman, mother, artist and poet, many facets move daily in my life and home, whose experiences are enriched by the warmth and color of art. I am a Costa Rican visual artist and poet. I have exhibited my art and poetry both within and outside the country: in Panama, Mexico, Spain, Colombia, Argentina, Peru, Ecuador, Canada, Italy, Sweden, Switzerland, Austria, Dubai, Venezuela, India, Turkey, Seoul, Australia, Denmark, France, Cuba, among others. I am a member of the Antonio Montes Cultural Association of Málaga, Spain. Delegate and Academic Lady of Mondial Art Academia, France. Certified Artist of the Museum of the Americas, USA. I have published two poetry books: En las Mejillas del Tiempo and Otra vez, volvió a amanecer. My favorite technique is acrylic on canvas, and I have two styles: humanized vessels in which I express my feelings full of poetry, and deconstructed animals where the main message is to seek and preserve essence despite life\'s vicissitudes.',
    'artist.quote' => 'In life we live with things, with pain, with other things, with warmth and sweetness. Emotional color arises spontaneously in our new palette diary.',
    'artist.artisticFocus.title' => 'Artistic Focus',
    'artist.artisticFocus.style1.title' => 'Intermediate Styles 1',
    'artist.artisticFocus.style1.description' => 'I paint nature from a different, fragmented and free path, stylizing its forms and inviting this path to break paradigms and programs, without losing the essence of what we really are, and a message we hope for; so that we weigh all our lives, we are always happy.',
    'artist.artisticFocus.style2.title' => 'Intermediate Styles 2',
    'artist.artisticFocus.style2.description' => 'I paint feelings through the forms of humanized vessels, they are acrylics loaded with textures and poetry, with an explicit feeling that speaks, in silence, with its forms and colors to the viewer.',
    'artist.artisticFocus.style3.title' => 'Deconstructed Fauna',
    'artist.artisticFocus.style3.description' => 'One of the styles I share is that of motifs of fauna, mostly Costa Rican, in deconstructed form, in which the message comes hidden in a kind of puzzle, where each person with their own imagination discovers everything they wish to find, thus inviting us to break paradigms and programming, without losing the essence of what we really are. These are acrylic works, loaded with textures and poetry, with an explicit feeling that speaks, in silence, with their forms and colors.',
    'footer.copyright' => '© 2024 Maquiz. All rights reserved.',
    'footer.tagline' => 'Exploring the essence of the universe through art',
    'footer.quickLinks' => 'Quick Links',
    'footer.followUs' => 'Follow Us',
    'footer.adminLogin' => 'Admin Login',
    'admin.loginTitle' => 'Admin Login',
    'admin.loginSubtitle' => 'Access the admin dashboard to manage your website',
    'admin.email' => 'Email',
    'admin.password' => 'Password',
    'admin.login' => 'Login',
    'admin.backToSite' => '← Back to Site',
    'admin.dashboard' => 'Admin Dashboard',
    'admin.logout' => 'Logout',
    'admin.artworks' => 'Artworks',
    'admin.texts' => 'Texts',
    'admin.carousel' => 'Carousel',
    'admin.manageArtworks' => 'Manage Artworks',
    'admin.manageTexts' => 'Manage Texts',
    'admin.manageCarousel' => 'Manage Carousel',
    'admin.addArtwork' => 'Add Artwork'
  },
  'it' => {
    'nav.home' => 'Home',
    'nav.gallery' => 'Galleria',
    'nav.products' => 'Prodotti',
    'nav.about' => 'Chi Sono',
    'nav.contact' => 'Contatto',
    'home.heroTitle' => 'Benvenuto nella Mia Arte',
    'home.heroSubtitle' => 'Esplorando la bellezza del colore, della forma e dell\'emozione attraverso l\'espressione artistica',
    'home.featuredWorks' => 'Opere in Evidenza',
    'home.aboutTitle' => 'Sull\'Artista',
    'home.aboutText' => 'Benvenuto nel mio mondo creativo. Sono Magaly Quirós Cruz, un\'artista che lavora con il nome artistico Maquiz. Sono appassionata di catturare momenti, emozioni e storie attraverso la mia arte. Ogni pezzo è un viaggio nel colore, nella texture e nell\'immaginazione, creato con acrilico su tela. Il mio lavoro è stato esposto in gallerie in Costa Rica, Italia, Spagna, Messico, Panama.',
    'home.quote' => 'L\'essenza gravitazionale dell\'universo! Imparando ad estrarla, raggiungeremo la pace in tutto ciò che facciamo. Dio è la forza che sostiene il mondo; attraverso il suo amore infinito!',
    'home.footer' => '© 2025 Maquiz. Tutti i diritti riservati.',
    'gallery.title' => 'Galleria',
    'gallery.subtitle' => 'Esplora la collezione completa di opere',
    'gallery.allCategories' => 'Tutte le Categorie',
    'gallery.forSale' => 'In Vendita',
    'gallery.noArtworks' => 'Nessuna opera trovata',
    'about.title' => 'Sull\'Artista',
    'about.artisticName' => 'Nome Artistico',
    'about.birthdate' => 'Data di Nascita',
    'about.country' => 'Paese',
    'about.technique' => 'Mezzo/i Utilizzato/i',
    'about.location' => 'Posizione',
    'about.contact' => 'Contatto',
    'about.email' => 'Email',
    'about.phone' => 'Telefono',
    'about.exhibitions' => 'Mostre',
    'about.individual' => 'Mostre Individuali',
    'about.duo' => 'Mostre a Due',
    'about.collective' => 'Mostre Collettive',
    'about.awards' => 'Premi e Riconoscimenti',
    'about.publications' => 'Pubblicazioni',
    'about.upcoming' => 'Prossimi Eventi',
    'about.philosophy' => 'Filosofia Artistica',
    'contact.title' => 'Contatto',
    'contact.subtitle' => 'Mettiti in contatto con l\'artista',
    'contact.getInTouch' => 'Mettiti in Contatto',
    'contact.infoText' => 'Mi piacerebbe sentirti. Che tu sia interessato all\'acquisto di un\'opera, alla commissione di un pezzo personalizzato o semplicemente voglia connetterti, non esitare a contattarmi.',
    'contact.email' => 'Email',
    'contact.location' => 'Posizione',
    'contact.follow' => 'Segui Il Mio Lavoro',
    'contact.name' => 'Nome',
    'contact.subject' => 'Oggetto',
    'contact.message' => 'Messaggio',
    'contact.send' => 'Invia Messaggio',
    'contact.successMessage' => 'Grazie! Il tuo messaggio è stato inviato con successo.',
    'products.title' => 'Opere in Vendita',
    'products.subtitle' => 'Scopri i pezzi disponibili della collezione',
    'products.forSale' => 'In Vendita',
    'products.price' => 'Prezzo',
    'products.inquire' => 'Chiedi Informazioni Su Questo Pezzo',
    'products.noProducts' => 'Attualmente non ci sono opere disponibili per la vendita. Si prega di controllare più tardi o contattarci per maggiori informazioni.',
    'products.note' => 'Per richieste sull\'acquisto di opere o per commissionare un pezzo personalizzato, si prega di utilizzare il modulo di contatto o inviare un\'email direttamente. Tutti i prezzi sono soggetti a disponibilità.',
    'artist.name' => 'Magaly Quirós Cruz',
    'artist.artisticName' => 'MAQUIZ',
    'artist.birthdate' => '27 dicembre 1969',
    'artist.country' => 'Costa Rica',
    'artist.email' => 'maquizcr@gmail.com',
    'artist.phone' => '83564418',
    'artist.technique' => 'Acrilico, mosaico, pittura ad olio',
    'artist.location' => 'San José, Costa Rica',
    'artist.bio' => 'Donna, madre, artista e poetessa, molte sfaccettature si muovono quotidianamente nella mia vita e nella mia casa, le cui esperienze si arricchiscono al calore e al colore dell\'arte. Sono artista visiva e poetessa costaricana. Ho esposto dentro e fuori dal paese la mia arte e la mia poesia: a Panama, Messico, Spagna, Colombia, Argentina, Perù, Ecuador, Canada, Italia, Svezia, Svizzera, Austria, Dubai, Venezuela, India, Turchia, Seul, Australia, Danimarca, Francia, Cuba, tra gli altri. Sono membro dell\'Associazione Culturale Antonio Montes di Málaga, Spagna. Delegata e Dama Accademica di Mondial Art Academia, Francia. Artista Certificata del Museo delle Americhe, USA. Ho pubblicato due libri di poesia: En las Mejillas del Tiempo e Otra vez, volvió a amanecer. La mia tecnica preferita è l\'acrilico su tela, possiedo due stili: i vasi umanizzati in cui plasmo i miei sentimenti pieni di poesia e gli animali destrutturati dove il messaggio principale è cercare e conservare l\'essenza nonostante le vicissitudini della vita.',
    'artist.quote' => 'Nella vita viviamo con cose, con dolore, con altre cose, con calore e dolcezza. Il colore emotivo sorge spontaneamente nel nostro nuovo diario della tavolozza.',
    'artist.artisticFocus.title' => 'Focus Artistico',
    'artist.artisticFocus.style1.title' => 'Stili Intermedi 1',
    'artist.artisticFocus.style1.description' => 'Dipingo la natura da un percorso diverso, frammentato e libero, stilizzando le sue forme e invitando questo percorso a rompere paradigmi e programmi, senza perdere l\'essenza di ciò che siamo veramente, e un messaggio che speriamo; così che pesiamo tutte le nostre vite, siamo sempre felici.',
    'artist.artisticFocus.style2.title' => 'Stili Intermedi 2',
    'artist.artisticFocus.style2.description' => 'Dipingo i sentimenti attraverso le forme di vasi umanizzati, sono acrilici carichi di texture e poesia, con un sentimento esplicito che parla, in silenzio, con le sue forme e colori allo spettatore.',
    'artist.artisticFocus.style3.title' => 'Fauna Destrutturata',
    'artist.artisticFocus.style3.description' => 'Uno degli stili che condivido è quello dei motivi della fauna, per lo più costaricana, in forma destrutturata, in cui il messaggio arriva nascosto in una sorta di puzzle, dove ognuno con la propria immaginazione scopre tutto ciò che desidera trovare, invitando così a rompere paradigmi e programmazioni, senza perdere l\'essenza di ciò che siamo veramente. Sono opere in acrilico, cariche di texture e poesia, con un sentimento esplicito che parla, in silenzio, con le loro forme e colori.',
    'footer.copyright' => '© 2024 Maquiz. Tutti i diritti riservati.',
    'footer.tagline' => 'Esplorando l\'essenza dell\'universo attraverso l\'arte',
    'footer.quickLinks' => 'Link Rapidi',
    'footer.followUs' => 'Seguici',
    'footer.adminLogin' => 'Accesso Amministratore',
    'admin.loginTitle' => 'Accesso Amministratore',
    'admin.loginSubtitle' => 'Accedi alla dashboard di amministrazione per gestire il tuo sito web',
    'admin.email' => 'Email',
    'admin.password' => 'Password',
    'admin.login' => 'Accedi',
    'admin.backToSite' => '← Torna al Sito',
    'admin.dashboard' => 'Dashboard Amministratore',
    'admin.logout' => 'Esci',
    'admin.artworks' => 'Opere',
    'admin.texts' => 'Testi',
    'admin.carousel' => 'Carosello',
    'admin.manageArtworks' => 'Gestisci Opere',
    'admin.manageTexts' => 'Gestisci Testi',
    'admin.manageCarousel' => 'Gestisci Carosello',
    'admin.addArtwork' => 'Aggiungi Opera'
  }
}

# Get all unique keys
all_keys = translations_data['es'].keys

# Create descriptions for better admin UX
descriptions = {
  'nav.home' => 'Navigation - Home link',
  'nav.gallery' => 'Navigation - Gallery link',
  'nav.products' => 'Navigation - Products link',
  'nav.about' => 'Navigation - About link',
  'nav.contact' => 'Navigation - Contact link',
  'home.heroTitle' => 'Home page - Hero section title',
  'home.heroSubtitle' => 'Home page - Hero section subtitle',
  'home.featuredWorks' => 'Home page - Featured works section title',
  'home.aboutTitle' => 'Home page - About section title',
  'home.aboutText' => 'Home page - About section text',
  'home.quote' => 'Home page - Artist quote',
  'home.footer' => 'Home page - Footer copyright text',
  'gallery.title' => 'Gallery page - Title',
  'gallery.subtitle' => 'Gallery page - Subtitle',
  'gallery.allCategories' => 'Gallery page - All categories filter',
  'gallery.forSale' => 'Gallery page - For sale badge',
  'gallery.noArtworks' => 'Gallery page - No artworks message',
  'about.title' => 'About page - Title',
  'about.artisticName' => 'About page - Artistic name label',
  'about.birthdate' => 'About page - Birthdate label',
  'about.country' => 'About page - Country label',
  'about.technique' => 'About page - Technique label',
  'about.location' => 'About page - Location label',
  'about.contact' => 'About page - Contact label',
  'about.email' => 'About page - Email label',
  'about.phone' => 'About page - Phone label',
  'about.exhibitions' => 'About page - Exhibitions section',
  'about.individual' => 'About page - Individual exhibitions label',
  'about.duo' => 'About page - Duo exhibitions label',
  'about.collective' => 'About page - Collective exhibitions label',
  'about.awards' => 'About page - Awards section',
  'about.publications' => 'About page - Publications section',
  'about.upcoming' => 'About page - Upcoming events section',
  'about.philosophy' => 'About page - Philosophy section',
  'contact.title' => 'Contact page - Title',
  'contact.subtitle' => 'Contact page - Subtitle',
  'contact.getInTouch' => 'Contact page - Get in touch heading',
  'contact.infoText' => 'Contact page - Info text',
  'contact.email' => 'Contact page - Email label',
  'contact.location' => 'Contact page - Location label',
  'contact.follow' => 'Contact page - Follow heading',
  'contact.name' => 'Contact page - Name field label',
  'contact.subject' => 'Contact page - Subject field label',
  'contact.message' => 'Contact page - Message field label',
  'contact.send' => 'Contact page - Send button',
  'contact.successMessage' => 'Contact page - Success message',
  'products.title' => 'Products page - Title',
  'products.subtitle' => 'Products page - Subtitle',
  'products.forSale' => 'Products page - For sale badge',
  'products.price' => 'Products page - Price label',
  'products.inquire' => 'Products page - Inquire button',
  'products.noProducts' => 'Products page - No products message',
  'products.note' => 'Products page - Note text',
  'artist.name' => 'Artist - Full name',
  'artist.artisticName' => 'Artist - Artistic name',
  'artist.birthdate' => 'Artist - Birthdate',
  'artist.country' => 'Artist - Country',
  'artist.email' => 'Artist - Email',
  'artist.phone' => 'Artist - Phone',
  'artist.technique' => 'Artist - Technique',
  'artist.location' => 'Artist - Location',
  'artist.bio' => 'Artist - Biography',
  'artist.quote' => 'Artist - Quote',
  'artist.artisticFocus.title' => 'Artist - Artistic focus section title',
  'artist.artisticFocus.style1.title' => 'Artist - Style 1 title',
  'artist.artisticFocus.style1.description' => 'Artist - Style 1 description',
  'artist.artisticFocus.style2.title' => 'Artist - Style 2 title',
  'artist.artisticFocus.style2.description' => 'Artist - Style 2 description',
  'artist.artisticFocus.style3.title' => 'Artist - Style 3 title',
  'artist.artisticFocus.style3.description' => 'Artist - Style 3 description',
  'footer.copyright' => 'Footer - Copyright text',
  'footer.tagline' => 'Footer - Tagline',
  'footer.quickLinks' => 'Footer - Quick links heading',
  'footer.followUs' => 'Footer - Follow us heading',
  'footer.adminLogin' => 'Footer - Admin login link',
  'admin.loginTitle' => 'Admin - Login page title',
  'admin.loginSubtitle' => 'Admin - Login page subtitle',
  'admin.email' => 'Admin - Email field label',
  'admin.password' => 'Admin - Password field label',
  'admin.login' => 'Admin - Login button',
  'admin.backToSite' => 'Admin - Back to site link',
  'admin.dashboard' => 'Admin - Dashboard title',
  'admin.logout' => 'Admin - Logout button',
  'admin.artworks' => 'Admin - Artworks tab',
  'admin.texts' => 'Admin - Texts tab',
  'admin.carousel' => 'Admin - Carousel tab',
  'admin.manageArtworks' => 'Admin - Manage artworks heading',
  'admin.manageTexts' => 'Admin - Manage texts heading',
  'admin.manageCarousel' => 'Admin - Manage carousel heading',
  'admin.addArtwork' => 'Admin - Add artwork button'
}

# Create site texts
all_keys.each do |key|
  translations_hash = {
    'es' => translations_data['es'][key],
    'en' => translations_data['en'][key],
    'it' => translations_data['it'][key]
  }
  
  SiteText.create!(
    key: key,
    description: descriptions[key] || "Text for #{key}",
    translations: translations_hash
  )
  
  puts "Created text: #{key}"
end

puts "\nCreated #{SiteText.count} site texts"

