export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Try to serve the requested asset
    let response = await env.ASSETS.fetch(request);
    
    // If not found, serve index.html for SPA client-side routing
    if (response.status === 404 && !url.pathname.startsWith('/api/')) {
      response = await env.ASSETS.fetch(new Request(
        new URL('/index.html', request.url), request
      ));
    }
    
    return response;
  }
};
