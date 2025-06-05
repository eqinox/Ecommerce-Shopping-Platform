import { notFound } from "next/navigation";

import { getProductBySlug } from "@/lib/actions/product.actions";
import ProductImages from "@/components/shared/product/product-images";
import { getMyCart } from "@/lib/actions/cart.actions";
import { auth } from "@/auth";
import ReviewList from "./review-list";
import { getServerTranslations } from "@/i18n/server";
import ProductActions from "@/components/shared/product/product-actions";

interface Props {
  params: Promise<{ slug: string }>;
}

const ProductDetailsPage: React.FC<Props> = async (props) => {
  const { t } = await getServerTranslations("product");
  // const { t: commonT } = await getServerTranslations();
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
          <ProductActions
            product={JSON.parse(JSON.stringify(product))}
            cart={cart}
          />
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
