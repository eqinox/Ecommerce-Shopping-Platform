import { Product } from "@/types";
import ProductCard from "./product-card";
import { getServerTranslations } from "@/i18n/server";

interface ProductListProps {
  data: Product[]; // Adjust the type if you have a specific product type
  title?: string;
  limit?: number;
}

const ProductList: React.FC<ProductListProps> = async ({
  data,
  title,
  limit,
}) => {
  const limitedData = limit ? data.slice(0, limit) : data;
  const { t } = await getServerTranslations();

  return (
    <div className="my-10">
      {title && <h2 className="h2-bold mb-4">{title}</h2>}
      {data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {limitedData.slice(0, limit).map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div>
          <p>{t("notFound.products")}</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;
