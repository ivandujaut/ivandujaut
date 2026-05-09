import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // Validar que el locale del request sea uno soportado
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    // Cargar el archivo JSON de traducciones para el locale
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
