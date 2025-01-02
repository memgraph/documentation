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
      <link rel="icon" href="/docs/favicon.png" type="image/png" />

      {/* Open Graph meta tags */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta
        property="og:title"
        content={frontMatter.title || "Memgraph documentation"}
      />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="600" />
      <meta property="og:image:height" content="314" />

      {/* Twitter meta tags */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={imageUrl} />
    </>
  );
};
