"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "@/actions/testimonials";
import { Loader2, Plus, Pencil, Trash2, Quote } from "lucide-react";
import { toast } from "sonner";
import { useDictionary } from "@/lib/i18n/context";

type Testimonial = {
  id: string;
  clientName: string;
  clientTitle: string | null;
  quote: string;
  imageUrl: string | null;
  isFeatured: boolean | null;
  displayOrder: number | null;
  createdAt: Date;
};

function TestimonialForm({
  testimonial,
  onDone,
}: {
  testimonial?: Testimonial;
  onDone: () => void;
}) {
  const [clientName, setClientName] = useState(testimonial?.clientName ?? "");
  const [clientTitle, setClientTitle] = useState(testimonial?.clientTitle ?? "");
  const [quote, setQuote] = useState(testimonial?.quote ?? "");
  const [isFeatured, setIsFeatured] = useState(testimonial?.isFeatured ?? true);
  const [displayOrder, setDisplayOrder] = useState(
    testimonial?.displayOrder ?? 0
  );
  const [isPending, startTransition] = useTransition();
  const d = useDictionary();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!clientName.trim() || !quote.trim()) return;

    startTransition(async () => {
      const data = {
        clientName: clientName.trim(),
        clientTitle: clientTitle.trim() || null,
        quote: quote.trim(),
        isFeatured,
        displayOrder,
      };

      if (testimonial) {
        await updateTestimonial(testimonial.id, data);
        toast.success(d.admin.settings.testimonials.toastUpdated);
      } else {
        await createTestimonial(data);
        toast.success(d.admin.settings.testimonials.toastCreated);
      }
      onDone();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="t-name">{d.admin.settings.testimonials.clientName}</Label>
        <Input
          id="t-name"
          required
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          placeholder={d.admin.settings.testimonials.clientNamePlaceholder}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="t-title">{d.admin.settings.testimonials.titleService}</Label>
        <Input
          id="t-title"
          value={clientTitle}
          onChange={(e) => setClientTitle(e.target.value)}
          placeholder={d.admin.settings.testimonials.titleServicePlaceholder}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="t-quote">{d.admin.settings.testimonials.quote}</Label>
        <Textarea
          id="t-quote"
          required
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          placeholder={d.admin.settings.testimonials.quotePlaceholder}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="t-order">{d.admin.settings.testimonials.displayOrder}</Label>
          <Input
            id="t-order"
            type="number"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(Number(e.target.value))}
          />
        </div>
        <div className="flex items-center gap-2 pt-5">
          <Checkbox
            id="t-featured"
            checked={isFeatured}
            onCheckedChange={(checked) => setIsFeatured(!!checked)}
          />
          <Label htmlFor="t-featured" className="font-normal">
            {d.admin.settings.testimonials.showOnHome}
          </Label>
        </div>
      </div>
      <DialogFooter>
        <DialogClose render={<Button variant="outline" />}>{d.common.cancel}</DialogClose>
        <Button
          type="submit"
          disabled={isPending}
          className="bg-brand text-white hover:bg-brand-dark"
        >
          {isPending && <Loader2 className="size-4 animate-spin" />}
          {testimonial ? d.common.update : d.common.create}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function TestimonialsManager({
  initialTestimonials,
}: {
  initialTestimonials: Testimonial[];
}) {
  const [items, setItems] = useState(initialTestimonials);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [deletePending, startDelete] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const d = useDictionary();

  function handleDelete(id: string) {
    setDeletingId(id);
    startDelete(async () => {
      await deleteTestimonial(id);
      setItems((prev) => prev.filter((t) => t.id !== id));
      setDeletingId(null);
      toast.success(d.admin.settings.testimonials.toastDeleted);
    });
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{d.admin.settings.testimonials.cardTitle}</CardTitle>
            <CardDescription>
              {d.admin.settings.testimonials.cardDescription}
            </CardDescription>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger
              render={
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                />
              }
            >
              <Plus className="size-3.5" />
              {d.admin.settings.testimonials.addButton}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{d.admin.settings.testimonials.newTestimonial}</DialogTitle>
                <DialogDescription>
                  {d.admin.settings.testimonials.addDescription}
                </DialogDescription>
              </DialogHeader>
              <TestimonialForm
                onDone={() => {
                  setCreateOpen(false);
                  window.location.reload();
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {d.admin.settings.testimonials.noTestimonials}
          </p>
        ) : (
          <div className="space-y-3">
            {items.map((t) => (
              <div
                key={t.id}
                className="flex items-start gap-4 rounded-lg border p-4"
              >
                <Quote className="mt-0.5 size-5 shrink-0 text-brand" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <p className="mt-1 text-sm font-medium">{t.clientName}</p>
                  {t.clientTitle && (
                    <p className="text-xs text-muted-foreground">
                      {t.clientTitle}
                    </p>
                  )}
                  {t.isFeatured && (
                    <span className="mt-1 inline-block rounded bg-brand/15 px-1.5 py-0.5 text-xs font-medium text-brand-dark">
                      {d.common.featured}
                    </span>
                  )}
                </div>
                <div className="flex shrink-0 gap-1">
                  <Dialog
                    open={editingId === t.id}
                    onOpenChange={(open) => setEditingId(open ? t.id : null)}
                  >
                    <DialogTrigger
                      render={
                        <Button variant="ghost" size="icon-sm" />
                      }
                    >
                      <Pencil className="size-3.5" />
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>{d.admin.settings.testimonials.editTestimonial}</DialogTitle>
                        <DialogDescription>
                          {d.admin.settings.testimonials.editDescription}
                        </DialogDescription>
                      </DialogHeader>
                      <TestimonialForm
                        testimonial={t}
                        onDone={() => {
                          setEditingId(null);
                          window.location.reload();
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleDelete(t.id)}
                    disabled={deletePending && deletingId === t.id}
                  >
                    {deletePending && deletingId === t.id ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="size-3.5 text-destructive" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
