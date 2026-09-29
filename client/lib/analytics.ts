export const trackEvent = (eventName: string, data: Record<string, any> = {}) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] ${eventName}:`, data);
  }
};

export const trackPageView = (url: string) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[PageView] ${url}`);
  }
};
