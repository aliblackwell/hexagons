module.exports = {
  eslint: {
    dirs: ['components', 'pages', 'queries', 'styles', 'cypress'], // Only run ESLint on the 'pages' and 'utils' directories during production builds (next build)
  },
  images: {
    domains: ['localhost','strapi-bfxo.onrender.com','backend.hexagons.com']
  }
}