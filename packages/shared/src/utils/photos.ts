// Ảnh cưới dùng chung cho cả hai thiệp: packages/shared/src/assets/photos (bản lớn, rộng 1400px)
// và packages/shared/src/assets/photos/thumbs (bản nhỏ 400px, cùng tên file).
// Lúc build, Vite chép ảnh vào dist/assets và thêm mã vào tên file, nên đổi ảnh là khách thấy ảnh mới ngay.

const full = import.meta.glob<string>("../assets/photos/*.{jpg,jpeg,png,webp}", {
  eager: true,
  query: "?url",
  import: "default",
});
const thumbs = import.meta.glob<string>("../assets/photos/thumbs/*.{jpg,jpeg,png,webp}", {
  eager: true,
  query: "?url",
  import: "default",
});

function find(files: Record<string, string>, folder: string, name: string) {
  const url = files[`${folder}/${name}`];
  if (!url) console.warn(`Không tìm thấy ảnh "${name}" trong ${folder.replace("../", "packages/shared/src/")}`);
  return url ?? "";
}

/** Đường dẫn ảnh lớn theo tên file, ví dụ photoUrl("tho-0528.jpg") */
export const photoUrl = (name: string) => find(full, "../assets/photos", name);

/** Đường dẫn ảnh nhỏ (dùng cho dải ảnh trong album) */
export const thumbUrl = (name: string) => find(thumbs, "../assets/photos/thumbs", name);
