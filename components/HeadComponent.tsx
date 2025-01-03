import { useRouter } from "next/router";
import { useConfig } from "nextra-theme-docs";

export const HeadComponent = () => {
  const { asPath, defaultLocale, locale } = useRouter();
  const { frontMatter } = useConfig();

  const url =
    "https://memgraph.com/docs" +
    (defaultLocale === locale ? asPath : `/${locale}${asPath}`);
  const description =
    frontMatter.description ||
    "Discover the comprehensive Memgraph documentation and learn how to use the powerful graph database to its full potential.";
  const imageUrl =
    frontMatter.image ||
    "https://memgraph.com/docs/memgraph-docs-ogimage-small.png";

  return (
    <>
      {/* Basic Metadata */}
      <title>{frontMatter.title || "Memgraph documentation"}</title>
      <meta name="description" content={description} />
      <link rel="icon" href="/docs/favicon.png" type="image/png" />
      <link rel="canonical" href={url} />

      {/* Open Graph Meta Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={frontMatter.title || "Memgraph documentation"} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="600" />
      <meta property="og:image:height" content="314" />
      <meta property="og:site_name" content="Memgraph documentation" />

      {/* Twitter Meta Tags */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content={frontMatter.title || "Memgraph documentation"} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={imageUrl} />
      <meta property="twitter:site" content="@memgraphdb" />
      <meta property="twitter:creator" content="@memgraphdb" />
    </>
  );
};
