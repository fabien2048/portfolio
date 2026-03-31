/**
 * Optimise les URLs Cloudinary en ajoutant des paramètres de transformation.
 * @param url L'URL originale de l'image ou vidéo Cloudinary
 * @param width Optionnel - largeur souhaitée pour le redimensionnement (ex: 800)
 */
export const optimizeCloudinary = (url: string, width?: number) => {
  if (!url) return '';
  
  if (url.includes('cloudinary.com') && url.includes('/upload/')) {
    const isVideo = url.match(/\.(mp4|webm|mov|m4v|ogv)$/i);
    let params = 'f_auto,q_auto';
    
    if (isVideo) {
      params += ',vc_auto'; // video codec auto
    }

    // Ajout du redimensionnement si spécifié
    if (width) {
      params += `,w_${width},c_limit`;
    }
    
    // Injection des paramètres au début de la chaîne d'upload
    // On évite de dupliquer si f_auto ou q_auto existent déjà
    if (!url.includes('f_auto') && !url.includes('q_auto')) {
      return url.replace('/upload/', `/upload/${params}/`);
    }
    
    // Cas où on veut juste forcer la largeur sur mobile
    if (width && !url.includes(',w_') && !url.includes('/w_')) {
       return url.replace('/upload/', `/upload/w_${width},c_limit/`);
    }
  }
  
  return url;
};
