import Section from "../components/common/Section";
import { motion } from "framer-motion";
import logoHQ from "../assets/Gemini_Generated_Image_q51jg0q51jg0q51j.png";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white px-6 py-12">
      <div className="mx-auto max-w-[420px] text-center">
        <Section>
          <div className="mb-10">
            <motion.img
              src={logoHQ}
              alt="H&Q"
              className="w-[250px] mix-blend-multiply"
              initial={{
                opacity: 0,
                y: -20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 1.2,
              }}
            />
          </div>
        </Section>

        <Section>
          <div className="mt-6 grid grid-cols-2 gap-6">
            <div>
              <p className="uppercase text-sm">Nhà Gái</p>

              <p className="font-semibold">Ông: Bùi Ngọc Hiếu</p>

              <p className="font-semibold">Bà: Trần Thị Thanh</p>
            </div>

            <div>
              <p className="uppercase text-sm">Nhà Trai</p>

              <p className="font-semibold">Ông: Thái Quốc Lương</p>

              <p className="font-semibold">Bà: Lương Hoa</p>
            </div>
          </div>
        </Section>

        <Section>
          <p className="mt-12 text-lg">
            Trân trọng báo tin lễ vu quy của con chúng tôi
          </p>
        </Section>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <h2
            className="mt-10 text-[#1F2F6E]"
            style={{
              fontFamily: "Great Vibes",
              fontSize: "4rem",
            }}
          >
            Bùi Thị Thu Hương
          </h2>

          <div className="my-4 text-3xl text-[#1F2F6E]">♥</div>

          <h2
            className="text-[#1F2F6E]"
            style={{
              fontFamily: "Great Vibes",
              fontSize: "4rem",
            }}
          >
            Thái Chí Quyền
          </h2>
        </motion.div>

        <Section>
          <div className="mt-14">
            <p className="uppercase">Hôn lễ được cử hành</p>

            <p className="mt-4 text-4xl font-light">08:30</p>

            <p className="mt-4 text-5xl font-bold text-[#1F2F6E]">
              19 | 12 | 2026
            </p>
          </div>
        </Section>
      </div>
    </main>
  );
}
