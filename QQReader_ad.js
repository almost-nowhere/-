// QQ阅读去广告：清空广告位/弹窗/广告配置（基于 2026-10-17 HAR 抓包自制）
// 匹配接口：common/adV3 · common/firstOpenApp/ad · common/remind/popup · com-ad/config
const AD_KEYS = /^(ads?|advert|windows|platforms|positions)$/i;

function clean(o) {
  if (Array.isArray(o)) {
    for (const x of o) clean(x);
    return;
  }
  if (o && typeof o === "object") {
    for (const k of Object.keys(o)) {
      if (AD_KEYS.test(k)) {
        o[k] = Array.isArray(o[k]) ? [] : null;
      } else if (k.toLowerCase() === "recswitch") {
        o[k] = 0;
      } else {
        clean(o[k]);
      }
    }
  }
}

let body = $response.body;
try {
  const obj = JSON.parse(body);
  clean(obj);
  body = JSON.stringify(obj);
} catch (e) {
  // 非 JSON 响应原样放行
}
$done({ body });
