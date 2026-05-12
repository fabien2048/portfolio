/**
 * Optimise les URLs Cloudinary en ajoutant des paramètres de transformation.
 *
 * - Images  → WebP forcé (f_webp) + qualité auto
 * - Vidéos  → Format auto Cloudinary (f_auto sert WebM aux navigateurs qui le supportent,
 *             MP4 aux autres, via Content-Type negotiation). Plus fiable que forcer f_webm.
 *
 * @param url    L'URL originale (image ou vidéo Cloudinary / locale)
 * @param width  Optionnel — largeur max (ex: 800 pour mobile)
 */
export const optimizeCloudinary = (url: string, width?: number): string => {
  if (!url) return '';

  if (url.includes('cloudinary.com') && url.includes('/upload/')) {
    // Évite de doubler les paramètres si déjà présents
    if (
      url.includes('f_auto') ||
      url.includes('f_webp') ||
      url.includes('f_webm') ||
      url.includes('q_auto')
    ) {
      if (width && !url.includes('w_')) {
        return url.replace('/upload/', `/upload/w_${width},c_limit/`);
      }
      return url;
    }

    const isVideo = /\.(mp4|webm|mov|m4v|ogv)(\?|#|$)/i.test(url);

    if (isVideo) {
      // f_auto : Cloudinary sert WebM/VP9 aux navigateurs compatibles, MP4 sinon
      // vc_auto : sélection automatique du codec (VP9, H.264...)
      const params = width
        ? `f_auto,vc_auto,q_auto:good,w_${width},c_limit`
        : 'f_auto,vc_auto,q_auto:good';
      return url.replace('/upload/', `/upload/${params}/`);
    } else {
      // WebP : 25-35% plus léger que JPEG/PNG, supporté par tous les navigateurs modernes
      const params = width
        ? `f_webp,q_auto:good,w_${width},c_limit`
        : 'f_webp,q_auto:good';
      return url.replace('/upload/', `/upload/${params}/`);
    }
  }

  return url;
};

/**
 * Génère une URL de poster WebP optimisé à partir d'une vidéo Cloudinary.
 * Extrait la première frame (so_0) et la convertit en WebP.
 * Retourne '' pour les URLs non-Cloudinary.
 */
export const getVideoPosterWebp = (videoUrl: string, width?: number): string => {
  if (!videoUrl || !videoUrl.includes('cloudinary.com')) return '';

  const params = width
    ? `f_webp,q_auto:good,w_${width},so_0`
    : 'f_webp,q_auto:good,so_0';

  // Change l'extension en .webp (Cloudinary génère le poster à partir de la frame 0)
  const withWebpExt = videoUrl.replace(/\.(mp4|webm|mov|m4v|ogv)(\?.*)?$/i, '.webp');

  if (withWebpExt.includes('/upload/') && !withWebpExt.includes('f_webp')) {
    return withWebpExt.replace('/upload/', `/upload/${params}/`);
  }
  return withWebpExt;
};
