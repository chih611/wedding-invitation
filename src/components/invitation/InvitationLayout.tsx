import Card from "../common/Card";
import FloatingHearts from "../common/FloatingHearts";
import Section from "../common/Section";
import FamilyInfo from "./FamilyInfo";
import CoupleNames from "./CoupleNames";
import CeremonyInfo from "./CeremonyInfo";
import ReceptionInfo from "./ReceptionInfo";
import Countdown from "./Countdown";
import VenueActions from "./VenueActions";
import GiftBox from "./GiftBox";
import PhotoHero from "./PhotoHero";
import SaveTheDate from "./SaveTheDate";
import PhotoAlbum from "./PhotoAlbum";
import MusicPlayer from "./MusicPlayer";
import { useGuestName } from "../../hooks/useGuestName";
import { wedding } from "../../data/wedding";
import Monogram from "../common/Monogram";
import Ornament from "../common/Ornament";
import Schedule from "./Schedule";
import DressCode from "./DressCode";
import Rsvp from "./Rsvp";

/**
 * Thiệp đầy đủ: ảnh lớn → Lễ Vu Quy → thiệp mời tiệc → bản đồ → lịch trình → dress code
 * → album ảnh → đếm ngược → xác nhận tham dự → hộp mừng cưới → lời cảm ơn.
 */
export default function InvitationLayout() {
  const guestName = useGuestName();

  return (
    <>
      <FloatingHearts />
      <MusicPlayer />

      {/* Cả thiệp là một cột liền mạch, các phần nối tiếp nhau không có khoảng hở */}
      <main className="mx-auto min-h-svh w-full max-w-[460px] overflow-hidden bg-white shadow-[0_20px_60px_-15px_rgb(29_44_107/0.5)] sm:my-10 sm:min-h-0">
        <PhotoHero />

        <SaveTheDate />

        <Card className="bg-tint">
          <Section className="flex justify-center">
            <Monogram className="w-32 bg-royal sm:w-36" />
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

        <Block tint>
          <VenueActions />
        </Block>

        <Block>
          <Schedule />
        </Block>

        <Block tint>
          <DressCode />
        </Block>

        <Block>
          <PhotoAlbum />
        </Block>

        <Block tint>
          <Countdown target={wedding.reception.start} />
        </Block>

        {/* Chưa điền link Google Form thì ẩn cả phần này */}
        {wedding.rsvp.formUrl && (
          <Block>
            <Rsvp guestName={guestName} />
          </Block>
        )}

        {/* Băng rôn tràn hết bề ngang cột nên không bọc trong Block */}
        <GiftBox />

        <Block tint>
          <Section className="text-center">
            <p className="font-script text-5xl text-royal">Thank you!</p>
            <Ornament className="mt-2" />
            <p className="mx-auto mt-3 max-w-[320px] text-balance text-xs uppercase leading-relaxed tracking-wide text-navy/80">
              Cảm ơn bạn đã dành thời gian đọc thiệp và chung vui cùng chúng mình
            </p>
            <p className="mt-3 font-serif text-sm tracking-widest">
              {wedding.bride.shortName} &amp; {wedding.groom.shortName}
            </p>
          </Section>
        </Block>
      </main>
    </>
  );
}

/** Một phần của thiệp: đệm hai bên, nền trắng hoặc xanh rất nhạt (tint) để các phần xen kẽ nhau */
function Block({ children, tint = false }: { children: React.ReactNode; tint?: boolean }) {
  return <section className={`px-5 py-12 ${tint ? "bg-tint" : "bg-white"}`}>{children}</section>;
}
