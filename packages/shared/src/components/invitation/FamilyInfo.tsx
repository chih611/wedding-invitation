import Section from "../common/Section";
import { useWedding, type Family } from "../../config";

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

/** Hai cột gia đình, nhà tổ chức thiệp ở bên trái */
export default function FamilyInfo() {
  const { families } = useWedding();
  return (
    <Section className="grid grid-cols-2 gap-3">
      <FamilyColumn family={families[0]} />
      <FamilyColumn family={families[1]} />
    </Section>
  );
}
