"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createAppointmentAdmin,
  updateAppointment,
} from "@/actions/appointments-admin";
import { useDictionary } from "@/lib/i18n/context";

type Appointment = {
  id: string;
  clientName: string;
  email: string;
  phone: string | null;
  serviceType: string;
  preferredDate: string | null;
  preferredTime: string | null;
  message: string | null;
  status: "pending" | "confirmed" | "completed" | "cancelled";
};

const serviceTypes = [
  "personalized_nutrition",
  "weight_loss",
  "sports_nutrition",
  "body_composition",
  "pre_competition",
  "individual_coaching",
] as const;

const statuses = ["pending", "confirmed", "completed", "cancelled"] as const;

export function AppointmentFormDialog({
  appointment,
  children,
}: {
  appointment?: Appointment;
  children: React.ReactNode;
}) {
  const isEdit = !!appointment;
  const router = useRouter();
  const d = useDictionary();
  const f = d.admin.appointments.form as Record<string, string>;
  const serviceLabels = d.admin.appointments.serviceLabels as Record<string, string>;
  const statusLabels = d.admin.appointments.filterTabs as Record<string, string>;

  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [clientName, setClientName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceType, setServiceType] = useState<string>(serviceTypes[0]);
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<string>("pending");

  function resetToAppointment() {
    if (appointment) {
      setClientName(appointment.clientName);
      setEmail(appointment.email);
      setPhone(appointment.phone ?? "");
      setServiceType(appointment.serviceType);
      setPreferredDate(appointment.preferredDate ?? "");
      setPreferredTime(appointment.preferredTime ?? "");
      setMessage(appointment.message ?? "");
      setStatus(appointment.status);
    } else {
      setClientName("");
      setEmail("");
      setPhone("");
      setServiceType(serviceTypes[0]);
      setPreferredDate("");
      setPreferredTime("");
      setMessage("");
      setStatus("pending");
    }
    setError(null);
  }

  function handleOpenChange(next: boolean) {
    if (next) resetToAppointment();
    setOpen(next);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const data = {
      clientName,
      email,
      phone: phone || undefined,
      serviceType: serviceType as (typeof serviceTypes)[number],
      preferredDate: preferredDate || undefined,
      preferredTime: preferredTime || undefined,
      message: message || undefined,
      status: status as (typeof statuses)[number],
    };

    startTransition(async () => {
      const result = isEdit
        ? await updateAppointment(appointment.id, data)
        : await createAppointmentAdmin(data);

      if (result.success) {
        setOpen(false);
        router.refresh();
      } else {
        setError(result.error ?? "Something went wrong.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<span />}>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEdit
              ? d.admin.appointments.editAppointment
              : d.admin.appointments.newAppointment}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? d.admin.appointments.editAppointment
              : d.admin.appointments.newAppointment}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="apt-clientName">{f.clientName} *</Label>
              <Input
                id="apt-clientName"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder={f.clientNamePlaceholder}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="apt-email">{f.email} *</Label>
              <Input
                id="apt-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={f.emailPlaceholder}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="apt-phone">{f.phone}</Label>
              <Input
                id="apt-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={f.phonePlaceholder}
              />
            </div>
            <div className="space-y-1.5">
              <Label>{f.serviceType} *</Label>
              <Select
                value={serviceType}
                onValueChange={(v) => v && setServiceType(v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={f.serviceTypePlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {serviceTypes.map((s) => (
                    <SelectItem key={s} value={s}>
                      {serviceLabels[s] ?? s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="apt-date">{f.preferredDate}</Label>
              <Input
                id="apt-date"
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="apt-time">{f.preferredTime}</Label>
              <Input
                id="apt-time"
                type="time"
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>{f.status}</Label>
            <Select value={status} onValueChange={(v) => v && setStatus(v)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={f.statusPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((s) => (
                  <SelectItem key={s} value={s}>
                    {statusLabels[s] ?? s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="apt-message">{f.message}</Label>
            <Textarea
              id="apt-message"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={f.messagePlaceholder}
            />
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className="bg-brand text-white hover:bg-brand-dark"
              disabled={isPending}
            >
              {isPending
                ? d.common.loading
                : isEdit
                  ? f.saveButton
                  : f.createButton}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
