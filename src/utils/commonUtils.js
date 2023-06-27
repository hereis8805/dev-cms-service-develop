import moment from "moment";
import { parse } from "query-string";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export const isEmpty = (val) => val == null || !(Object.keys(val) || val).length;

export const stringToArray = (string) => {
  if (isEmpty(string) || !typeof string) {
    return [];
  }
  const stringSplit = string.split(";");
  const array = stringSplit.map((val) => val.trim());

  return array;
};

export const isDev = () => {
  return process.env.NODE_ENV === "development";
};

export const getExtension = (filename) => {
  const length = filename.length;

  const lastDot = filename.lastIndexOf(".");
  const fileExt = filename.substring(lastDot + 1, length);

  return fileExt;
};

export function getUrlQuery(search, key) {
  if (!search || !key) return "";

  const querys = parse(search);
  const targetQuery = querys[key] || "";

  return Array.isArray(targetQuery) ? targetQuery[0] : targetQuery;
}

export function getUrlQueryObject(search) {
  if (!search) return "";

  const querys = parse(search);

  return querys;
}

// YYYYMMDDHHMMSS 계산
export function getTimestamp() {
  const date = new Date();
  let year = date.getFullYear().toString();

  let month = date.getMonth() + 1;
  month = month < 10 ? "0" + month.toString() : month.toString();

  let day = date.getDate();
  day = day < 10 ? "0" + day.toString() : day.toString();

  let hour = date.getHours();
  hour = hour < 10 ? "0" + hour.toString() : hour.toString();

  let minites = date.getMinutes();
  minites = minites < 10 ? "0" + minites.toString() : minites.toString();

  let seconds = date.getSeconds();
  seconds = seconds < 10 ? "0" + seconds.toString() : seconds.toString();

  return year + month + day + hour + minites + seconds;
}

export function formatFloor(pNum) {
  return Math.floor(pNum);
}

export function isEmpty3(val) {
  if (
    val === "null" ||
    val === "NULL" ||
    val === "Null" ||
    val === "" ||
    val === null ||
    val === undefined ||
    (val !== null && typeof val === "object" && !Object.keys(val).length)
  ) {
    return true;
  } else {
    return false;
  }
}

export const nowDate = moment().format();

export const saveZip = (filename, urls) => {
  if (!urls) return;

  const zip = new JSZip();
  const folder = zip.folder("files"); // folder name where all files will be placed in

  urls.forEach((url) => {
    const blobPromise = fetch(url).then((r) => {
      if (r.status === 200) return r.blob();
      return Promise.reject(new Error(r.statusText));
    });
    const name = url.substring(url.lastIndexOf("/") + 1);
    folder.file(name, blobPromise);
  });

  zip.generateAsync({ type: "blob" }).then((blob) => saveAs(blob, filename));
};

export const saveFilesZip = (files, fileName) => {
  const zip = new JSZip();

  for (var i = 0; i < files.length; i++) {
    var f = files[i].file;
    zip.file(f.name, f);
  }
  zip.generateAsync({ type: "blob" }).then((blob) => saveAs(blob, fileName));
};
