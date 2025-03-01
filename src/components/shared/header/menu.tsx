import Link from "next/link";
import { EllipsisVertical, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import ModeToggle from "./mode-toggle";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import UserButton from "./user-button";
import { LanguageSelect } from "@/components/language-select";
import { getServerTranslations } from "@/i18n/server";

const Menu = async () => {
  const { i18n, t } = await getServerTranslations();
  return (
    <div className="flex justify-end gap-3">
      <nav className="hidden md:flex w-full max-w-xs gap-1">
        <ModeToggle />
        <LanguageSelect currentLanguage={i18n.resolvedLanguage} />
        <Button asChild variant="ghost">
          <Link href="/cart">
            <ShoppingCart /> {t("cart")}
          </Link>
        </Button>
        <UserButton />
      </nav>
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger className="align-middle">
            <EllipsisVertical />
          </SheetTrigger>
          <SheetContent className="flex flex-col items-start">
            <SheetTitle>{t("menu")}</SheetTitle>
            <ModeToggle />
            <LanguageSelect currentLanguage={i18n.resolvedLanguage} />
            <Button asChild variant="ghost">
              <Link href="/cart">
                <ShoppingCart /> {t("cart")}
              </Link>
            </Button>

            <UserButton />
            <SheetDescription></SheetDescription>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default Menu;
