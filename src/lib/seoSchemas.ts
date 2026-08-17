export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://nordbase.pt/#organization',
    name: 'NordBase',
    url: 'https://nordbase.pt',
    logo: 'https://nordbase.pt/logo.svg',
    description: 'Human-coordinated local services platform in Portugal connecting customers with qualified independent specialists. Launching operationally from Portimão, Algarve.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Portimão',
      addressRegion: 'Algarve',
      addressCountry: 'PT'
    },
    areaServed: [
      {
        '@type': 'City',
        name: 'Portimão'
      },
      {
        '@type': 'AdministrativeArea',
        name: 'Algarve'
      },
      {
        '@type': 'Country',
        name: 'Portugal'
      }
    ]
  };
}

export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://nordbase.pt/#website',
    url: 'https://nordbase.pt',
    name: 'NordBase Portugal',
    description: 'Local services coordination platform in Portugal',
    publisher: {
      '@id': 'https://nordbase.pt/#organization'
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://nordbase.pt/services/{search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  };
}

export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

export function getCategoryServiceSchema(categoryName: string, categoryDescription?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${categoryName} Services in Portugal | NordBase`,
    serviceType: categoryName,
    provider: {
      '@id': 'https://nordbase.pt/#organization'
    },
    areaServed: {
      '@type': 'Country',
      name: 'Portugal'
    },
    description: categoryDescription || `Professional ${categoryName} coordination across Portugal. Describe your problem and connect with verified local specialists.`
  };
}

export function getLocalServiceSchema(cityName: string, categoryName: string, categoryDescription?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${categoryName} in ${cityName} | NordBase`,
    serviceType: categoryName,
    provider: {
      '@id': 'https://nordbase.pt/#organization'
    },
    areaServed: {
      '@type': 'City',
      name: cityName,
      containedInPlace: {
        '@type': 'AdministrativeArea',
        name: 'Algarve'
      }
    },
    description: categoryDescription || `Local ${categoryName} coordination in ${cityName}, Portugal. Submit your request to connect with local specialists.`
  };
}

export function getCustomerFaqSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How does NordBase work for customers in Portugal?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Customers describe their problem online or via telephone. NordBase local coordination evaluates the request and connects it with an appropriate independent Specialist in the area.'
        }
      },
      {
        '@type': 'Question',
        name: 'Can the final price change after the initial request?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. The initial estimate is based on the customer’s description. If an on-site evaluation reveals a different work scope, the Specialist proposes a revised final price which the customer must approve before work proceeds.'
        }
      },
      {
        '@type': 'Question',
        name: 'What services are available on NordBase?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'NordBase coordinates Home Services (Plumbing, Electrical, Handyman), Cleaning, Gardening, Moving & Transport, Appliance Repairs, Property Maintenance, and Pool Services across Portugal.'
        }
      },
      {
        '@type': 'Question',
        name: 'What happens after the work is completed?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Once the work is completed, both the customer and the Specialist submit digital completion sign-off on the platform to confirm successful completion.'
        }
      }
    ]
  };
}
