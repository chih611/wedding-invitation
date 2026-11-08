import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Card from "../common/Card";
import FloatingHearts from "../common/FloatingHearts";
import Section from "../common/Section";
import OpenCover from "./OpenCover";
import FamilyInfo from "./FamilyInfo";
import CoupleNames from "./CoupleNames";
import CeremonyInfo from "./CeremonyInfo";
import ReceptionInfo from "./ReceptionInfo";
import Countdown from "./Countdown";
import VenueActions from "./VenueActions";
import GiftBox from "./GiftBox";
import { useGuestName } from "../../hooks/useGuestName";
import { wedding } from "../../data/wedding";
import logoHQ from "../../assets/monogram.png";

/** Thiệp đầy đủ: bìa → Lễ Vu Quy → thiệp mời tiệc → đếm ngược → bản đồ → hộp mừng cưới */
export default function InvitationLayout() {
  const guestName = useGuestName();
  const [opened, setOpened] = useState(false);

  return (
    <>
      <FloatingHearts />

      <AnimatePresence>
        {!opened && <OpenCover key="cover" guestName={guestName} onOpen={() => setOpened(true)} />}
      </AnimatePresence>

      {opened && (
        <main className="flex min-h-svh flex-col gap-10 px-4 py-10 sm:py-16">
          <Card>
            <Section className="flex justify-center">
              <img src={logoHQ} alt="H&Q" className="w-32 sm:w-36" />
            </Section>
            <div className="mt-2 space-y-8">
              <FamilyInfo />
              <CoupleNames />
              <CeremonyInfo />
            </div>
          </Card>

          <Card>
            <ReceptionInfo guestName={guestName} />
          </Card>

          <Countdown target={wedding.reception.start} />

          <VenueActions />

          <GiftBox guestName={guestName} />

          <Section className="pb-6 text-center">
            <p className="font-script text-4xl text-royal">Thank you!</p>
            <p className="mt-2 text-xs uppercase tracking-widest text-navy/70">
              {wedding.bride.shortName} &amp; {wedding.groom.shortName}
            </p>
          </Section>
        </main>
      )}
    </>
  );
}
