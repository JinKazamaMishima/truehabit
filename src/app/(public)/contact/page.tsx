"use client";

import { Suspense, useRef, useState, useTransition, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
  Send,
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { createAppointment } from "@/actions/appointments";
import { useDictionary } from "@/lib/i18n/context";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

const serviceValues = [
  "personalized_nutrition",
  "weight_loss",
  "sports_nutrition",
  "body_composition",
  "pre_competition",
  "individual_coaching",
] as const;

type FormValues = {
  clientName: string;
  email: string;
  phone?: string;
  serviceType: (typeof serviceValues)[number];
  preferredDate?: string;
  message?: string;
};

export default function ContactPage() {
  const d = useDictionary();

  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><div className="text-lg text-muted-foreground">{d.common.loading}</div></div>}>
      <ContactPageContent />
    </Suspense>
  );
}

function ContactPageContent() {
  const d = useDictionary();
  const formRef = useRef(null);
  const formInView = useInView(formRef, { once: true, margin: "-80px" });
  const searchParams = useSearchParams();
  const preselectedService = searchParams.get("service") ?? "personalized_nutrition";

  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const serviceOptions = useMemo(() => serviceValues.map((value) => ({
    value,
    label: d.public.contact.serviceOptions[value],
  })), [d]);

  const contactInfo = useMemo(() => [
    { icon: Phone, label: d.public.contact.phone, value: d.public.contact.defaultPhone, href: "tel:+526641234567" },
    { icon: Mail, label: d.public.contact.email, value: d.public.contact.defaultEmail, href: "mailto:contacto@truehabit.mx" },
    { icon: MapPin, label: d.public.contact.location, value: d.public.contact.defaultLocation },
    { icon: Clock, label: d.public.contact.schedule, value: d.public.contact.defaultSchedule },
  ], [d]);

  const formSchema = useMemo(() => z.object({
    clientName: z.string().min(2, d.public.contact.nameMinLength),
    email: z.email(d.public.contact.invalidEmail),
    phone: z.string().optional(),
    serviceType: z.enum(serviceValues),
    preferredDate: z.string().optional(),
    message: z.string().optional(),
  }), [d]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: "",
      email: "",
      phone: "",
      serviceType: (serviceValues.includes(preselectedService as FormValues["serviceType"])
        ? preselectedService
        : "personalized_nutrition") as FormValues["serviceType"],
      preferredDate: "",
      message: "",
    },
  });

  const selectedService = watch("serviceType");

  function onSubmit(data: FormValues) {
    setServerError(null);
    startTransition(async () => {
      const result = await createAppointment(data);
      if (result.success) {
        setSubmitted(true);
      } else {
        setServerError(result.error ?? d.public.contact.unknownError);
      }
    });
  }

  return (
    <>
      <section className="relative overflow-hidden bg-charcoal py-20 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-charcoal-light/50 to-charcoal opacity-80" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mx-auto max-w-3xl text-center"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="mb-4 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-brand" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                {d.public.contact.title}
              </span>
              <span className="h-px w-8 bg-brand" />
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="font-heading text-4xl font-bold text-white sm:text-5xl"
            >
              {d.public.contact.subtitle}
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mx-auto mt-5 max-w-xl text-base text-white/70"
            >
              {d.public.contact.introText}
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section ref={formRef} className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid gap-12 lg:grid-cols-5"
            initial="hidden"
            animate={formInView ? "visible" : "hidden"}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="lg:col-span-2">
              <h2 className="font-heading text-2xl font-bold text-charcoal">
                {d.public.contact.contactInfoTitle}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {d.public.contact.contactInfoSubtitle}
              </p>

              <div className="mt-8 space-y-6">
                {contactInfo.map((info) => (
                  <div key={info.label} className="flex items-start gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                      <info.icon className="size-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {info.label}
                      </p>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="mt-1 text-sm font-medium text-charcoal hover:text-brand"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="mt-1 text-sm font-medium text-charcoal">
                          {info.value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl sm:p-8 lg:col-span-3"
            >
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-brand/10">
                    <CheckCircle className="size-8 text-brand" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-charcoal">
                    {d.public.contact.successTitle}
                  </h3>
                  <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                    {d.public.contact.successMessage}
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  <h3 className="font-heading text-lg font-bold text-charcoal">
                    {d.public.contact.formTitle}
                  </h3>

                  {serverError && (
                    <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                      {serverError}
                    </div>
                  )}

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="clientName">{d.public.contact.fullName} *</Label>
                      <Input
                        id="clientName"
                        placeholder={d.public.contact.fullNamePlaceholder}
                        {...register("clientName")}
                        aria-invalid={!!errors.clientName}
                      />
                      {errors.clientName && (
                        <p className="text-xs text-red-600">
                          {errors.clientName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="email">{d.public.contact.emailLabel} *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder={d.public.contact.emailPlaceholder}
                        {...register("email")}
                        aria-invalid={!!errors.email}
                      />
                      {errors.email && (
                        <p className="text-xs text-red-600">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="phone">{d.public.contact.phone}</Label>
                      <Input
                        id="phone"
                        placeholder={d.public.contact.phonePlaceholder}
                        {...register("phone")}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label>{d.public.contact.serviceLabel} *</Label>
                      <Select
                        value={selectedService}
                        onValueChange={(val) =>
                          setValue("serviceType", val as FormValues["serviceType"])
                        }
                        items={Object.fromEntries(serviceOptions.map((o) => [o.value, o.label]))}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={d.public.contact.servicePlaceholder} />
                        </SelectTrigger>
                        <SelectContent>
                          {serviceOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.serviceType && (
                        <p className="text-xs text-red-600">
                          {errors.serviceType.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="preferredDate">{d.public.contact.preferredDate}</Label>
                    <Input
                      id="preferredDate"
                      type="date"
                      {...register("preferredDate")}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="message">{d.public.contact.message}</Label>
                    <Textarea
                      id="message"
                      placeholder={d.public.contact.messagePlaceholder}
                      rows={4}
                      {...register("message")}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="h-11 w-full bg-brand text-white hover:bg-brand-dark"
                    disabled={isPending}
                  >
                    {isPending ? (
                      d.common.sending
                    ) : (
                      <>
                        {d.public.contact.submitButton}
                        <Send className="ml-1.5 size-4" />
                      </>
                    )}
                  </Button>
                </form>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
