import { getServerTranslations } from "@/i18n/server";
import { APP_NAME } from "@/lib/constants";

const Footer = async () => {
  const { t } = await getServerTranslations();
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t">
      <div className="p-5 flex-center">
        {currentYear} {APP_NAME}. {t("allRightsReserved")}
      </div>
    </footer>
  );
};

export default Footer;
