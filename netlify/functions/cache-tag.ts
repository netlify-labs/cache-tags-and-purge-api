import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
    const resp = await fetch('https://fakestoreapi.com/products/category/electronics?sort=desc')
    const json = await resp.json()

    return {
        statusCode: 200,
        body: `<!doctype html><html>
        <head>
            <title>Cache-Tag</title>
            <link rel="stylesheet" href="/main.css">
        </head>
        <body>
            <h1>Cache-Tag</h1>
            <p>The <strong>Cache-Tag</strong> header allows you to tag content across Netlify's CDN so you can invalidate it more granularly. You can define multiple comma-separated cache tags for a single asset or use multiple Cache-Tag headers on the response.
            <p>This page is tagged with <strong>"Cache-Tag: electronics,cache-tag-demo"</strong>, so you can use the <strong>electronics</strong> tag to purge only this page without affecting the rest of the content on this site, or use <strong>cache-tag-api-demo</strong> to purge all generated pages on this site.</p>
            <h2>Products</h2>
            <p>Electronic products from <a href="https://fakestoreapi.com/">https://fakestoreapi.com/</a> were fetched at <strong>${new Date}</strong>:</p>
            <ul>${json.map((item) => `<li>${item.title}</li>`).join("\n")}</ul>
            <br>
            <div class="purge_buttons">
                <form action="/purge?tag=electronics" method="post">
                    <button name="purge">Purge with electronics tag</button>
                </form>
                <form action="/purge?tag=cache-tag-api-demo" method="post">
                    <button name="purge">Purge with cache-tag-demo tag</button>
                </form>
            </div>
            <br>
            <p><a href="/">Go back</a></p>
        </body><html>`,
        headers: {
            "Content-Type": "text/html",
            "Cache-Tag": "electronics,cache-tag-demo",
            "Netlify-Cdn-Cache-Control": "public, s-maxage=31536000, must-revalidate", // Tell Netlify to cache the content up to 1 year
            "Cache-Control": "public, max-age=0, must-revalidate", // Tell the browser to always revalidate
        }
    }
};

export { handler };
