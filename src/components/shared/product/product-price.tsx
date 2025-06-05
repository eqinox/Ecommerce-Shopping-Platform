"use client";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface ProductPriceProps {
  value: number;
  className?: string;
}

const ProductPrice: React.FC<ProductPriceProps> = ({ value, className }) => {
  const { t } = useTranslation();
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
