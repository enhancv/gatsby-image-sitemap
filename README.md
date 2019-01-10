# gatsby-image-sitemap

This plugin is not a replacement of `gatsby-plugin-sitemap`, but an extension. It crawls all the output pages, collects all the images with their different resolutions and inserts them into a sitemap file. It uses `cheerio` to parse the DOM of the built pages and `sitemap` to generate a working XML sitemap.

### How to install:

    yarn add gatsby-image-sitemap

then add 

    plugins: ["gatsby-image-sitemap"]

to your gatsby-config.js

### Next steps

 - Add tests
 - Parse non-gatsby images as well


### Contributions
All contributions are welcome, as long as you use `https://github.com/enhancv/prettier` to format the code and make a pull-request with properly documented changes.

## License
Licensed under the MIT license.

Create your resume with Enhancv to make sure the key things come across. Stand out and get that interview.
https://enhancv.com