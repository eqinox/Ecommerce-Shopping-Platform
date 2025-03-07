import ProductForm from "@/components/admin/product-form";
import { getServerTranslations } from "@/i18n/server";
import { getProductById } from "@/lib/actions/product.actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Редактирай Продукт",
};

interface Props {
  params: Promise<{ id: string }>;
}

const AdminProductUpdatePage: React.FC<Props> = async (props) => {
  const { t } = await getServerTranslations();
  const { id } = await props.params;

  const product = await getProductById(id);

  if (!product) return notFound();

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <h1 className="h2-bold">{t("updateProduct")}</h1>
      <ProductForm type="Update" product={product} productId={product.id} />
    </div>
  );
};

export default AdminProductUpdatePage;
