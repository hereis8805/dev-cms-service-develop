import AWS from "aws-sdk";

const BUCKET = "";
const FOLDER = "";

async function s3Upload({ file, bucket = "", key = "" }) {
  const s3 = new AWS.S3();

  const param = {
    Bucket: bucket || BUCKET,
    Key: (key || `${FOLDER}${file.name}`).normalize(),
    ACL: "public-read",
    Body: file,
    ContentType: file.type
  }; //s3 업로드에 필요한 옵션 설정

  const result = {
    success: false,
    data: null
  };

  try {
    const s3uploaded = await s3.upload(param).promise();

    result.success = true;
    result.file = file.name;
    result.data = s3uploaded;

    return result;
  } catch (err) {
    result.success = false;
    result.file = file.name;
    result.data = err;

    return result;
  }
}

export default s3Upload;
