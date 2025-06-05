"use client";

import { useState } from "react";

import AddToCart from "@/components/shared/product/add-to-cart";
import { AllSizes, Cart, Product } from "@/types";
import ProductPrice from "./product-price";
import Rating from "./rating";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import ProductSizes from "./product-sizes";

interface Props {
  product: Product;
  cart: Cart | undefined;
}

const ProductActions: React.FC<Props> = ({ product, cart }) => {
  const [selectedSize, setSelectedSize] = useState<AllSizes>("S");
  const { t } = useTranslation("product");
  const { t: commonT } = useTranslation();

  return (
    <>
      <div className="col-span-2 p-5">
        {/* Details Column */}
        <div className="flex flex-col gap-6">
          <p>
            {product.brand} {product.category}
          </p>
          <h1 className="h3-bold">{product.name}</h1>

          <Rating value={Number(product.rating)} />
          <p>
            {product.numReviews} {commonT("reviews")}
          </p>

          <ProductSizes
            product={JSON.parse(JSON.stringify(product))}
            selectedSize={selectedSize}
            onSizeSelect={setSelectedSize}
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <ProductPrice
              value={Number(product.price)}
              className="w-24 rounded-full bg-green-100 text-green-700 px-5 py-2"
            />
          </div>
          <div className="mt-10">
            <p className="font-semibold">{t("description")}</p>
            <p>{product.description}</p>
          </div>
        </div>
      </div>
      {/* Action Column */}
      <div>
        <Card>
          <CardContent className="p-4">
            <div className="mb-2 flex justify-between">
              <div>{commonT("price")}</div>
              <div>
                <ProductPrice value={Number(product.price)} />
              </div>
            </div>
            <div className="mb-2 flex justify-between">
              <div>{commonT("status")}</div>
              {product.stock > 0 ? (
                <Badge variant="outline">{commonT("inStock")}</Badge>
              ) : (
                <Badge variant="destructive">{commonT("notFound.stock")}</Badge>
              )}
            </div>
            <div className="flex-center">
              <AddToCart
                cart={cart}
                item={{
                  productId: product.id,
                  name: product.name,
                  slug: product.slug,
                  price: product.price,
                  qty: 1,
                  size: selectedSize,
                  image: product.images[0],
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ProductActions;
