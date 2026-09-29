import { Metadata } from 'next';
import { APP_NAME, APP_DESCRIPTION } from './constants';

export const generateSiteMetadata = (title?: string, description?: string): Metadata => {
  return {
    title: title ? `${title} | ${APP_NAME}` : `${APP_NAME}: Online Shopping India`,
    description: description || APP_DESCRIPTION,
    icons: { icon: '/favicon.ico' },
    openGraph: {
      title: title || APP_NAME,
      description: description || APP_DESCRIPTION,
      siteName: APP_NAME,
      type: 'website',
    },
  };
};
