import type { Config } from "@netlify/functions";

export default async () => {
  const resp = await fetch(
    "https://fakestoreapi.com/products/category/jewelery?sort=desc"
  );
  const json = await resp.json();
  const body = `<!doctype html><html>
    <head>
        <title>Netlify-Cache-Tag</title>
        <link rel="stylesheet" href="/main.css">
    </head>
    <body>
        <h1>Netlify-Cache-Tag</h1>
        <p>Similarly to the <a href="/cache-tag">Cache-Tag</a> header, the <strong>Netlify-Cache-Tag</strong> header allows you to tag content across Netlify's CDN so you can invalidate it more granularly. While other services you have in front of Netlify's CDN might support the Cache-Tag header, Netlify-Cache-Tag is only supported by Netlify, so you can have different cache tagging/purging behaviour for each service.
        <p>This page is tagged with <strong>"Netlify-Cache-Tag: jewelery,cache-tag-demo"</strong>, you can use the <strong>jewelery</strong> tag to purge only this page without affecting the rest of the content on this site, or use <strong>cache-tag-api-demo</strong> to purge all generated pages on this site</p>
        <h2>Products</h2>
        <p>Jewelery products from <a href="https://fakestoreapi.com/">https://fakestoreapi.com/</a> were fetched at <strong>${new Date()}</strong></p>
        <ul>${json.map((item) => `<li>${item.title}</li>`).join("\n")}</ul>
        <br>
        <div class="purge_buttons">
            <form action="/purge?tag=jewelery" method="post">
                <button name="purge">Purge with jewelery tag</button>
            </form>
            <form action="/purge?tag=cache-tag-api-demo" method="post">
                <button name="purge">Purge with cache-tag-demo tag</button>
            </form>
        </div>
        <br>
        <p><a href="/">Go back</a></p>
    </body><html>`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/html",
      "Netlify-Cache-Tag": "jewelery,cache-tag-api-demo",
      "Netlify-Cdn-Cache-Control": "public, s-maxage=31536000, must-revalidate", // Tell Netlify to cache the content up to 1 year
      "Cache-Control": "public, max-age=0, must-revalidate" // Tell the browser to always revalidate
    }
  });
};

export const config: Config = {
  path: "/netlify-cache-tag"
};
