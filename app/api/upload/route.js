import { NextResponse } from 'next/server';
import AWS from 'aws-sdk';

export async function POST(request) {
    const data = await request.formData();
    const files = data.getAll('file'); // Use getAll to get an array of all files

    if (!files || files.length === 0) {
        return NextResponse.json({ success: false, error: 'No files provided' });
    }

    const bucketName = 'mazindabucket';
    const uploadedFiles = [];
    const locations = [];

    try {
        const s3 = new AWS.S3();

        for (const file of files) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Generate a timestamp for the file name
            const currentDate = new Date();
            const timestamp = currentDate.toISOString().replace(/[:.]/g, '');

            const fileNameWithTimestamp = `${timestamp}_${file.name}`;

            const params = {
                Bucket: bucketName,
                Key: fileNameWithTimestamp, // Use the new filename
                Body: buffer,
            };

            // Using promises instead of callbacks for the S3 upload
            const uploadResult = await s3.upload(params).promise();

            console.log('File uploaded successfully', uploadResult.Location);

            uploadedFiles.push({ fileName: fileNameWithTimestamp, location: uploadResult.Location });
            locations.push(uploadResult.Location)
        }

        return NextResponse.json({ success: true, uploadedFiles, locations });
    } catch (error) {
        console.error('Error uploading files:', error);
        return NextResponse.json({ success: false, error: 'Error uploading files' });
    }
}
