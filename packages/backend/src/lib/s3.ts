import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || "";

/**
 * Upload a base64 image to S3 and return the URL
 */
export async function uploadScreenshotToS3(
  base64Image: string,
  issueId: number
): Promise<string | null> {
  try {
    if (!BUCKET_NAME) {
      console.error("AWS_S3_BUCKET_NAME environment variable is not set");
      return null;
    }

    // Convert base64 to buffer
    // Remove data URL prefix if present (e.g., "data:image/png;base64,")
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    // Generate a unique filename
    const timestamp = Date.now();
    const filename = `screenshots/issue-${issueId}-${timestamp}.png`;
    const contentType = "image/png";

    // Upload to S3
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: filename,
      Body: buffer,
      ContentType: contentType,
      ACL: "public-read", // Make the image publicly accessible
    });

    await s3Client.send(command);

    // Construct the S3 URL
    const s3Url = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || "us-east-1"}.amazonaws.com/${filename}`;
    
    return s3Url;
  } catch (error) {
    console.error("Failed to upload screenshot to S3:", error);
    return null;
  }
}

