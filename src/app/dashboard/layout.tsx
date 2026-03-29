import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardNav } from "./_components/dashboard-nav";
import { getLocale } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const locale = await getLocale();
  const d = await getDictionary(locale);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50/60">
      <DashboardNav
        userName={session.user.name ?? d.common.user}
        signOutAction={async () => {
          "use server";
          await signOut({ redirectTo: "/login" });
        }}
      />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
