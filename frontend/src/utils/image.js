const PLACEHOLDER_IMAGE = 'https://placehold.co/800x600/F5F5F5/1f2937?text=No+Image';

export const resolveImageSrc = (rawImage, fallback = PLACEHOLDER_IMAGE) => {
  if (!rawImage) return fallback;

  if (/^https?:\/\//i.test(rawImage)) {
    return rawImage;
  }

  const uploadsBase = import.meta.env.VITE_UPLOADS_URL || '';

  if (uploadsBase) {
    return `${uploadsBase}${rawImage}`;
  }

  return rawImage;
};

export const imagePlaceholder = PLACEHOLDER_IMAGE;
