// The SDK renders web components in the browser only, so render the whole app
// on the client and skip prerendering — `adapter-static` emits the SPA shell and
// its `index.html` fallback owns every route. See `svelte.config.js`.
export const ssr = false;
export const prerender = false;
