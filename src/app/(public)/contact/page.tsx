"use client";

import { Suspense, useRef, useState, useTransition } from "react";
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

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

const serviceOptions = [
  { value: "personalized_nutrition", label: "Nutrición Personalizada" },
  { value: "weight_loss", label: "Pérdida de Peso" },
  { value: "sports_nutrition", label: "Nutrición Deportiva" },
  { value: "body_composition", label: "Composición Corporal" },
  { value: "pre_competition", label: "Plan Pre-Competencia" },
  { value: "individual_coaching", label: "Coaching Individual" },
] as const;

const formSchema = z.object({
  clientName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.email("Ingresa un email válido"),
  phone: z.string().optional(),
  serviceType: z.enum([
    "personalized_nutrition",
    "weight_loss",
    "sports_nutrition",
    "body_composition",
    "pre_competition",
    "individual_coaching",
  ]),
  preferredDate: z.string().optional(),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const contactInfo = [
  {
    icon: Phone,
    label: "Teléfono",
    value: "+52 (664) 123-4567",
    href: "tel:+526641234567",
  },
  {
    icon: Mail,
    label: "Email",
    value: "contacto@truehabit.mx",
    href: "mailto:contacto@truehabit.mx",
  },
  {
    icon: MapPin,
    label: "Ubicación",
    value: "Tijuana, B.C., México",
  },
  {
    icon: Clock,
    label: "Horario",
    value: "Lun - Vie: 8:00 AM - 7:00 PM",
  },
];

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><div className="text-lg text-slate-500">Cargando...</div></div>}>
      <ContactPageContent />
    </Suspense>
  );
}

function ContactPageContent() {
  const formRef = useRef(null);
  const formInView = useInView(formRef, { once: true, margin: "-80px" });
  const searchParams = useSearchParams();
  const preselectedService = searchParams.get("service") ?? "personalized_nutrition";

  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

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
      serviceType: (serviceOptions.find((o) => o.value === preselectedService)
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
        setServerError(result.error ?? "Error desconocido");
      }
    });
  }

  return (
    <>
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 py-20 sm:py-28">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mx-auto max-w-3xl text-center"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.p
              variants={fadeUp}
              className="mb-3 text-sm font-semibold uppercase tracking-widest text-emerald-200"
            >
              Contáctanos
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="text-4xl font-extrabold text-white sm:text-5xl"
            >
              Agenda Tu Cita
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mx-auto mt-4 max-w-xl text-lg text-emerald-100"
            >
              Estamos listos para ayudarte a alcanzar tus metas de nutrición.
              Completa el formulario y te contactaremos pronto.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section ref={formRef} className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid gap-12 lg:grid-cols-5"
            initial="hidden"
            animate={formInView ? "visible" : "hidden"}
            variants={stagger}
          >
            {/* Left - Contact Info */}
            <motion.div variants={fadeUp} className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-slate-900">
                Información de Contacto
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                No dudes en contactarnos por cualquiera de estos medios. Nos
                encantará ayudarte en tu camino hacia una mejor nutrición.
              </p>

              <div className="mt-8 space-y-6">
                {contactInfo.map((info) => (
                  <div key={info.label} className="flex items-start gap-4">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                      <info.icon className="size-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                        {info.label}
                      </p>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="mt-0.5 text-sm font-medium text-slate-900 hover:text-emerald-600"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="mt-0.5 text-sm font-medium text-slate-900">
                          {info.value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right - Form */}
            <motion.div
              variants={fadeUp}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-lg sm:p-8 lg:col-span-3"
            >
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-emerald-100">
                    <CheckCircle className="size-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    ¡Cita Agendada!
                  </h3>
                  <p className="mt-2 max-w-sm text-sm text-slate-600">
                    Hemos recibido tu solicitud. Te contactaremos pronto para
                    confirmar los detalles de tu cita.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  <h3 className="text-lg font-bold text-slate-900">
                    Formulario de Cita
                  </h3>

                  {serverError && (
                    <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                      {serverError}
                    </div>
                  )}

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="clientName">Nombre completo *</Label>
                      <Input
                        id="clientName"
                        placeholder="Tu nombre"
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
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu@email.com"
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
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        placeholder="+52 (664) 000-0000"
                        {...register("phone")}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label>Servicio *</Label>
                      <Select
                        value={selectedService}
                        onValueChange={(val) =>
                          setValue("serviceType", val as FormValues["serviceType"])
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecciona un servicio" />
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
                    <Label htmlFor="preferredDate">Fecha preferida</Label>
                    <Input
                      id="preferredDate"
                      type="date"
                      {...register("preferredDate")}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="message">Mensaje</Label>
                    <Textarea
                      id="message"
                      placeholder="Cuéntanos sobre tus metas y necesidades..."
                      rows={4}
                      {...register("message")}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="h-11 w-full bg-emerald-600 text-white hover:bg-emerald-700"
                    disabled={isPending}
                  >
                    {isPending ? (
                      "Enviando..."
                    ) : (
                      <>
                        Enviar Solicitud
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
