import { NextResponse } from "next/server";
import AWS from "aws-sdk";

export async function POST(request) {
  const {
    store_name,
    folder_name,
    page = 1,
    limit = 1000,
  } = await request.json();
  const bucketName = "mazindabucket";

  try {
    const s3 = new AWS.S3();
    try {
      const startingIndex = (page - 1) * limit;

      const response1 = await s3
        .listObjectsV2({
          Bucket: bucketName,
          Prefix: `${store_name}/${folder_name}`,
        })
        .promise();

      const response = await s3
        .listObjectsV2({
          Bucket: bucketName,
          Prefix: `${store_name}/${folder_name}`,
          MaxKeys: limit,
          StartAfter:
            startingIndex > 0
              ? response1.Contents[startingIndex - 1].Key
              : undefined,
        })
        .promise();

      const files = response.Contents.map((obj) => obj.Key);

      const totalPages = Math.ceil(response1.KeyCount / limit);

      return NextResponse.json({
        success: true,
        message: "Files fetched successfully",
        files,
        currentPage: page,
        totalPages,
      });
    } catch (error) {
      console.error("Error retrieving files from S3:", error);
      return NextResponse.json({
        success: false,
        message: "Error retrieving files from S3",
        error,
      });
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({
      success: false,
      message: "Error uploading file",
      error,
    });
  }
}
