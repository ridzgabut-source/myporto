export function track(event: string, details: Record<string, string> = {}) {
 window.dispatchEvent(new CustomEvent('portfolio:analytics', {detail:{event,...details}}));
 const analytics = window as Window & {dataLayer?: Record<string,string>[]};
 analytics.dataLayer?.push({event,...details});
}
