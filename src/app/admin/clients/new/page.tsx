import { NewClientForm } from "./_components/new-client-form";
import { getLocale } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n";

export default async function NewClientPage() {
  const locale = await getLocale();
  const d = await getDictionary(locale);
  const nc = d.admin.clients.newClient;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{nc.title}</h1>
        <p className="text-muted-foreground">{nc.subtitle}</p>
      </div>

      <NewClientForm />
    </div>
  );
}
