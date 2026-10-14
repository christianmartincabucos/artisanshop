/* Demo catalogue for the ArtisanShop reconstruction.
   Product photos use <img> elements with data-fallback for graceful degradation.
   Images sourced from public CDNs; local fallback: assets/images/product-placeholder.png.
*/
window.PRODUCTS = [
  {
    id: 'pump',
    name: 'Ablaufpumpe für Waschmaschinen',
    brand: 'Universal',
    sku: '00644956',
    price: 48.90,
    category: 'Waschmaschine',
    description: 'Hochwertige Ersatz-Ablaufpumpe für gängige Frontlader-Waschmaschinen. Kompatibel mit den meisten Bosch, Siemens und Neff-Modellen.',
    image: 'https://images.ersatzteilshop.de/lg/media/74/55/be/1740121294/rueckschlagventil-fuer-sammeltopf-bosch-00611320-fuer-geschirrspueler.346642.jpg'
  },
  {
    id: 'heater',
    name: 'Heizkörper / Heizelement 2000 W',
    brand: 'Universal',
    sku: '00471638',
    price: 32.90,
    category: 'Waschmaschine',
    description: 'Ersatz-Heizelement 2000 Watt für Waschmaschinen. Einfache Montage, kompatibel mit zahlreichen Modellen.',
    image: 'https://static.ersatzteilshop.de/public/media/fe/04/54/1727440181/heizstab-heizwiderstand-heizung-4055087342.475819.jpg'
  },
  {
    id: 'seal',
    name: 'Türmanschette für Frontlader',
    brand: 'Universal',
    sku: '00686662',
    price: 54.90,
    category: 'Waschmaschine',
    description: 'Gummidichtung für Frontlader-Waschmaschinen, verhindert Wasseraustritt und Geruchsbildung. Einfach auszutauschen.',
    image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'board',
    name: 'Steuerungsmodul für Haushaltsgeräte',
    brand: 'Bosch / Siemens',
    sku: '00650827',
    price: 89.90,
    category: 'Waschmaschine',
    description: 'Originales Steuerungsmodul für Bosch- und Siemens-Waschmaschinen. Steuert Waschprogramme, Temperatur und Schleuderdrehzahl.',
    image: 'https://cdn.shopify.com/s/files/1/0045/4092/4007/files/uW5CWm2QjNWA1Igg.jpg?v=1738604552'
  },
  {
    id: 'motor',
    name: 'Antriebsmotor für Waschmaschine',
    brand: 'Universal',
    sku: '00704780',
    price: 129.00,
    category: 'Waschmaschine',
    description: 'Robuster Ersatzmotor für Waschmaschinentrommeln. Universell einsetzbar, inkl. Montagehinweis.',
    image: 'https://media.adeo.com/marketplace/MKP/86997745/62cf94d37645eb8db5674ef38d47156c.jpeg'
  },
  {
    id: 'valve',
    name: 'Wasserzulaufventil 2-Wege',
    brand: 'Universal',
    sku: '00428872',
    price: 16.90,
    category: 'Geschirrspüler',
    description: 'Zweiwege-Zulaufventil für Geschirrspüler. Regelt die Wasserzufuhr zuverlässig; einfache Steckverbindung.',
    image: 'https://img.ep-cdn.com/i/500/500/sg/sgxlwjpbyhqkaevrmonz/tockici-sudje-aeg-50286967000-cene.jpg'
  },
  {
    id: 'wheel',
    name: 'Korbrolle für Geschirrspüler',
    brand: 'AEG',
    sku: '50286967000',
    price: 9.80,
    category: 'Geschirrspüler',
    description: 'Ersatzrolle für den Unterkorb des Geschirrspülers. Passt auf viele AEG- und Electrolux-Modelle.',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'filter',
    name: 'Wasserfilter für Kühlschrank',
    brand: 'Wpro',
    sku: 'C00379992',
    price: 12.80,
    category: 'Kühlschrank',
    description: 'Aktivkohle-Wasserfilter für Side-by-Side- und No-Frost-Kühlschränke. Erhöht Wasserqualität und Geschmack.',
    image: 'https://assets.products-live.ao.com/Images/aee4d121-9e8c-40e7-a842-6d382dddda2e/1280x1280/c00379992_wpro_waterfilter_02.jpg'
  },
  {
    id: 'drum-belt',
    name: 'Antriebsriemen für Wäschetrockner',
    brand: 'Miele',
    sku: '06263693',
    price: 19.90,
    category: 'Trockner',
    description: 'Passender Ersatzriemen für den Trommelantrieb in Miele-Trocknern. Originalqualität für langen Betrieb.',
    image: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'oven-seal',
    name: 'Backofendichtung 900 mm',
    brand: 'Universal',
    sku: '00481060',
    price: 23.50,
    category: 'Herd',
    description: 'Hochtemperatur-Silikondichtung für Backofentüren. 900 mm Länge, passend für viele Herdmodelle.',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'vacuum-filter',
    name: 'HEPA-Filter für Staubsauger',
    brand: 'Bosch',
    sku: '00578732',
    price: 14.90,
    category: 'Staubsauger',
    description: 'Hochwertiger HEPA-Ersatzfilter für Bosch-Staubsauger. Hält Feinstaub und Allergene effektiv zurück.',
    image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'blender-blade',
    name: 'Messerblock für Standmixer',
    brand: 'Universal',
    sku: 'MS0A11389',
    price: 18.40,
    category: 'Kleingeräte',
    description: 'Robuste Edelstahl-Ersatzklinge für gängige Standmixer. Einfache Montage, spülmaschinengeeignet.',
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'dishwasher-arm',
    name: 'Sprüharm oben für Geschirrspüler',
    brand: 'AEG',
    sku: '1119161109',
    price: 29.90,
    category: 'Zubehör',
    description: 'Oberer Sprüharm als Ersatzteil für AEG-Geschirrspüler. Gleichmäßige Wasserverteilung für optimale Reinigung.',
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'fridge-shelf',
    name: 'Glasabstellfläche für Kühlschrank',
    brand: 'Electrolux',
    sku: '2249015099',
    price: 34.50,
    category: 'Kühlschrank',
    description: 'Sicherheitsglas-Einlegeboden für Kühlschränke. Leicht zu reinigen, bruchresistentes Glas.',
    image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'dishwasher-basket',
    name: 'Besteckkorb für Geschirrspüler',
    brand: 'Siemens',
    sku: '00267397',
    price: 22.00,
    category: 'Geschirrspüler',
    description: 'Stabiler Ersatz-Besteckkorb für Siemens-Geschirrspüler. Mit herausnehmbaren Einsätzen für bessere Sortierung.',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'vacuum-bag',
    name: 'Staubsaugerbeutel 5er-Pack',
    brand: 'Miele',
    sku: 'GN-HyClean-3D',
    price: 11.90,
    category: 'Zubehör',
    description: 'Original HyClean 3D-Staubsaugerbeutel von Miele, 5 Stück. Hygienischer Wechsel ohne Staubkontakt.',
    image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=500&q=80'
  }
];
