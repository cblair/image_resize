import { NextApiRequest, NextApiResponse } from "next";
const lqip = require('lqip-modern')

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const image_url = req.body.image_url || "";
    let data;
    let status = 200;

    console.time('fetch');
    console.time('convert_buffer');
    console.time('convert_preview');

    try {
      // This will throw if the URL doesn't exist.
      console.log(`Fetching image for URL "${image_url}"...`)
      data = await fetch(image_url);
      console.log("... done fetch.")
      console.timeEnd('fetch')
      
      // This will throw if data isn't a response image like we expect.
      console.log(`Converting image "${image_url}" to local buffer...`);
      data = Buffer.from(await data.arrayBuffer());
      console.log("... done converting to local buffer.")
      console.timeEnd('convert_buffer')
      
      console.log(`Converting image "${image_url}" to to preview...`);
      const result = await lqip(data,
        {
          outputFormat: "jpeg",
        });
      data = {
        content: result.content.data,
        dataURIBase64: result.metadata.dataURIBase64,
      };
      console.log("... done converting to preview.")
      console.timeEnd('convert_preview')

      console.log(`Done with image "${image_url}".`);
    } catch (error) {
      status = 500;
      data = error?.message;
      // console.error({error});
    }

    res.status(status).send(data);
} 
