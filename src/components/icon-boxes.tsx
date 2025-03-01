import { Card, CardContent } from "@/components/ui/card";
import { getServerTranslations } from "@/i18n/server";
import { DollarSign, Headset, ShoppingBag, WalletCards } from "lucide-react";

const IconBoxes = async () => {
  const { t } = await getServerTranslations("icon-boxes");
  return (
    <div>
      <Card>
        <CardContent className="grid gap-4 md:grid-cols-4 p-4 ">
          <div className="space-y-2">
            <ShoppingBag />
            <div className="text-sm font-bold">{t("freeShipping")}</div>
            <div className="text-sm text-muted-foreground">
              {t("freeShippingCondition")}
            </div>
          </div>
          <div className="space-y-2">
            <DollarSign />
            <div className="text-sm font-bold">{t("moneyBackGuarantee")}</div>
            <div className="text-sm text-muted-foreground">
              {t("moneyBackGuaranteeCondition")}
            </div>
          </div>
          <div className="space-y-2">
            <WalletCards />
            <div className="text-sm font-bold">{t("flexiblePayment")}</div>
            <div className="text-sm text-muted-foreground">
              {t("flexiblePaymentCondition")}
            </div>
          </div>
          <div className="space-y-2">
            <Headset />
            <div className="text-sm font-bold">{t("support")}</div>
            <div className="text-sm text-muted-foreground">
              {t("supportCondition")}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default IconBoxes;
