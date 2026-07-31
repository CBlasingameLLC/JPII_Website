import { Cross } from "@/components/ui/Cross";
import { StaggerGrid, StaggerItem } from "@/components/ui/StaggerGrid";
import type { ScheduleItem } from "@/types/schedule";

export function ScheduleCards({ items }: { items: ScheduleItem[] }) {
  if (items.length === 0) {
    return (
      <div className="mt-9 rounded-inner border border-dashed border-border p-[26px_28px] text-center text-sm text-muted">
        No regular programming today — check Events for anything special this week.
      </div>
    );
  }

  return (
    <StaggerGrid className="mt-9 grid grid-cols-1 gap-5 sm:grid-cols-2">
      {items.map((item) => (
        <StaggerItem
          key={item.title}
          className="group flex items-start gap-6 rounded-inner border border-border bg-ivory p-[26px_28px] transition-colors duration-150 hover:border-gold hover:bg-[#FBF6EA]"
        >
          <Cross width={17} height={24} color="#C8A24B" className="mt-1 flex-none" />
          <div>
            <div className="font-ui text-xl font-bold text-navy-deep">{item.title}</div>
            <div className="mt-[7px] font-ui text-[11px] font-semibold uppercase tracking-[.14em] text-orange">
              {item.time}
            </div>
            <div className="mt-[11px] text-sm leading-[1.6] text-ink-warm">{item.note}</div>
          </div>
        </StaggerItem>
      ))}
    </StaggerGrid>
  );
}
