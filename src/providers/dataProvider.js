import { fetchUtils } from "ra-core";
import simpleRestProvider from "ra-data-simple-rest";
import { format } from "date-fns";

import { formatNumber } from "utils/string";

const dataProvider = simpleRestProvider(process.env.REACT_APP_API_PATH, fetchUtils.fetchJson, "X-Total-Count");

// 상태값 변환
function getStatus(status) {
  if (status === 0) return "대기";

  if (status === 2 || status === 1) return "완료"; //check

  return "실패";
}

function getCpId(contentCpMappings) {
  return contentCpMappings.map((item) => item.cp_id);
}

// 소수점 버리기
function formatFloor(pNum) {
  return Math.floor(pNum);
}

const customDataProvider = {
  ...dataProvider,

  // getOne: async (resource, params) => {
  //   const response = await dataProvider.getOne(resource, params);
  //   console.log("resource : ", resource);
  //   try {
  //     // 정산조회_CP별(월별)
  //     if (resource === "cost/settlement/monthCps") {
  //       return {
  //         ...response,
  //         data: response.data.map((item, i) => {
  //           return {
  //             ...item,
  //             id: item.GCD_IDX,
  //             GRD_NET_AMOUNT: formatNumber(formatFloor(item.GRD_NET_AMOUNT)),
  //             GRD_TOTAL_AMOUNT: formatNumber(formatFloor(item.GRD_TOTAL_AMOUNT)),
  //             GCD_AMOUNT: formatNumber(formatFloor(item.GCD_AMOUNT))
  //             // isGroup: item.groups.length > 0 ? "그룹" : "단일"
  //           };
  //         })
  //       };
  //     }
  //   } catch (err) {
  //     return dataProvider.getOne(resource, params);
  //   }
  // },
  getList: async (resource, params) => {
    try {
      const response = await dataProvider.getList(resource, params);

      // return {data:[{id:1}], total:3};

      // 작품관리

      if (resource === "information/work/list") {
        console.log("information/work/list");
        return {
          ...response,
          data: response.data.map((item) => {
            return {
              ...item,
              id: item.IDX
              // flag_exist_attach_files_text: getStatus(item.flag_exist_attach_files),
              // status_sending_text: getStatus(item.status_sending),
              // format_date_create: format(new Date(item.date_create), "yyyy-MM-dd")
            };
          })
        };
      }

      // 정산메일전송
      if (resource === "mail") {
        return {
          ...response,
          data: response.data.map((item) => {
            return {
              ...item,
              flag_exist_attach_files_text: getStatus(item.flag_exist_attach_files),
              status_sending_text: getStatus(item.status_sending),
              format_date_create: format(new Date(item.date_create), "yyyy-MM-dd")
            };
          })
        };
      }

      // 정산메일콘텐츠
      if (resource === "mailContent") {
        return {
          ...response,
          data: response.data.map((item) => {
            return {
              ...item,
              cp_type_text: item.cp_type_code === "P" ? "개인" : "사업자"
            };
          })
        };
      }

      // 정산용 컨텐츠
      if (resource === "calculation-content") {
        return {
          ...response,
          data: response.data.map((item) => {
            return {
              ...item,
              // cp_ids: getCpId(item.CalcContentCpMapping)
              id: item.GCM_IDX,
              cpCnt: item.cps.length,
              isGroup: item.isGroup.length > 0 ? "그룹" : "단일"
            };
          })
        };
      }

      // 정산데이터 내역
      if (resource === "cost/settlement/datas") {
        return {
          ...response,
          data: response.data.map((item, i) => {
            return {
              ...item,
              id: item.GRF_IDX
              // isGroup: item.groups.length > 0 ? "그룹" : "단일"
            };
          })
        };
      }

      // 정산조회 종합
      if (resource === "cost/settlement/integrations") {
        return {
          ...response,
          data: response.data.map((item, i) => {
            return {
              ...item,
              id: item.GCD_IDX,
              GCD_AMOUNT: formatNumber(formatFloor(item.GCD_AMOUNT)),
              TOTAL_AMOUNT_SUM: formatNumber(formatFloor(item.TOTAL_AMOUNT_SUM)),
              NET_AMOUNT_SUM: formatNumber(formatFloor(item.NET_AMOUNT_SUM))
              // isGroup: item.groups.length > 0 ? "그룹" : "단일"
            };
          })
        };
      }

      // 정산조회_작품별(월별)
      if (resource === "cost/settlement/monthWorks") {
        return {
          ...response,
          data: response.data?.list?.map((item, i) => {
            return {
              ...item,
              id: item.row_num,
              NET_AMOUNT_SUM: formatNumber(formatFloor(item.NET_AMOUNT_SUM)),
              TOTAL_AMOUNT_SUM: formatNumber(formatFloor(item.TOTAL_AMOUNT_SUM)),
              AMOUNT_SUM: formatNumber(formatFloor(item.AMOUNT_SUM))
              // isGroup: item.groups.length > 0 ? "그룹" : "단일"
            };
          })
        };
      }

      // 정산조회_CP별(월별)
      if (resource === "cost/settlement/monthCps") {
        return {
          ...response,
          data: response.data.map((item, i) => {
            return {
              ...item,
              id: item.GCD_IDX,
              GRD_NET_AMOUNT: formatNumber(formatFloor(item.GRD_NET_AMOUNT)),
              GRD_TOTAL_AMOUNT: formatNumber(formatFloor(item.GRD_TOTAL_AMOUNT)),
              GCD_AMOUNT: formatNumber(formatFloor(item.GCD_AMOUNT))
              // isGroup: item.groups.length > 0 ? "그룹" : "단일"
            };
          })
        };
      }

      //플랫폼 목록 조회
      if (resource === "information/platform/list") {
        return {
          ...response,
          data: response.data.map((item) => {
            return {
              ...item,
              id: item.GP_IDX
            };
          })
        };
      }

      //CP 목록 조회
      // if (resource === "information/cp/list") {
      //   return {
      //     ...response,
      //     data: response.data.map((item) => {
      //       return {
      //         ...item,
      //         id: item.IDX
      //       };
      //     })
      //   };
      // }

      // 선급원가 내역
      if (resource === "mgPayoutDetails") {
        return {
          ...response,
          data: response.data.map((item) => ({
            ...item,
            amount_text: formatNumber(item.amount)
          }))
        };
      }

      // 선급원가 내역
      if (resource === "contentProvider") {
        return {
          ...response,
          data: response.data.map((item, i) => {
            return {
              ...item,
              id: item.GCD_IDX,
              isGroup: item.groups.length > 0 ? "그룹" : "단일"
            };
          })
        };
      }

      if (resource === "platform") {
        return {
          ...response,
          data: response.data.map((item) => {
            return {
              ...item,
              id: item.GP_IDX
            };
          })
        };
      }

      if (resource === "platformGroup") {
        return {
          ...response,
          data: response.data.map((item) => {
            return {
              ...item,
              id: item.GPG_IDX
            };
          })
        };
      }

      return response;
    } catch (err) {
      return dataProvider.getList(resource, params);
    }
  }
};

export default customDataProvider;
