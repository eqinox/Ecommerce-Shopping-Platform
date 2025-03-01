import { auth } from "@/auth";
import { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import ProfileForm from "./profile-form";
import { getServerTranslations } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Клиентски Профил",
};

const Profile = async () => {
  const { t } = await getServerTranslations();
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <div className="max-w-md mx-auto space-y-4">
        <h2 className="h2-bold">{t("profile")}</h2>
        <ProfileForm />
      </div>
    </SessionProvider>
  );
};

export default Profile;
