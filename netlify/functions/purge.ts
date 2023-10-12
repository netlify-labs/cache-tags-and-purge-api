import { Config, purgeCache } from "@netlify/functions";

export default async (req: Request) => {
  const url = new URL(req.url);
  const cacheTag = url.searchParams.get("tag");
  const tags = cacheTag ? [cacheTag] : undefined;

  await purgeCache({
    tags
  });

  return new Response(null, {
    headers: {
      Location: new URL("/", url).toString()
    },
    status: 301
  });
};

export const config: Config = {
  path: "/purge"
};
