const cheerio = require("cheerio");
const sm = require("sitemap");
const fs = require("fs");
const defaultOptions = require('./default-options');

exports.onPostBuild = async ({ graphql, pathPrefix }, pluginOptions) => {
    const options = {
        ...defaultOptions,
        ...pluginOptions,
    };

    options.excludePaths.push("/dev-404-page/");

    const allPagesQuery = await graphql(
        `
            {
                site {
                    siteMetadata {
                        siteUrl
                    }
                }
                allSitePage {
                    edges {
                        node {
                            path
                        }
                    }
                }
            }
        `
    );

    const siteUrl = allPagesQuery.data.site.siteMetadata.siteUrl;
    const allPagePaths = allPagesQuery.data.allSitePage.edges.map(node => node.node.path);

    console.log(`Generating image sitemap for ${allPagePaths.length} pages...`);

    let imagesCount = 0;
    let urlData = [];

    allPagePaths.filter(path => options.excludePaths.indexOf(path) === -1).forEach(path => {
        const filePath = path + (path.indexOf(".html") === -1 ? "index.html" : "");

        const fileContent = fs.readFileSync(`${options.buildDir}${filePath}`).toString("utf8");
        const pageDOM = cheerio.load(fileContent, {
            // use xmlMode to read the content in <noscript> tags
            // otherwise you cannot access them
            xmlMode: true,
        });

        const pageImages = {};

        // find all gatsby-image from the current page
        // we have to find the parent (e.g. .gatsby-image-wrapper), 
        // so we can extract the alt from <img /> and all resolution
        // links from the <source /> tag 
        pageDOM(options.gatsbyImageSelector).each(function() {
            const el = cheerio(this);
            const alt = el.find("img").attr("alt");

            if (options.ignoreImagesWithoutAlt && !alt) {
                return;
            }

            const srcSets = el
                .find("source")
                .attr("srcSet")
                .split("\n");

            srcSets.forEach(srcSet => {
                const path = srcSet.split(" ")[0];
                pageImages[path] = alt;
            });
        });

        const pageImagesKeys = Object.keys(pageImages);
        if (pageImagesKeys.length === 0) {
            return;
        }

        imagesCount += pageImagesKeys.length;

        urlData.push({
            url: siteUrl + path,
            img: pageImagesKeys.map(image => {
                return {
                    url: siteUrl + image,
                    title: pageImages[image],
                };
            }),
        });
    });

    console.log(`Creating sitemap for ${imagesCount} images.`);

    const sitemap = sm.createSitemap({
        urls: urlData,
    });

    fs.writeFileSync(`${options.buildDir}/${options.sitemapPath}`, sitemap.toString());

    console.log(`Image sitemap successfully written to ${options.buildDir}/${options.sitemapPath}`);
};
