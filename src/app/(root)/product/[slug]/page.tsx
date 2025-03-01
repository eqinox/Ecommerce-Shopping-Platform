import { notFound } from "next/navigation";

import { getProductBySlug } from "@/lib/actions/product.actions";
import { Card, CardContent } from "@/components/ui/card";
import ProductPrice from "@/components/shared/product/product-price";
import { Badge } from "@/components/ui/badge";
import ProductImages from "@/components/shared/product/product-images";
import AddToCart from "@/components/shared/product/add-to-cart";
import { getMyCart } from "@/lib/actions/cart.actions";
import { auth } from "@/auth";
import ReviewList from "./review-list";
import Rating from "@/components/shared/product/rating";
import { getServerTranslations } from "@/i18n/server";

interface Props {
  params: Promise<{ slug: string }>;
}

const ProductDetailsPage: React.FC<Props> = async (props) => {
  const { t } = await getServerTranslations("product");
  const { t: commonT } = await getServerTranslations();
  const session = await auth();
  const userId = session?.user?.id;

  const { slug } = await props.params;

  const product = await getProductBySlug(slug);
  const cart = await getMyCart();

  if (!product) {
    notFound();
  }

  return (
    <>
      <section>
        <div className="grid grid-cols-1 md:grid-cols-5">
          {/* Images Column */}
          <div className="col-span-2">
            <ProductImages images={product.images} />
          </div>
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
                    <Badge variant="destructive">
                      {commonT("notFound.stock")}
                    </Badge>
                  )}
                </div>
                {product.stock > 0 && (
                  <div className="flex-center">
                    <AddToCart
                      cart={cart}
                      item={{
                        productId: product.id,
                        name: product.name,
                        slug: product.slug,
                        price: product.price,
                        qty: 1,
                        image: product.images![0],
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section className="mt-10">
        <h2 className="h2-bold  mb-5">{t("customerReviews")}</h2>
        <ReviewList
          productId={product.id}
          productSlug={product.slug}
          userId={userId || ""}
        />
      </section>
    </>
  );
};

export default ProductDetailsPage;
