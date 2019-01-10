const React = require("react");
const defaultOptions = require("./default-options");
const { withPrefix } = require('gatsby');

exports.onRenderBody = async ({ graphql, setHeadComponents }, pluginOptions) => {
    let { sitemapPath, createLinkInHead } = { ...defaultOptions, ...pluginOptions };

    if (!createLinkInHead) {
        return;
    }

    setHeadComponents([
        React.createElement("link", {
            key: "gatsby-image-sitemap",
            rel: "sitemap",
            type: "application/xml",
            href: withPrefix(sitemapPath),
        }),
    ]);
};
