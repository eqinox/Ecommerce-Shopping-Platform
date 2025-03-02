import ProductForm from "@/components/admin/product-form";
import { getServerTranslations } from "@/i18n/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Създай Продукт",
};

const CreateProductPage = async () => {
  const { t } = await getServerTranslations();
  return (
    <div>
      <h2 className="h2-bold">{t("createProduct")}</h2>
      <div className="my-8">
        <ProductForm type="Create" />
      </div>
    </div>
  );
};

export default CreateProductPage;
