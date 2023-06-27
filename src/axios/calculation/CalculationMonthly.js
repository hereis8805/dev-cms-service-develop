import api from "../api";
import fileDownload from "js-file-download";

export function getMonthCps(data) {
  return api.get("cost/settlement/monthCps", { params: data });
}

export function getMonthCpsDeatil(data) {
  return api.get(`cost/settlement/monthCps/${data.param}`, { params: data });
}

export function patchMonthCpsRecalculates(data) {
  return api.patch(`/cost/settlement/monthCps/${data.param}/recalculates`, { ...data });
}

export async function getMonthCpsCsvExport(data) {
  /*
  api.get(`/cost/settlement/monthCps/${data.param}/csvExport`, { params: data, responseType: "blob" }).then((res) => {
    fileDownload(res.data, "정산서내역.csv");
  });
  return;
  */
  return await api.get(`/cost/settlement/monthCps/${data.param}/csvExport`, { params: data }).then((res) => {
    return res;
  });
}

export function getDeadlineProcess(data) {
  return api.patch(`cost/settlement/monthWorks/deadlineProcess`, { ...data });
}

export function getMonthWorks(data) {
  return api.get("cost/settlement/monthWorks", { params: data });
}

export function getMonthWorksDetail(data) {
  return api.get(`cost/settlement/monthWorks/${data.param}`, { params: data });
}
