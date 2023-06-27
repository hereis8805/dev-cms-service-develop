import polyglotI18nProvider from "ra-i18n-polyglot";

import koreanMessages from "translate/koreanMessages";

const i18nProvider = polyglotI18nProvider(() => koreanMessages, "ko", {
  allowMissing: true,
});

export default i18nProvider;