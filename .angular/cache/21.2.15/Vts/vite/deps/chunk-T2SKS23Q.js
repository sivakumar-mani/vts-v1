import {
  __async
} from "./chunk-N6ESDQJH.js";

// node_modules/@progress/kendo-licensing/dist/index.mjs
var e;
!(function(e2) {
  e2.BLAZOR = "BLAZOR", e2.DPL = "DPL", e2.JM = "JM", e2.KENDOUIANGULAR = "KENDOUIANGULAR", e2.KENDOUICOMPLETE = "KENDOUICOMPLETE", e2.KENDOUIMVC = "KENDOUIMVC", e2.KENDOUIREACT = "KENDOUIREACT", e2.KENDOUIVUE = "KENDOUIVUE", e2.MAUI = "MAUI", e2.RCAJAX = "RCAJAX", e2.RCWF = "RCWF", e2.RCWPF = "RCWPF", e2.REPORTING = "REPORTING", e2.REPORTSERVER = "REPORTSERVER", e2.UIASPCORE = "UIASPCORE", e2.UIXAM = "UIXAM", e2.WINUI = "WINUI";
})(e || (e = {})), Object.freeze({ [e.BLAZOR]: "Telerik UI for Blazor", [e.DPL]: "Telerik Document Processing", [e.JM]: "Telerik JustMock", [e.KENDOUIANGULAR]: "Kendo UI for Angular", [e.KENDOUICOMPLETE]: "Kendo UI for jQuery", [e.KENDOUIMVC]: "Telerik UI for ASP.NET MVC", [e.KENDOUIREACT]: "KendoReact", [e.KENDOUIVUE]: "Kendo UI for Vue", [e.MAUI]: "Telerik UI for .NET MAUI", [e.RCAJAX]: "Telerik UI for ASP.NET AJAX", [e.RCWF]: "Telerik UI for WinForms", [e.RCWPF]: "Telerik UI for WPF", [e.REPORTING]: "Telerik Reporting", [e.REPORTSERVER]: "Telerik Report Server", [e.UIASPCORE]: "Telerik UI for ASP.NET Core", [e.UIXAM]: "Telerik UI for Xamarin", [e.WINUI]: "Telerik UI for WinUI" });
function t(e2) {
  return Math.floor(e2.getTime() / 1e3);
}
function n(e2, n2) {
  const i2 = new Date(1e3 * e2);
  return i2.setDate(i2.getDate() + n2), t(i2);
}
function i() {
  return t(/* @__PURE__ */ new Date());
}
function o(e2) {
  const t2 = (function(e3) {
    if ("function" == typeof atob) return atob(e3);
    if ("function" == typeof Buffer) return Buffer.from(e3, "base64").toString("utf8");
    throw new Error("atob is undefined");
  })(e2), n2 = new Uint8Array(t2.length);
  for (let e3 = 0; e3 < t2.length; e3++) n2[e3] = t2.charCodeAt(e3);
  return n2;
}
function r(e2) {
  return o(e2.replace(/-/g, "+").replace(/_/g, "/"));
}
function s(e2) {
  return new Date(1e3 * e2);
}
function c(e2, t2) {
  const n2 = s(t2);
  return e2 > new Date(n2.getFullYear(), n2.getMonth(), n2.getDate() + 1).getTime() / 1e3;
}
function a(e2, t2) {
  let o2 = [];
  return e2.licenses?.length > 0 ? o2 = e2.licenses.map((e3) => (function(e4) {
    const t3 = e4.split(".")[1], n2 = String.fromCharCode(...r(t3));
    return JSON.parse(n2);
  })(e3)) : e2.products?.length > 0 && (o2 = e2.products.map((t3) => ({ type: t3.trial ? "trial" : "perpetual", code: t3.code, expiration: t3.licenseExpirationDate, licenseId: null, userId: e2.userId }))), (function(e3, t3) {
    const o3 = t3.filter((e4) => "usage" !== e4.type).filter((t4) => e3.productCode === t4.code || e3.redistributedBy?.includes(t4.code) || e3.productCodes?.includes(t4.code)).sort((e4, t4) => t4.expiration - e4.expiration);
    return o3.find((e4) => "subscription" === e4.type && !c(i(), e4.expiration)) || o3.find((t4) => "perpetual" === t4.type && !c(e3.publishDate, t4.expiration)) || o3.find((e4) => "subscription" === e4.type && !c(n(i(), 10), e4.expiration)) || o3.find((e4) => "trial" === e4.type && !c(i(), e4.expiration)) || o3.find((e4) => "subscription" === e4.type) || o3.find((e4) => "perpetual" === e4.type) || o3.find((e4) => "trial" === e4.type);
  })(t2, o2);
}
var l = (e2) => e2.productCode || e2.productCodes[0];
function u(e2, t2, n2, i2) {
  const o2 = "kendoLicensingMessage";
  let r2 = () => {
  };
  const s2 = new CustomEvent(o2, { detail: { message: e2, productCode: t2 }, cancelable: true });
  if (!!document.documentElement.dispatchEvent(s2)) {
    const e3 = (e4) => {
      e4.detail.productCode !== t2 && n2({ message: e4.detail.message, productCode: e4.detail.productCode }), e4.preventDefault();
    };
    document.documentElement.addEventListener(o2, e3), r2 = () => {
      document.documentElement.removeEventListener(o2, e3);
    }, i2();
  }
  return r2;
}
var p = Object.freeze({ name: "key", content: '\n        <svg\n            width="32"\n            height="32"\n            viewBox="0 0 32 32"\n            fill="none"\n            xmlns="http://www.w3.org/2000/svg"\n        >\n            <path\n            fillRule="evenodd"\n            clipRule="evenodd"\n            d="M22.702 2.1821C24.3149 2.51082 25.8077 3.27291 27.0199 4.38645C28.2321 5.49999 29.1179 6.92286 29.582 8.5021C30.012 9.9501 30.076 11.4821 29.768 12.9621C29.3228 14.9898 28.2025 16.8063 26.5904 18.1143C24.9783 19.4223 22.9699 20.1443 20.894 20.1621C20.018 20.1621 19.146 20.0361 18.308 19.7821L16.708 21.6581L15.95 22.0081H14V25.0081L13 26.0081H10V29.0081L9 30.0081H3L2 29.0081V24.3941L2.292 23.6881L12.24 13.7401C11.9577 12.8308 11.8226 11.8821 11.84 10.9301C11.8582 9.59817 12.1701 8.28666 12.7533 7.08907C13.3365 5.89147 14.1767 4.83728 15.214 4.00164C16.2514 3.166 17.4603 2.56949 18.7546 2.25464C20.0489 1.93978 21.3967 1.91633 22.702 2.1821ZM25.338 16.5821C26.5944 15.5647 27.4681 14.1509 27.816 12.5721L27.824 12.5821C28.0718 11.4277 28.0272 10.2297 27.6943 9.09691C27.3614 7.96412 26.7507 6.93248 25.9177 6.09572C25.0847 5.25896 24.0558 4.64361 22.9246 4.30557C21.7933 3.96753 20.5955 3.91753 19.44 4.1601C17.8816 4.506 16.4837 5.36334 15.4688 6.59561C14.454 7.82789 13.8806 9.36426 13.84 10.9601C13.82 11.8721 13.98 12.7761 14.318 13.6201L14.098 14.7061L4 24.8081V28.0081H8V25.0081L9 24.0081H12V21.0081L13 20.0081H15.49L17.242 17.9761L18.364 17.6961C19.1728 18.0121 20.0337 18.1736 20.902 18.1721C22.5181 18.1597 24.082 17.5991 25.338 16.5821ZM23.662 11.1181C23.8197 10.9002 23.9318 10.6527 23.9916 10.3905C24.0515 10.1283 24.0578 9.85665 24.0103 9.59192C23.9627 9.32718 23.8622 9.07476 23.7148 8.84975C23.5675 8.62474 23.3762 8.43177 23.1526 8.28238C22.9289 8.133 22.6774 8.03026 22.4131 7.98033C22.1488 7.93039 21.8771 7.93428 21.6144 7.99176C21.3516 8.04925 21.1031 8.15914 20.8838 8.31487C20.6645 8.4706 20.4789 8.66896 20.338 8.8981C20.067 9.33887 19.9774 9.86752 20.088 10.373C20.1985 10.8784 20.5007 11.3214 20.931 11.6087C21.3613 11.8961 21.8862 12.0055 22.3954 11.914C22.9047 11.8226 23.3587 11.5373 23.662 11.1181Z"\n            fill="black"\n            />\n            <path\n            d="M23.1299 16.0186L31.1387 31.0273L31.0068 31.25H14.9932L14.8604 31.0273L22.8955 16.0186H23.1299Z"\n            fill="#FFC000"\n            stroke="black"\n            strokeWidth="1.5"\n            />\n            <rect x="22.25" y="21.2686" width="1.5" height="5" rx="0.75" fill="black" />\n            <path\n            d="M24 28.2686C24 27.7163 23.5523 27.2686 23 27.2686C22.4479 27.2687 22 27.7164 22 28.2686C22 28.8207 22.4479 29.2684 23 29.2686C23.5523 29.2686 24 28.8208 24 28.2686Z"\n            fill="black"\n            />\n        </svg>\n    ' });
var d = Object.freeze({ name: "trial-tag", content: '\n        <svg\n            width="38"\n            height="38"\n            viewBox="0 0 38 38"\n            fill="none"\n            xmlns="http://www.w3.org/2000/svg"\n        >\n            <g clipPath="url(#clip0)">\n            <path\n                d="M24.9056 7.60146L34.4998 10.1722L31.9299 19.7659L13.7653 30.2532L6.7419 18.0883L24.9056 7.60146Z"\n                stroke="black"\n                strokeWidth="1.75"\n            />\n            <path\n                d="M13.0913 19.7635L15.4762 23.8942L14.6279 24.384L12.2431 20.2533L13.0913 19.7635ZM14.3623 19.0297L14.7473 19.6964L11.3769 21.6423L10.992 20.9756L14.3623 19.0297ZM14.8475 18.7496L16.388 17.8602C16.7038 17.6778 17.0025 17.5684 17.2841 17.532C17.5675 17.4944 17.8242 17.5328 18.0542 17.6472C18.2841 17.7616 18.4772 17.954 18.6333 18.2244C18.7611 18.4457 18.833 18.6576 18.8491 18.8602C18.866 19.0598 18.8369 19.2518 18.7619 19.4364C18.6876 19.6179 18.5778 19.7923 18.4322 19.9596L18.2446 20.257L16.9055 21.0301L16.5166 20.3695L17.5124 19.7946C17.6618 19.7083 17.7704 19.6103 17.8381 19.5006C17.9059 19.3909 17.9371 19.2745 17.9317 19.1516C17.9281 19.0275 17.8903 18.9031 17.8183 18.7782C17.7418 18.6458 17.6512 18.5456 17.5463 18.4775C17.4415 18.4095 17.3242 18.3788 17.1944 18.3857C17.0647 18.3925 16.9242 18.4395 16.7729 18.5269L16.0835 18.9249L18.0834 22.3889L17.2323 22.8803L14.8475 18.7496ZM19.5417 21.547L17.5367 20.2496L18.4328 19.7247L20.4294 20.9815L20.4523 21.0212L19.5417 21.547ZM19.4746 16.0781L21.8595 20.2088L21.0112 20.6986L18.6264 16.5679L19.4746 16.0781ZM22.4103 15.3251L23.2638 19.398L22.3588 19.9205L21.5088 14.9037L22.0847 14.5712L22.4103 15.3251ZM25.3207 18.2105L22.2174 15.4365L21.7187 14.7825L22.3003 14.4467L26.2285 17.6864L25.3207 18.2105ZM24.3818 16.7023L24.7668 17.369L22.5851 18.6286L22.2002 17.9619L24.3818 16.7023ZM28.8837 15.2683L29.267 15.9321L27.1874 17.1327L26.8041 16.4689L28.8837 15.2683ZM25.0778 12.8432L27.4626 16.9739L26.6115 17.4652L24.2267 13.3345L25.0778 12.8432Z"\n                fill="black"\n            />\n            <circle\n                cx="30.1049"\n                cy="12.7084"\n                r="1.12128"\n                transform="rotate(15 30.1049 12.7084)"\n                fill="black"\n            />\n            </g>\n            <path\n            d="M27.6201 19.7998L35.6016 34.7578L35.499 34.9316H19.542L19.4385 34.7578L27.4463 19.7998H27.6201Z"\n            fill="#FFC000"\n            stroke="black"\n            strokeWidth="1.6"\n            />\n            <rect x="26.7705" y="25" width="1.5" height="5" rx="0.75" fill="black" />\n            <path\n            d="M28.5205 32C28.5205 31.4477 28.0728 31 27.5205 31C26.9684 31.0002 26.5205 31.4478 26.5205 32C26.5205 32.5522 26.9684 32.9998 27.5205 33C28.0728 33 28.5205 32.5523 28.5205 32Z"\n            fill="black"\n            />\n            <defs>\n            <clipPath id="clip0">\n                <rect\n                width="30"\n                height="31.1538"\n                fill="white"\n                transform="translate(8.06323) rotate(15)"\n                />\n            </clipPath>\n            </defs>\n        </svg>\n    ' });
var h = Object.freeze({ name: "recurring-payment", content: '\n        <svg\n            width="32"\n            height="32"\n            viewBox="0 0 32 32"\n            fill="none"\n            xmlns="http://www.w3.org/2000/svg"\n        >\n            <path\n            d="M27.8295 9.38659C28.8049 12.1653 28.7404 15.1391 27.774 17.7996C26.8014 20.4767 24.9215 22.8356 22.2691 24.367C19.7765 25.8061 16.9908 26.2908 14.3393 25.9323C11.6293 25.5682 9.06228 24.3215 7.08577 22.3155L8.23679 21.1826C9.95578 22.9294 12.1925 24.0142 14.5527 24.333C16.8583 24.6438 19.2821 24.2206 21.457 22.965C23.7719 21.6284 25.4118 19.5739 26.2565 17.2495C27.0643 15.0253 27.1474 12.5486 26.3976 10.2107L24.951 11.0459L25.5942 7.15112L29.2888 8.54145L27.8284 9.38462L27.8295 9.38659Z"\n            fill="black"\n            />\n            <path\n            fillRule="evenodd"\n            clipRule="evenodd"\n            d="M16.3594 8.08301C17.1842 8.16959 17.8382 8.41741 18.3281 8.8252C18.8135 9.2331 19.1263 9.78023 19.2607 10.4639L17.2939 10.6875C17.1732 10.1497 16.8607 9.78518 16.3594 9.59375V12.2617C17.6035 12.5557 18.4514 12.9408 18.9004 13.4102C19.3516 13.8819 19.5771 14.4863 19.5771 15.2246C19.5771 16.0494 19.2949 16.7425 18.7275 17.3076C18.1601 17.8728 17.3712 18.2233 16.3594 18.3623V19.6387H15.2334V18.3779C14.3448 18.2822 13.6246 17.9934 13.0664 17.5059C12.5081 17.0182 12.155 16.3275 12 15.4365L14.0127 15.2266C14.0947 15.5912 14.2497 15.9036 14.4775 16.168C14.7053 16.4321 14.9555 16.6218 15.2334 16.7402V13.8799C14.2264 13.6247 13.4906 13.2395 13.0234 12.7246C12.554 12.2073 12.3164 11.5801 12.3164 10.8418C12.3165 10.0946 12.5834 9.46575 13.1143 8.95996C13.6452 8.45184 14.3516 8.16053 15.2334 8.08301V7C15.6731 7 15.9197 7 16.3594 7V8.08301ZM16.3574 16.8535H16.3594C16.7467 16.7783 17.0661 16.6149 17.3076 16.3643C17.5537 16.1113 17.6738 15.8147 17.6738 15.4707C17.6738 15.1677 17.5715 14.9033 17.3643 14.6846C17.1615 14.4636 16.8267 14.2943 16.3574 14.1758V16.8535ZM15.2334 9.56836C14.9304 9.66408 14.6911 9.82132 14.5156 10.04C14.3379 10.2588 14.252 10.5004 14.252 10.7646C14.252 11.0062 14.3314 11.2301 14.4932 11.4375C14.655 11.6424 14.9038 11.8113 15.2363 11.9365V9.56836H15.2334Z"\n            fill="black"\n            />\n            <path\n            d="M2.71127 18.5075L4.18352 17.6575C3.21672 14.9028 3.27173 11.9581 4.21167 9.31563C5.17535 6.60942 7.06671 4.22018 9.74281 2.67513C12.0972 1.31581 14.709 0.807832 17.2232 1.05612C19.8041 1.3106 22.2798 2.36266 24.2693 4.10853L23.7361 4.71636L23.2029 5.32418C23.1532 5.27918 23.1016 5.23531 23.0511 5.19342C21.3484 3.75295 19.2504 2.88549 17.0678 2.66937C14.8802 2.45355 12.6065 2.89529 10.5561 4.07914C8.2194 5.42821 6.56974 7.50687 5.7328 9.85834C4.94555 12.068 4.87307 14.5175 5.61235 16.8326L6.69304 16.2087L6.98491 16.4014L6.40585 19.8979L2.71127 18.5075Z"\n            fill="black"\n            />\n            <path\n            d="M23.0996 15.7998L31.0811 30.7578L30.9785 30.9316H15.0215L14.918 30.7578L22.9258 15.7998H23.0996Z"\n            fill="#FFC000"\n            stroke="black"\n            strokeWidth="1.6"\n            />\n            <rect x="22.25" y="21" width="1.5" height="5" rx="0.75" fill="black" />\n            <path\n            d="M24 28C24 27.4477 23.5523 27 23 27C22.4479 27.0002 22 27.4478 22 28C22 28.5522 22.4479 28.9998 23 29C23.5523 29 24 28.5523 24 28Z"\n            fill="black"\n            />\n        </svg>\n    ' });
var f = class {
  constructor(e2, t2, n2, i2) {
    this.productName = e2, this.severity = "WARN", this.code = "TKL201", this.notificationIcon = p, this.message = "No Telerik and Kendo UI License found.\n  To download a license key file, visit https://prgress.co/3PwQMKZ", this.notificationMessage = `License key missing for ${e2} v${n2}.  A license key is required for both paid and trial usage. Learn <a href="${i2}">how to set up a license key</a>.`, this.notificationTitle = `License key missing for ${e2} v${n2}.`, this.notificationBody = "A license key is required for both paid and trial usage.", this.callToAction = { link: `https://www.telerik.com/download?utm_source=no_license_watermark&utm_campaign=${t2.toLowerCase()}&utm_content=no_license_key_found`, message: "Start Free Trial" };
  }
};
var C = class {
  constructor(e2, t2, n2, i2) {
    this.productName = e2, this.severity = "WARN", this.code = "TKL202", this.notificationIcon = p, this.message = `${e2} is not listed in your current license file.
  Learn more about ${e2} licensing at ${i2}`, this.notificationMessage = `No license found for ${e2} v${n2}.  Access to the latest updates and support requires a <a href="${i2}">valid license</a>.`, this.notificationTitle = `No license found for ${e2} v${n2}`, this.notificationBody = "To use this product and access updates and support you need to buy and install a valid license.", this.callToAction = { link: `https://www.telerik.com/purchase.aspx?utm_source=no_license_watermark&utm_campaign=${t2.toLowerCase()}&utm_content=no_license_key_current_product`, message: "Buy Now" };
  }
};
var L = class {
  constructor(e2, t2, n2, i2) {
    this.productName = e2, this.severity = "WARN", this.code = "TKL203", this.notificationIcon = d, this.message = `Your trial has expired ${i2} day(s) ago.
  Thank you for trying out ${e2}, we hope you enjoyed your trial period.
  To continue using our product, consider upgrading to a commercial license: https://prgress.co/3C9mr1M`, this.notificationMessage = `Your trial license for ${e2} v${n2} has expired ${i2} ago. To continue using our product, consider upgrading to a commercial license. Learn more about <a href="https://prgress.co/3PwQMdX">${e2} licensing</a>.`, this.notificationTitle = `Your trial license for ${e2} has expired.`, this.notificationBody = "To continue using the product you need to buy a subscription.", this.callToAction = { link: `https://www.telerik.com/purchase.aspx?utm_source=no_license_watermark&utm_campaign=${t2.toLowerCase()}&utm_content=trial_expired`, message: "Buy Now" };
  }
};
var m = class {
  constructor(e2, t2, n2, i2, o2, r2) {
    this.productName = e2, this.severity = "WARN", this.code = "TKL204", this.notificationIcon = p;
    const s2 = i2 ? ` version ${i2}` : "";
    this.message = `Your current license has expired on ${n2.toLocaleDateString()} and is not valid for ${e2}${s2}. The product was published on ${o2.toLocaleDateString()}.
  Renew your license at https://prgress.co/3Px9m5F`, this.notificationMessage = `Your license is not valid for ${e2} v${i2}. To continue using the product, install a <a href="${r2}">valid license</a>. Renew <a href="https://prgress.co/3PwQNi1">your license</a> and download a new license key.`, this.notificationTitle = `Your license doesn't cover ${e2} v${i2}`, this.notificationBody = "To access the latest version and updates you need to renew your license.", this.callToAction = { link: `https://www.telerik.com/account/your-licenses?utm_source=no_license_watermark&utm_campaign=${t2.toLowerCase()}&utm_content=perpertual_newer_version`, message: "Renew Now" };
  }
};
var g = class {
  constructor(e2, t2, n2) {
    this.productName = e2, this.severity = "WARN", this.code = "TKL204", this.notificationIcon = h, this.message = `Your ${e2} subscription has expired on ${n2.toLocaleDateString()}. To continue using the product, please renew your subscription at https://prgress.co/3Px9m5F and download a new license key.`, this.notificationMessage = `Your ${e2} subscription has expired. To continue using the product, please <a href="https://prgress.co/3PwQMut">renew your subscription</a> and download a new license key.`, this.notificationTitle = `Your ${e2} subscription has expired.`, this.notificationBody = "To continue using the product you need to renew your subscription.", this.callToAction = { link: `https://www.telerik.com/account/your-licenses?utm_source=no_license_watermark&utm_campaign=${t2.toLowerCase()}&utm_content=subscription_expired`, message: "Renew Now" };
  }
};
var w = class {
  constructor(e2, t2, n2, i2) {
    this.productName = e2, this.severity = "INFO", this.notificationIcon = d, this.message = `Your Trial license will expire in ${-i2} day(s).
  To acquire a commercial license, visit https://prgress.co/3PyHIoH`, this.notificationTitle = `Active trial for ${e2} v${n2}`, this.notificationBody = `Your trial will expire in ${-i2} day(s).`, this.callToAction = { link: `https://www.telerik.com/purchase.aspx?utm_source=no_license_watermark&utm_campaign=${t2.toLowerCase()}&utm_content=active_trial`, message: "Buy now" };
  }
};
function y(e2, t2) {
  return __async(this, null, function* () {
    if ("object" != typeof crypto || "object" != typeof crypto.subtle || "function" != typeof TextEncoder || "function" != typeof TextDecoder) return;
    const n2 = crypto.subtle, [i2, s2, c2] = e2.split("."), a2 = r(c2), l2 = new TextEncoder(), u2 = new TextDecoder(), p2 = l2.encode(`${i2}.${s2}`), d2 = u2.decode(r(i2));
    if (!("Telerik License Evidence" === JSON.parse(d2).typ)) throw new Error("Unknown license evidence type");
    const h2 = yield (function(e3) {
      const t3 = o(e3.replace("-----BEGIN PUBLIC KEY-----", "").replace("-----END PUBLIC KEY-----", "").replace(/\n/gm, ""));
      return crypto.subtle.importKey("spki", t3, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, true, ["verify"]);
    })(t2);
    if (!(yield n2.verify(h2.algorithm, h2, a2, p2))) throw new Error("Invalid license evidence");
  });
}
var k = { data: "  {}  " };
var I = /* @__PURE__ */ new Map();
var v = /* @__PURE__ */ new Set();
var E = true;
function N(e2) {
  const o2 = JSON.parse(k.data), r2 = !o2.scriptKey && !o2.timestamp, u2 = o2.scriptKey && "undefined" == typeof KendoLicensing, p2 = l(e2);
  let d2, h2, v2 = false;
  if (r2 || u2 || !((e3) => (e3.licenses?.length > 0 && Promise.all(e3.licenses?.map((e4) => y(e4, "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2mnUVMmkth2x+N/ODszG\nOFIYBL6NOO1XWRj1wkmecKuLziJDhFz0WQmyOjY34Ymg9pLuBA9QSWrrZuvPw40N\nm0X/GBmttFmPNvca3WmJ2oKM7PpLiUU9f7Ov5WeIXnx++ts/LC/OB7FtZ+LiRgJ7\n0mZnPeTogdFrASf0zSQJv4jmX840LPa6nomWeUgIVGPLLVI14Gib8Dl+nOckqCNc\nkAUUk4IBF67DufRt9zQyRxg99ysakvHX2SDbdGvIBdxWxvhhmrBoeix0uSVtG2gm\njdvSqlPJVdvMbk1Xe2+SUldJPrxH1VrTYeRUt4yqWxy16nFJUDj9exZ202X4THkU\nJQIDAQAB\n-----END PUBLIC KEY-----"))).then(() => {
    E = true;
  }).catch(() => {
    E = false, I.clear();
  }), E))(o2)) d2 = new f(e2.productName, p2, e2.version, e2.licensingDocsUrl);
  else if (h2 = a(o2, e2), h2) {
    if ("trial" === h2.type) {
      const n2 = (function(e3) {
        const n3 = i() - t(e3);
        return Math.floor(n3 / 86400);
      })(s(h2.expiration));
      c(i(), h2.expiration) ? d2 = new L(e2.productName, p2, e2.version, n2) : (d2 = new w(e2.productName, p2, e2.version, n2), v2 = true);
    } else if ("perpetual" === h2.type) {
      const t2 = h2.expiration;
      c(e2.publishDate, t2) ? d2 = new m(e2.productName, p2, s(h2.expiration), e2.version, s(e2.publishDate), e2.licensingDocsUrl) : v2 = true;
    } else if ("subscription" === h2.type) {
      let t2 = h2.expiration;
      "subscription" === h2.type && (t2 = n(t2, 10)), o2.timestamp && c(o2.timestamp, t2) ? d2 = new g(e2.productName, p2, s(h2.expiration)) : v2 = true;
    }
  } else d2 = new C(e2.productName, p2, e2.version, e2.licensingDocsUrl);
  const T = h2, N2 = T?.expiration ? s(T.expiration) : void 0;
  return { isLicenseValid: v2, licenseType: h2?.type, licenseProductCode: T?.code, expiration: N2, message: d2 };
}
function A(e2) {
  if (I.has(e2.name)) return I.get(e2.name);
  const { isLicenseValid: t2, message: n2 } = N(e2), i2 = l(e2);
  return n2 && !v.has(i2) && (!(function(e3, t3) {
    if ("object" == typeof console) {
      const i3 = `[${e3.severity}][Telerik and Kendo UI Licensing]` + (n3 ? ` ${n3}:` : "") + ` ${t3.productName}`, o2 = "function" == typeof console.group;
      o2 ? console.group(i3) : console.warn(i3), console.warn(e3.message), o2 && console.groupEnd();
    }
    var n3;
  })(n2, e2), v.add(i2)), I.set(e2.name, t2), t2;
}

export {
  u,
  N,
  A
};
//# sourceMappingURL=chunk-T2SKS23Q.js.map
