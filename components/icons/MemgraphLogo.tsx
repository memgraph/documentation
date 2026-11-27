import NextLink from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

// Product tabs preview: the upper-left corner is a product switcher. One button
// shows the product you're in (logo, name and chevron) and opens a menu with
// every product; each menu item opens that product's overview. The docs home
// (/docs) belongs to no product, so there the button reads "Docs" and the menu
// marks "All products" as current.

type Product = {
  key: string;
  prefix: string;
  href: string;
  light: string;
  dark: string;
  alt: string;
  label?: string;
  description: string;
};

const PRODUCTS: Product[] = [
  {
    key: "memgraph",
    prefix: "/",
    href: "/memgraph",
    light: "/docs/memgraph-logo-navigation.svg",
    dark: "/docs/memgraph-logo-navigation.svg",
    alt: "Memgraph logo",
    label: "Memgraph",
    description: "The graph database for AI context and analytics",
  },
  {
    key: "zero",
    prefix: "/memgraph-zero",
    href: "/memgraph-zero",
    light: "/docs/product-logos/zero-logo.svg",
    dark: "/docs/product-logos/zero-logo-dark.svg",
    alt: "Memgraph Zero logo",
    description: "Query data where it lives",
  },
  {
    key: "lore",
    prefix: "/memgraph-lore",
    href: "/memgraph-lore",
    light: "/docs/product-logos/lore-logo.svg",
    dark: "/docs/product-logos/lore-logo-dark.svg",
    alt: "Memgraph Lore logo",
    description: "For business analysts",
  },
];

const HOME: Product = {
  ...PRODUCTS[0],
  key: "home",
  href: "/",
  alt: "Memgraph logo",
  label: "Docs",
  description: "",
};

const Logo = ({ product, height }: { product: Product; height: string }) => {
  const style = { height, width: "auto" };
  return (
    <span className="_flex _items-center _gap-2">
      <img className="product-logo-light" src={product.light} alt={product.alt} style={style} />
      <img className="product-logo-dark" src={product.dark} alt={product.alt} style={style} />
      {product.label && (
        <span
          className="product-logo-label"
          style={{ fontSize: height === "24px" ? "17px" : "14px", fontWeight: 600 }}
        >
          {product.label}
        </span>
      )}
    </span>
  );
};

export const MemgraphLogo = () => {
  const { pathname } = useRouter();
  // The docs home is neutral; Memgraph is every other page outside Zero and Lore.
  const current =
    pathname === "/"
      ? HOME
      : PRODUCTS.find((p) => p.prefix !== "/" && pathname.startsWith(p.prefix)) ?? PRODUCTS[0];
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click, on Escape and after navigating.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  useEffect(() => setOpen(false), [pathname]);

  return (
    <div ref={ref} className="product-switcher">
      <button
        type="button"
        className="nextra-focus product-switcher-button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`${current.key === "home" ? "Memgraph docs" : current.label ?? current.alt.replace(/ logo$/, "")}: switch product`}
        onClick={() => setOpen((o) => !o)}
      >
        <Logo product={current} height="24px" />
        <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true"
          style={{ transform: open ? "rotate(180deg)" : undefined, transition: "transform 150ms" }}>
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div role="menu" className="product-switcher-menu">
          <NextLink
            href="/"
            role="menuitem"
            className={`product-switcher-item${current.key === "home" ? " is-current" : ""}`}
          >
            <span className="product-switcher-all">All products</span>
            <span className="product-switcher-description">Overview of the Memgraph docs</span>
          </NextLink>
          <div className="product-switcher-divider" />
          <p className="product-switcher-heading">Products</p>
          {PRODUCTS.map((p) => (
            <NextLink
              key={p.key}
              href={p.href}
              role="menuitem"
              className={`product-switcher-item${p.key === current.key ? " is-current" : ""}`}
            >
              <Logo product={p} height="20px" />
              <span className="product-switcher-description">{p.description}</span>
            </NextLink>
          ))}
        </div>
      )}
    </div>
  );
};
