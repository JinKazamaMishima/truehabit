import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { Dictionary } from "@/lib/i18n/messages/es";

const BRAND = "#059669";
const TEXT = "#1f2937";
const MUTED = "#6b7280";
const BORDER = "#e5e7eb";
const BOX_BG = "#f0fdf4";

const styles = StyleSheet.create({
  page: {
    paddingTop: 48,
    paddingBottom: 48,
    paddingHorizontal: 48,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: TEXT,
  },
  coverPage: {
    paddingTop: 72,
    paddingBottom: 48,
    paddingHorizontal: 48,
    fontFamily: "Helvetica",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    fontSize: 28,
    fontWeight: "bold",
    color: BRAND,
    marginBottom: 32,
    letterSpacing: 1,
  },
  coverTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: TEXT,
    textAlign: "center",
    marginBottom: 16,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  coverGoal: {
    fontSize: 14,
    fontWeight: "bold",
    color: BRAND,
    textAlign: "center",
    marginBottom: 24,
  },
  coverClient: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 48,
  },
  coverFooter: {
    fontSize: 9,
    color: MUTED,
    textAlign: "center",
    marginTop: "auto",
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: "bold",
    color: BRAND,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
    paddingBottom: 4,
    borderBottomWidth: 2,
    borderBottomColor: BRAND,
  },
  subHeader: {
    fontSize: 10,
    fontWeight: "bold",
    color: TEXT,
    marginTop: 14,
    marginBottom: 6,
  },
  box: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 4,
    padding: 12,
    backgroundColor: BOX_BG,
    marginBottom: 12,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    paddingVertical: 6,
  },
  tableRowLast: {
    flexDirection: "row",
    paddingVertical: 6,
  },
  tableCellLabel: {
    width: "42%",
    fontSize: 9,
    color: MUTED,
  },
  tableCellValue: {
    width: "58%",
    fontSize: 9,
    fontWeight: "bold",
    color: TEXT,
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: BRAND,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginBottom: 2,
  },
  tableHeaderCell: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#ffffff",
    textTransform: "uppercase",
  },
  suppCol1: { width: "28%" },
  suppCol2: { width: "18%" },
  suppCol3: { width: "22%" },
  suppCol4: { width: "32%" },
  suppDataRow: {
    flexDirection: "row",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  bodyText: {
    fontSize: 9,
    lineHeight: 1.45,
    color: TEXT,
  },
  dayPageHeader: {
    fontSize: 14,
    fontWeight: "bold",
    color: BRAND,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  dayTypeBadge: {
    fontSize: 9,
    color: MUTED,
    marginBottom: 16,
    textTransform: "capitalize",
  },
  mealBlock: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 4,
    padding: 10,
  },
  mealSlotTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: TEXT,
    marginBottom: 6,
  },
  portionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  portionPill: {
    fontSize: 8,
    color: MUTED,
    backgroundColor: "#f9fafb",
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: BORDER,
    marginRight: 6,
    marginBottom: 4,
  },
  recipeName: {
    fontSize: 10,
    fontWeight: "bold",
    color: TEXT,
    marginTop: 6,
    marginBottom: 2,
  },
  recipePrimary: {
    fontSize: 7,
    color: BRAND,
    marginBottom: 4,
    fontWeight: "bold",
  },
  ingredientLine: {
    fontSize: 8,
    color: TEXT,
    marginLeft: 8,
    marginBottom: 2,
    lineHeight: 1.35,
  },
  notesLabel: {
    fontSize: 8,
    fontWeight: "bold",
    color: MUTED,
    marginTop: 6,
  },
  notesText: {
    fontSize: 8,
    color: TEXT,
    marginTop: 2,
    lineHeight: 1.35,
  },
  prepText: {
    fontSize: 8,
    color: MUTED,
    marginTop: 4,
    lineHeight: 1.35,
    fontStyle: "italic",
  },
  pageNumber: {
    position: "absolute",
    bottom: 28,
    right: 48,
    fontSize: 8,
    color: MUTED,
  },
});

export type MealPlanPdfIngredient = {
  name: string | null;
  baseQty: string | null;
  servingUnit: string | null;
  ratioGroup: string | null;
  isOptional: boolean | null;
  notes: string | null;
};

export type MealPlanPdfRecipe = {
  name: string;
  description: string | null;
  prepInstructions: string | null;
  ingredients: MealPlanPdfIngredient[];
};

export type MealPlanPdfMealOption = {
  isPrimary: boolean;
  recipe: MealPlanPdfRecipe;
};

export type MealPlanPdfMeal = {
  slotName: string;
  cerealPortions: string | null;
  proteinPortions: string | null;
  fatPortions: string | null;
  veggiePortions: string | null;
  notes: string | null;
  options: MealPlanPdfMealOption[];
};

export type MealPlanPdfDay = {
  dayNumber: number;
  dayLabel: string | null;
  dayType: string | null;
  meals: MealPlanPdfMeal[];
};

export type MealPlanPdfSupplement = {
  supplementName: string;
  dose: string | null;
  frequency: string | null;
  timing: string | null;
  notes: string | null;
};

export type MealPlanPdfHydration = {
  dailyWaterMl: number | null;
  duringTraining: string | null;
  electrolyteBrand: string | null;
  notes: string | null;
};

export type MealPlanPdfMeasurement = {
  date: string;
  weightKg: string | null;
  heightCm: string | null;
  bmi: string | null;
  bodyFatPct: string | null;
  fatKg: string | null;
  muscleMassPct: string | null;
  muscleKg: string | null;
  visceralFat: string | null;
};

export type MealPlanPdfData = {
  planName: string;
  clientName: string;
  clientGoal: string | null;
  calorieTarget: number | null;
  proteinGPerKg: string | null;
  carbsGPerKg: string | null;
  fatGPerKg: string | null;
  generalRecommendations: string | null;
  days: MealPlanPdfDay[];
  supplements: MealPlanPdfSupplement[];
  hydration: MealPlanPdfHydration[];
  measurement: MealPlanPdfMeasurement | null;
};

type PdfLabels = Dictionary["pdf"];

function goalLabel(goal: string | null, labels: PdfLabels): string {
  if (!goal) return labels.nutritionalPlan;
  const key = goal as keyof typeof labels.goalLabels;
  return labels.goalLabels[key] ?? goal.replace(/_/g, " ").toUpperCase();
}

function dayTypeLabel(t: string | null, labels: PdfLabels): string {
  if (!t) return "";
  const key = t as keyof typeof labels.dayTypeLabels;
  return labels.dayTypeLabels[key] ?? t;
}

function fmt(s: string | null | undefined, fallback = "—"): string {
  if (s === null || s === undefined || s === "") return fallback;
  return String(s);
}

function formatIngredient(ing: MealPlanPdfIngredient, labels: PdfLabels): string {
  const qty = ing.baseQty?.trim();
  const unit = ing.servingUnit?.trim();
  const name = ing.name?.trim() || labels.ingredient;
  const ratio = ing.ratioGroup?.trim();
  const opt = ing.isOptional ? labels.optionalSuffix : "";
  const ratioPart = ratio ? ` · ${ratio}` : "";
  if (qty && unit) return `• ${qty} ${unit} — ${name}${ratioPart}${opt}`;
  if (qty) return `• ${qty} — ${name}${ratioPart}${opt}`;
  return `• ${name}${ratioPart}${opt}`;
}

function PortionsRow({
  cereal,
  protein,
  fat,
  veggie,
  labels,
}: {
  cereal: string | null;
  protein: string | null;
  fat: string | null;
  veggie: string | null;
  labels: PdfLabels;
}) {
  return (
    <View style={styles.portionRow}>
      <Text style={styles.portionPill}>{labels.cereals}: {fmt(cereal)}</Text>
      <Text style={styles.portionPill}>{labels.proteins}: {fmt(protein)}</Text>
      <Text style={styles.portionPill}>{labels.fats}: {fmt(fat)}</Text>
      <Text style={styles.portionPill}>{labels.vegetables}: {fmt(veggie)}</Text>
    </View>
  );
}

export function MealPlanPdfDocument({ data, labels }: { data: MealPlanPdfData; labels: PdfLabels }) {
  const totalPages = 2 + data.days.length;
  const ml = labels.measurementLabels;

  const measurementRows: { label: string; value: string }[] = [
    { label: ml.date, value: data.measurement ? fmt(data.measurement.date) : "—" },
    { label: ml.weightKg, value: fmt(data.measurement?.weightKg ?? null) },
    { label: ml.heightCm, value: fmt(data.measurement?.heightCm ?? null) },
    { label: ml.bmi, value: fmt(data.measurement?.bmi ?? null) },
    { label: ml.bodyFatPct, value: fmt(data.measurement?.bodyFatPct ?? null) },
    { label: ml.fatKg, value: fmt(data.measurement?.fatKg ?? null) },
    { label: ml.muscleMassPct, value: fmt(data.measurement?.muscleMassPct ?? null) },
    { label: ml.muscleKg, value: fmt(data.measurement?.muscleKg ?? null) },
    { label: ml.visceralFat, value: fmt(data.measurement?.visceralFat ?? null) },
  ];

  return (
    <Document>
      <Page size="A4" style={styles.coverPage}>
        <Text style={styles.logo}>TrueHabit</Text>
        <Text style={styles.coverTitle}>{labels.feedingPlan}</Text>
        <Text style={styles.coverGoal}>{goalLabel(data.clientGoal, labels)}</Text>
        <Text style={styles.coverClient}>{data.clientName}</Text>
        <Text style={styles.coverFooter}>
          LN. Enya Marrero | {labels.sportsNutrition}
        </Text>
        <Text
          style={styles.pageNumber}
          render={({ pageNumber }) => `${pageNumber} / ${totalPages}`}
          fixed
        />
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionHeader}>{labels.essentialInfo}</Text>

        <Text style={styles.subHeader}>{labels.anthropometry}</Text>
        <View style={styles.box}>
          {measurementRows.map((row, i) => (
            <View
              key={row.label}
              style={
                i === measurementRows.length - 1
                  ? styles.tableRowLast
                  : styles.tableRow
              }
            >
              <Text style={styles.tableCellLabel}>{row.label}</Text>
              <Text style={styles.tableCellValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.subHeader}>{labels.hydration}</Text>
        {data.hydration.length === 0 ? (
          <Text style={styles.bodyText}>—</Text>
        ) : (
          data.hydration.map((h, idx) => (
            <View key={idx} style={[styles.box, { marginBottom: 8 }]}>
              <View style={styles.tableRowLast}>
                <Text style={styles.tableCellLabel}>{labels.dailyWater}</Text>
                <Text style={styles.tableCellValue}>
                  {h.dailyWaterMl != null ? `${h.dailyWaterMl} mL` : "—"}
                </Text>
              </View>
              <View style={styles.tableRowLast}>
                <Text style={styles.tableCellLabel}>{labels.duringTraining}</Text>
                <Text style={styles.tableCellValue}>
                  {fmt(h.duringTraining)}
                </Text>
              </View>
              <View style={styles.tableRowLast}>
                <Text style={styles.tableCellLabel}>{labels.electrolytes}</Text>
                <Text style={styles.tableCellValue}>
                  {fmt(h.electrolyteBrand)}
                </Text>
              </View>
              {h.notes ? (
                <Text style={[styles.notesText, { marginTop: 6 }]}>{h.notes}</Text>
              ) : null}
            </View>
          ))
        )}

        <Text style={styles.subHeader}>{labels.supplementation}</Text>
        {data.supplements.length === 0 ? (
          <Text style={styles.bodyText}>—</Text>
        ) : (
          <View style={{ borderWidth: 1, borderColor: BORDER, borderRadius: 4 }}>
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.tableHeaderCell, styles.suppCol1]}>
                {labels.supplement}
              </Text>
              <Text style={[styles.tableHeaderCell, styles.suppCol2]}>
                {labels.dose}
              </Text>
              <Text style={[styles.tableHeaderCell, styles.suppCol3]}>
                {labels.frequency}
              </Text>
              <Text style={[styles.tableHeaderCell, styles.suppCol4]}>
                {labels.timing}
              </Text>
            </View>
            {data.supplements.map((s, i) => (
              <View
                key={i}
                style={[
                  styles.suppDataRow,
                  i === data.supplements.length - 1
                    ? { borderBottomWidth: 0 }
                    : {},
                ]}
              >
                <Text style={[styles.bodyText, styles.suppCol1]}>
                  {s.supplementName}
                </Text>
                <Text style={[styles.bodyText, styles.suppCol2]}>
                  {fmt(s.dose)}
                </Text>
                <Text style={[styles.bodyText, styles.suppCol3]}>
                  {fmt(s.frequency)}
                </Text>
                <Text style={[styles.bodyText, styles.suppCol4]}>
                  {fmt(s.timing)}
                </Text>
              </View>
            ))}
          </View>
        )}

        <Text style={styles.subHeader}>{labels.energyAndMacros}</Text>
        <View style={styles.box}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellLabel}>{labels.calorieTarget}</Text>
            <Text style={styles.tableCellValue}>
              {data.calorieTarget != null
                ? `${data.calorieTarget} kcal`
                : "—"}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellLabel}>{labels.proteinGPerKg}</Text>
            <Text style={styles.tableCellValue}>
              {fmt(data.proteinGPerKg)}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellLabel}>{labels.carbsGPerKg}</Text>
            <Text style={styles.tableCellValue}>{fmt(data.carbsGPerKg)}</Text>
          </View>
          <View style={styles.tableRowLast}>
            <Text style={styles.tableCellLabel}>{labels.fatGPerKg}</Text>
            <Text style={styles.tableCellValue}>{fmt(data.fatGPerKg)}</Text>
          </View>
        </View>

        <Text style={styles.subHeader}>{labels.generalRecommendations}</Text>
        <Text style={styles.bodyText}>
          {data.generalRecommendations?.trim()
            ? data.generalRecommendations
            : "—"}
        </Text>

        <Text
          style={styles.pageNumber}
          render={({ pageNumber }) => `${pageNumber} / ${totalPages}`}
          fixed
        />
      </Page>

      {data.days.map((day) => (
        <Page key={day.dayNumber} size="A4" style={styles.page}>
          <Text style={styles.dayPageHeader}>
            {day.dayLabel?.trim() || `${labels.dayPrefix} ${day.dayNumber}`}
          </Text>
          {day.dayType ? (
            <Text style={styles.dayTypeBadge}>{dayTypeLabel(day.dayType, labels)}</Text>
          ) : null}

          {day.meals.map((meal, mi) => (
            <View key={`${day.dayNumber}-${mi}`} style={styles.mealBlock}>
              <Text style={styles.mealSlotTitle}>{meal.slotName}</Text>
              <PortionsRow
                cereal={meal.cerealPortions}
                protein={meal.proteinPortions}
                fat={meal.fatPortions}
                veggie={meal.veggiePortions}
                labels={labels}
              />

              {meal.options.length === 0 ? (
                <Text style={styles.bodyText}>{labels.noRecipes}</Text>
              ) : (
                meal.options.map((opt, oi) => (
                  <View key={oi}>
                    {opt.isPrimary ? (
                      <Text style={styles.recipePrimary}>{labels.primaryOption}</Text>
                    ) : null}
                    <Text style={styles.recipeName}>{opt.recipe.name}</Text>
                    {opt.recipe.description ? (
                      <Text style={styles.prepText}>{opt.recipe.description}</Text>
                    ) : null}
                    {opt.recipe.ingredients.length === 0 ? (
                      <Text style={styles.ingredientLine}>
                        {labels.noIngredients}
                      </Text>
                    ) : (
                      opt.recipe.ingredients.map((ing, ii) => (
                        <Text key={ii} style={styles.ingredientLine}>
                          {formatIngredient(ing, labels)}
                          {ing.notes?.trim() ? ` — ${ing.notes}` : ""}
                        </Text>
                      ))
                    )}
                    {opt.recipe.prepInstructions?.trim() ? (
                      <Text style={styles.prepText}>
                        {labels.prep} {opt.recipe.prepInstructions}
                      </Text>
                    ) : null}
                  </View>
                ))
              )}

              {meal.notes?.trim() ? (
                <View>
                  <Text style={styles.notesLabel}>{labels.notes}</Text>
                  <Text style={styles.notesText}>{meal.notes}</Text>
                </View>
              ) : null}
            </View>
          ))}

          <Text
            style={styles.pageNumber}
            render={({ pageNumber }) => `${pageNumber} / ${totalPages}`}
            fixed
          />
        </Page>
      ))}
    </Document>
  );
}
