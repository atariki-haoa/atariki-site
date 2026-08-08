import React from 'react';

interface PersonStructuredDataProps {
  name: string;
  jobTitle: string;
  description: string;
  url: string;
  image: string;
  sameAs: string[];
  worksFor?: {
    name: string;
    url?: string;
  };
  address?: {
    addressCountry: string;
    addressLocality: string;
  };
}

interface ProjectStructuredDataProps {
  name: string;
  description: string;
  url: string;
  image?: string;
  dateCreated: string;
  dateModified?: string;
  programmingLanguage: string[];
  applicationCategory: string;
  author: {
    name: string;
    url: string;
  };
}

interface WebsiteStructuredDataProps {
  name: string;
  description: string;
  url: string;
  author: {
    name: string;
    url: string;
  };
  inLanguage: string;
  copyrightYear: number;
}

export const PersonStructuredData: React.FC<PersonStructuredDataProps> = ({
  name,
  jobTitle,
  description,
  url,
  image,
  sameAs,
  worksFor,
  address
}) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": name,
    "jobTitle": jobTitle,
    "description": description,
    "url": url,
    "image": image,
    "sameAs": sameAs,
    ...(worksFor && {
      "worksFor": {
        "@type": "Organization",
        "name": worksFor.name,
        ...(worksFor.url && { "url": worksFor.url })
      }
    }),
    ...(address && {
      "address": {
        "@type": "PostalAddress",
        "addressCountry": address.addressCountry,
        "addressLocality": address.addressLocality
      }
    })
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};

export const ProjectStructuredData: React.FC<ProjectStructuredDataProps> = ({
  name,
  description,
  url,
  image,
  dateCreated,
  dateModified,
  programmingLanguage,
  applicationCategory,
  author
}) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": name,
    "description": description,
    "url": url,
    ...(image && { "image": image }),
    "dateCreated": dateCreated,
    ...(dateModified && { "dateModified": dateModified }),
    "programmingLanguage": programmingLanguage,
    "applicationCategory": applicationCategory,
    "author": {
      "@type": "Person",
      "name": author.name,
      "url": author.url
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};

export const WebsiteStructuredData: React.FC<WebsiteStructuredDataProps> = ({
  name,
  description,
  url,
  author,
  inLanguage,
  copyrightYear
}) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": name,
    "description": description,
    "url": url,
    "author": {
      "@type": "Person",
      "name": author.name,
      "url": author.url
    },
    "inLanguage": inLanguage,
    "copyrightYear": copyrightYear
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};

export const BreadcrumbStructuredData: React.FC<{ items: Array<{ name: string; url: string }> }> = ({ items }) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};
