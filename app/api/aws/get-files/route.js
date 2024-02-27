import { NextResponse } from "next/server";
import AWS from "aws-sdk";

export async function POST(request) {
  const { store_name, folder_name } = await request.json();
  console.log(store_name);

  const bucketName = "mazindabucket";

  try {
    const s3 = new AWS.S3();

    try {
      // Use the listObjectsV2 function to list objects in the folder
      const response = await s3
        .listObjectsV2({
          Bucket: bucketName,
          Prefix: `${store_name}/${folder_name}`,
        })
        .promise();

      // Extract the file names from the response
      const files = response.Contents.map((obj) => obj.Key);

      // Return the list of files
      return NextResponse.json({
        success: true,
        message: "Files fetched successfully",
        files,
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
