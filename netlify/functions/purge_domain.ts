import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions"

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
    const purgeToken: string = context.clientContext.custom["purge_api_token"];

    console.log("Purging domain");
    const response = await fetch("https://api.netlify.com/api/v1/purge", {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf8",
            "Authorization": `Bearer ${purgeToken}`
        },
        body: JSON.stringify({
            site_id: process.env.SITE_ID,
            domain: "deploy-preview-11--my-site.netlify.app"
        })
    })

    return {
        statusCode: 202
    }
}

export { handler };
