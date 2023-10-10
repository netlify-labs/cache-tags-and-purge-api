import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions"

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
    const purgeToken: string = context.clientContext.custom["purge_api_token"];
    const cacheTag: string = event.queryStringParameters?.tag;

    console.log("Purging tag: ", cacheTag);
    const response = await fetch("https://api.netlify.com/api/v1/purge", {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf8",
            "Authorization": `Bearer ${purgeToken}`
        },
        body: JSON.stringify({
            site_id: process.env.SITE_ID,
            cache_tags: [cacheTag]
        })
    })

    return {
        statusCode: 301,
        headers: {
            Location: "/",
        },
    }
}

export { handler };
