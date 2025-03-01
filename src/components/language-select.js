"use client";

import { useRouter } from "next/navigation";
import i18next from "i18next";
import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

import { languages } from "@/i18n/settings";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

export const LanguageSelect = ({ currentLanguage }) => {
  const router = useRouter();
  const { t } = useTranslation();

  const handleChangeLanguage = (e, lang) => {
    e.preventDefault();
    i18next.changeLanguage(lang);
    router.refresh();
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <Globe />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{t("language")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {languages.map((lang) => {
          return (
            <DropdownMenuCheckboxItem
              key={lang}
              checked={lang === currentLanguage}
              onClick={(e) => handleChangeLanguage(e, lang)}
            >
              {lang}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
