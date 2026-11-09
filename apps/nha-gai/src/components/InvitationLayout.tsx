import {
  Card,
  CeremonyInfo,
  Countdown,
  CoupleNames,
  FamilyInfo,
  FloatingHearts,
  GiftBox,
  Monogram,
  MusicPlayer,
  Ornament,
  PhotoAlbum,
  PhotoHero,
  ReceptionInfo,
  Rsvp,
  SaveTheDate,
  Schedule,
  Section,
  useGuestName,
  useWedding,
  VenueActions,
} from "@wedding/shared";

/**
 * Thiệp đầy đủ: ảnh lớn → Lễ Vu Quy → thiệp mời tiệc → bản đồ → lịch trình
 * → album ảnh → đếm ngược → xác nhận tham dự → hộp mừng cưới → lời cảm ơn.
 */
export default function InvitationLayout() {
  const guestName = useGuestName();
  const { wedding, couple } = useWedding();

  return (
    <>
      <FloatingHearts />
      <MusicPlayer />

      {/* Cả thiệp là một cột liền mạch, các phần nối tiếp nhau không có khoảng hở */}
      <main className="mx-auto min-h-svh w-full max-w-[460px] overflow-hidden bg-white shadow-[0_20px_60px_-15px_color-mix(in_srgb,var(--color-navy)_50%,transparent)] sm:my-10 sm:min-h-0">
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
          <PhotoAlbum />
        </Block>

        <Block>
          <Countdown target={wedding.reception.start} />
        </Block>

        {/* Chưa điền link Google Form thì ẩn cả phần này */}
        {wedding.rsvp.formUrl && (
          <Block tint>
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
              {couple[0].shortName} &amp; {couple[1].shortName}
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
