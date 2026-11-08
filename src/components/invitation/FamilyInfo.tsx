import Section from "../common/Section";
import { wedding, type Family } from "../../data/wedding";

function FamilyColumn({ family }: { family: Family }) {
  return (
    <div className="space-y-0.5 text-[11px] uppercase leading-relaxed tracking-wide sm:text-xs">
      <p className="mb-1 text-navy/80">{family.label}</p>
      <p>
        Ông: <span className="font-bold">{family.father}</span>
      </p>
      <p>
        Bà: <span className="font-bold">{family.mother}</span>
      </p>
      <p className="pt-0.5 text-[11px] normal-case italic tracking-normal text-navy/80 sm:text-xs">
        {family.address}
      </p>
    </div>
  );
}

export default function FamilyInfo() {
  return (
    <Section className="grid grid-cols-2 gap-3">
      <FamilyColumn family={wedding.brideFamily} />
      <FamilyColumn family={wedding.groomFamily} />
    </Section>
  );
}
