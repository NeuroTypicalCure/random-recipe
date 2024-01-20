type og_object = {
  'og:title': string;
  'og:type': string;
  'og:image': string;
  'og:url': string;
  'og:description'?: string;
  'og:site_name'?: string;
  'og:determiner'?: string;
  'og:locale'?: string;
  'og:article_published_time'?: string; // ISO 8601 format
  'og:article_modified_time'?: string; // ISO 8601 format
  'og:article_author'?: string;
  'og:video'?: string;
  'og:video_secure_url'?: string;
  'og:video_type'?: string;
  'og:video_width'?: number;
  'og:video_height'?: number;
  'og:audio'?: string;
  'og:audio_secure_url'?: string;
  'og:audio_type'?: string;
  'og:app_id'?: string;
};

export default og_object;