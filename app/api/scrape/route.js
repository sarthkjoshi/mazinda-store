import cheerio from "cheerio";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { URL } = await req.json();

  console.log(URL);

  const headers = {
    "User-Agent": "",
    "Accept-Language": "en-US, en;q=0.5",
  };

  try {
    const response = await axios.get(URL, { headers });
    const $ = cheerio.load(response.data);

    const productNames = [];
    $("span.a-size-base-plus.a-color-base.a-text-normal").each(
      (index, element) => {
        productNames.push($(element).text().trim());
      }
    );

    const productImages = [];
    $("img.s-image").each((index, element) => {
      productImages.push($(element).attr("src"));
    });

    const productLinks = [];
    $("a.a-link-normal.s-no-outline").each((index, element) => {
      productLinks.push($(element).attr("href"));
    });

    // console.log("Product Names:", productNames);
    // console.log("Product Images:", productImages);
    // console.log("links", productLinks);

    return NextResponse.json({
      success: true,
      names: productNames,
      images: productImages,
      links: productLinks,
    });
  } catch (error) {
    console.log("Error fetching data:", error);
    return NextResponse.json({
      success: false,
    });
  }
}
