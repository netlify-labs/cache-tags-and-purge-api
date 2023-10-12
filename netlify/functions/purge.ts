import { Config, purgeCache } from "@netlify/functions";

export default async (req: Request) => {
  const url = new URL(req.url);
  const cacheTag = url.searchParams.get("tag");
  const tags = cacheTag ? [cacheTag] : undefined;

  console.log("Purging cache:", { url, cacheTag, tags });

  try {
    await purgeCache({
      tags
    });
  } catch (error) {
    console.error(error);
  }

  return Response.redirect(new URL("/", url));
};

export const config: Config = {
  path: "/purge"
};
