import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadSetupFileToS3(file: Express.Multer.File, userId: string) {
  const fileExtension = file.originalname.split(".").pop();
  const safeName = crypto.randomUUID();

  const key = `setups/${userId}/${safeName}.${fileExtension}`;
  const fileUrl = `https://${process.env.AWS_S3_BUCKET!}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    })
  );

  return {
    fileKey: key,
    fileUrl,
    fileName: file.originalname,
    fileSize: file.size,
  };
}

export async function deleteSetupFileFromS3(fileKey: string) {
    await s3.send(
        new DeleteObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET!,
            Key: fileKey,
        })
    );
}

export async function uploadProfileImageToS3(
  file: Express.Multer.File,
  userId: string
) {
  const fileExtension = file.originalname.split(".").pop();
  const safeName = crypto.randomUUID();

  const key = `profile-images/${userId}/${safeName}.${fileExtension}`;
  const fileUrl = `https://${process.env.AWS_S3_BUCKET!}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    })
  );

  // console.log("Sending photo...");

  return {
    imageKey: key,
    imageUrl: fileUrl,
  };
}