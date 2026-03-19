/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://ashamconstruction.co.ke', // your website URL
  generateRobotsTxt: true,                 // optional, generates robots.txt
  sitemapSize: 5000,                        // default is 50000, fine for small sites
  outDir: './public',                       // where sitemap.xml will be generated
  transform: async (config, url) => {
    // optional: you can customize URL priority, changefreq etc.
    return {
      loc: url,           // the URL
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date().toISOString(),
    };
  },
};