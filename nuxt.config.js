
const routerBase = process.env.DEPLOY_ENV === 'GH_PAGES' ? {
  router: {
    base: '/wapp_clipboard_to_markdown/dist/'
  }
} : {};

export default {
  ...routerBase,

  mode: 'spa',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/pwa',
  ],
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
      // const HtmlWebpackPlugin = require('html-webpack-plugin')
      // const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

      // config.plugins.push(new HtmlWebpackPlugin({
		  //   inlineSource: '.(js|css)$' // embed all javascript and css inline
	    // }));
      // config.plugins.push(new HtmlWebpackInlineSourcePlugin());
    }
  }
}
