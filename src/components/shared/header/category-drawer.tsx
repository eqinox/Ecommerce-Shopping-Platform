import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { getAllCategories } from "@/lib/actions/product.actions";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { getServerTranslations } from "@/i18n/server";

const CategoriesDrawer = async () => {
  const { t } = await getServerTranslations();
  const categories = await getAllCategories();

  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        <Button variant="outline">
          <MenuIcon />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full max-w-sm">
        <DrawerHeader>
          <DrawerTitle>{t("selectCategory")}</DrawerTitle>
          <div className="space-y-1">
            {categories.map((x) => (
              <Button
                className="w-full justify-start"
                variant="ghost"
                key={x.category}
                asChild
              >
                <DrawerClose asChild>
                  <Link href={`/search?category=${x.category}`}>
                    {x.category} ({x._count})
                  </Link>
                </DrawerClose>
              </Button>
            ))}
          </div>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
};

export default CategoriesDrawer;
