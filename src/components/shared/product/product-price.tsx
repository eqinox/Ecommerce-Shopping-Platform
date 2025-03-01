import { getServerTranslations } from "@/i18n/server";
import { cn } from "@/lib/utils";

interface ProductPriceProps {
  value: number;
  className?: string;
}

const ProductPrice: React.FC<ProductPriceProps> = async ({
  value,
  className,
}) => {
  const { t } = await getServerTranslations();
  // Ensure two decimal places
  const stringValue = value.toFixed(2);
  // Get the int/float
  const [intValue, floatValue] = stringValue.split(".");

  return (
    <p className={cn("text-2xl", className)}>
      {intValue}
      <span className="text-xs align-super">.{floatValue}</span>
      <span className="text-sm">{t("currency")}</span>
    </p>
  );
};

export default ProductPrice;
