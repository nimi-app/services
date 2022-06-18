export interface GenerateMetaTagsParams {
  title: string;
  description: string;
  imageUrl: string;
  url: string;
}

/**
 * Returns the Meta tags for a page
 * @returns
 */
export function createMetaTags({
  description,
  title,
  imageUrl,
  url,
}: GenerateMetaTagsParams): string {
  const tags = [
    `<title>${title}</title>`,
    `<meta name="title" content="{{title}}">`,
    `<meta name="description" content="${description}">`,
  ];

  // Open Graph
  tags.push(
    ...[
      `<meta property="og:type" content="website">`,
      `<meta property="og:url" content="${url}">`,
      `<meta property="og:title" content="${title}">`,
      `<meta property="og:description" content="${description}">`,
      `<meta property="og:image" content="${imageUrl}">`,
    ]
  );

  // Twitter
  tags.push(
    ...[
      `<meta property="twitter:card" content="summary_large_image">`,
      `<meta property="twitter:url" content="${url}">`,
      `<meta property="twitter:title" content="${title}">`,
      `<meta property="twitter:description" content="${description}">`,
      `<meta property="twitter:image" content="${imageUrl}" >`,
    ]
  );

  return tags.join('');
}

