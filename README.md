# Cache tags & Purge API on Netlify

This is a demo of using `Cache-Tag` and `Netlify-Cache-Tag` on Netlify Edge,
with instructions on how to take advantage of Netlify's Purge API to granularly
invalidate content cached on Netlify's CDN.

Visit [the demo site](https://cache-tags-and-purge-api.netlify.app/) to see this in action.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/netlify-labs/cache-tags-and-purge-api)

Netlify now supports the `Cache-Tag` and `Netlify-Cache-Tag` response headers, allowing you to associate an object or collection of cached objects to a tag that can be purged simultaneously across all of Netlify’s Edge, without the need for a new deploy.

Here’s an example of a Function that will be cached on Netlify Edge for up to one year. The content is tagged using `Cache-Tag` with the request query parameter `productType`, `promotions` and `proxy-api-response`. Each of these tags provides a different level of granularity that allows purging one or many content pages simultaneously.

```jsx
export default async (req: Request) => {
  const url = new URL(req.url);
  const productType = url.searchParams.get("productType");
  const resp = await fetch(`https://your-api.com/promotions/${productType}`);
  const json = await resp.json();
  const body = `<!doctype html><html>
    <head>
        <title>E-commerce promotions</title>
    </head>
    <body>
        <h2>Promotions</h2>
        <ul>${json.map((item) => `<li>${item.title}</li>`).join("\n")}</ul>
    </body><html>`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/html",
      "Cache-Control": "public, max-age=0, must-revalidate", // Tell browsers to always revalidate
      "Netlify-CDN-Cache-Control": "public, max-age=31536000, must-revalidate", // Tell Edge to cache asset for up to a year,
      "Cache-Tag": `${productType},promotions,proxy-api-response` // Tag all promotions responses with these tags
    }
  });
};
```

Content tagged with these headers can be purged by using a Netlify Function to call Netlify’s Purge API. The following function uses the capabilities of Netlify’s Improved Compute and invokes the Purge API to purge all the site’s content tagged with `promotions`, while leaving the remaining site’s content cached on the CDN.

```jsx
import { Config, purgeCache } from "@netlify/functions";

export default async () => {
  const cacheTags = ["promotions"];
  await purgeCache({ cacheTags });

  return new Response("Purged successfully!", { status: 202 });
};

export const config: Config = {
  path: "/purge"
};
```

Alternatively to `Cache-Tag`, `Netlify-Cache-Tag` can be used instead, which Netlify will remove from the client response headers and it will only affect content cached in Netlify’s CDN, in case another service is being used in front of Netlify’s CDN that also supports this feature.
