import { getUserById } from "@/lib/actions/user.actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import UpdateUserForm from "./update-user-form";
import { getServerTranslations } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Редактирай Потребител",
};

interface Props {
  params: Promise<{ id: string }>;
}

const AdminUserUpdatePage: React.FC<Props> = async (props) => {
  const { t } = await getServerTranslations("form");
  const { id } = await props.params;

  const user = await getUserById(id);

  if (!user) notFound();

  return (
    <div className="space-y-8 max-w-lg mx-auto">
      <h1 className="h2-bold">{t("updateUser")}</h1>
      <UpdateUserForm user={user} />
    </div>
  );
};

export default AdminUserUpdatePage;
