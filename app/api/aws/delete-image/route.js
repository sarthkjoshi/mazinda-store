import { NextResponse } from "next/server";
import AWS from "aws-sdk";

export async function DELETE(request) {
  const searchParams = request.nextUrl.searchParams;
  const imagePath = searchParams.get("imagePath");
  const bucketURL = process.env.NEXT_PUBLIC_AWS_IMAGE_BUCKET_BASE_URI;

  const key = imagePath.slice(bucketURL.length);

  const bucketName = "mazindabucket";

  try {
    const s3 = new AWS.S3();
    await s3
      .deleteObject({
        Bucket: bucketName,
        Key: key,
      })
      .promise();

    return NextResponse.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting image from S3:", error);
    return NextResponse.json({
      success: false,
      message: "Error deleting image from S3",
      error,
    });
  }
}
