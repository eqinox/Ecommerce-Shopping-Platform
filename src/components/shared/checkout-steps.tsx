import React from "react";
import { cn } from "@/lib/utils";

interface Props {
  current: number;
}
const CheckoutSteps: React.FC<Props> = ({ current = 0 }) => {
  return (
    <div className="flex-between flex-col space-x-2 md:flex-row space-y-2 mb-10">
      {["User Login", "Shipping Address", "Payment Method", "Place Order"].map(
        (step, index) => (
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
        )
      )}
    </div>
  );
};

export default CheckoutSteps;
