import DealCountdown from "@/components/deal-countdown";
import IconBoxes from "@/components/icon-boxes";
import { ProductCarousel } from "@/components/shared/product/product-carousel";
import ProductList from "@/components/shared/product/product-list";
import ViewAllProductsButton from "@/components/view-all-products";
import { getServerTranslations } from "@/i18n/server";
import {
  getFeaturedProducts,
  getLatestProducts,
} from "@/lib/actions/product.actions";

const Homepage = async () => {
  const latestProducts = await getLatestProducts();
  const featuredProducts = await getFeaturedProducts();
  const { t } = await getServerTranslations();

  return (
    <div>
      {featuredProducts.length > 0 && (
        <ProductCarousel data={featuredProducts} />
      )}

      <ProductList title={t("newestArrivals")} data={latestProducts} />

      <ViewAllProductsButton />

      <DealCountdown />

      <IconBoxes />
    </div>
  );
};

export default Homepage;
