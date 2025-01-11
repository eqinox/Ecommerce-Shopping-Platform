import ProductList from "@/components/shared/product/product-list";
import { getLatetProducts } from "@/lib/actions/product.actions";

const Homepage = async () => {
  const latestProducts = await getLatetProducts();

  return (
    <>
      <ProductList data={latestProducts} title="Newest Arrivals" />
    </>
  );
};

export default Homepage;
