import { S3Client, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

function getS3Client() {
  const endpoint = process.env.S3_ENDPOINT;
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
  const region = process.env.S3_REGION || "auto";

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    return null;
  }

  return new S3Client({
    endpoint,
    region,
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: false,
  });
}

let _client: S3Client | null | undefined;

export function s3() {
  if (_client === undefined) {
    _client = getS3Client();
  }
  return _client;
}

export function getBucket() {
  return process.env.S3_BUCKET || "";
}

export function isStorageConfigured() {
  return !!(
    process.env.S3_ENDPOINT &&
    process.env.S3_BUCKET &&
    process.env.S3_ACCESS_KEY_ID &&
    process.env.S3_SECRET_ACCESS_KEY
  );
}

export function generateStorageKey(folder: string, filename: string) {
  const ext = filename.split(".").pop() || "bin";
  const id = crypto.randomUUID().slice(0, 8);
  const safe = filename
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9-_]/g, "_")
    .slice(0, 40);
  return `${folder}/${id}-${safe}.${ext}`;
}

export type PresignedUploadResult = {
  url: string;
  fields: Record<string, string>;
  key: string;
};

export async function getPresignedUploadUrl(
  key: string,
  contentType: string,
  maxSizeMB = 5
): Promise<PresignedUploadResult> {
  const client = s3();
  if (!client) throw new Error("S3 storage is not configured");

  const bucket = getBucket();
  const { url, fields } = await createPresignedPost(client, {
    Bucket: bucket,
    Key: key,
    Expires: 3600,
    Conditions: [
      { bucket },
      ["eq", "$key", key],
      ["starts-with", "$Content-Type", contentType.split("/")[0] + "/"],
      ["content-length-range", 1000, maxSizeMB * 1_000_000],
    ],
  });

  return { url, fields, key };
}

export async function getPresignedDownloadUrl(
  key: string,
  expiresIn = 3600
): Promise<string> {
  const client = s3();
  if (!client) throw new Error("S3 storage is not configured");

  const command = new GetObjectCommand({
    Bucket: getBucket(),
    Key: key,
  });

  return getSignedUrl(client, command, { expiresIn });
}

export async function deleteObject(key: string): Promise<void> {
  const client = s3();
  if (!client) throw new Error("S3 storage is not configured");

  await client.send(
    new DeleteObjectCommand({
      Bucket: getBucket(),
      Key: key,
    })
  );
}

export function getImageProxyUrl(key: string) {
  return `/api/images/${encodeURIComponent(key)}`;
}
