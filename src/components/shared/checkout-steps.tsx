import React from "react";
import { cn } from "@/lib/utils";
import { getServerTranslations } from "@/i18n/server";

interface Props {
  current: number;
}
const CheckoutSteps: React.FC<Props> = async ({ current = 0 }) => {
  const { t } = await getServerTranslations();
  return (
    <div className="flex-between flex-col space-x-2 md:flex-row space-y-2 mb-10">
      {[
        t("userLogin"),
        t("shippingAddress"),
        t("payment.method"),
        t("placeOrder"),
      ].map((step, index) => (
        <React.Fragment key={step}>
          <div
            className={cn(
              "p-2 w-56 rounded-full text-center text-sm",
              index === current ? "bg-secondary" : ""
            )}
          >
            {step}
          </div>
          {step !== "Place Order" && (
            <hr className="w-16 border-t border-gray-300 mx-2" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CheckoutSteps;
