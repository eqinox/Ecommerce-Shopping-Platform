"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpDefaultValues } from "@/lib/constants";
import { signUpUser } from "@/lib/actions/user.actions";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";

const SignUpForm = () => {
  const { t } = useTranslation("form");
  const [data, action, pending] = useActionState(signUpUser, {
    success: false,
    message: "",
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  return (
    <form action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-6">
        <div>
          <Label htmlFor="name">{t("name")}</Label>
          <Input
            id="name"
            name="name"
            type="name"
            autoComplete="name"
            defaultValue={signUpDefaultValues.name}
          />
        </div>

        <div>
          <Label htmlFor="email">{t("email")}</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={signUpDefaultValues.email}
          />
        </div>

        <div>
          <Label htmlFor="password">{t("password")}</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="password"
            defaultValue={signUpDefaultValues.password}
          />
        </div>

        <div>
          <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="confirmPassword"
            defaultValue={signUpDefaultValues.confirmPassword}
          />
        </div>

        <div>
          <Button variant="default" className="w-full" disabled={pending}>
            {pending ? t("submitting") : t("signUp")}
          </Button>
        </div>

        {data && !data.success && (
          <div className="text-center text-destructive">{data.message}</div>
        )}

        <div className="text-sm text-center text-muted-foreground">
          {t("alreadyHaveAcc")}{" "}
          <Link href="/sign-in" target="_self" className="link">
            {t("signIn")}
          </Link>
        </div>
      </div>
    </form>
  );
};

export default SignUpForm;
