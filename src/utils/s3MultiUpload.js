import s3Upload from "./s3Upload";

export default async function s3MultiUpload(files) {
  const funcResult = {
    success: false,
    results: []
  };

  try {
    const promises = await files.map(async (file) => {
      const result = await s3Upload(file);

      return result;
    });

    const results = await Promise.all(promises);

    funcResult.success = true;
    funcResult.results = results;

    return funcResult;
  } catch (err) {
    funcResult.success = false;
    funcResult.err = err;

    return funcResult;
  }
}
