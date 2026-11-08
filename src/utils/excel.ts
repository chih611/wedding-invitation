import { extractGuestNames, type ExtractResult } from "./guests";

// Thư viện Excel khá nặng, chỉ tải khi cần (không làm chậm trang thiệp của khách)
const loadXlsx = () => import("xlsx");

export interface ImportResult extends ExtractResult {
  sheet: string;
}

/** Đọc file .xlsx / .xls / .csv và lấy danh sách tên khách */
export async function importGuestFile(file: File): Promise<ImportResult> {
  const name = file.name.toLowerCase();
  const XLSX = await loadXlsx();
  let workbook;
  if (name.endsWith(".csv")) {
    workbook = XLSX.read(await file.text(), { type: "string" });
  } else {
    const data = new Uint8Array(await file.arrayBuffer());
    // File .xlsx thật luôn là file nén ZIP (bắt đầu bằng "PK").
    // Không kiểm tra .xls vì nhiều phần mềm xuất .xls dạng HTML.
    if (name.endsWith(".xlsx") && !(data[0] === 0x50 && data[1] === 0x4b)) {
      throw new Error("Không phải file Excel hợp lệ");
    }
    workbook = XLSX.read(data, { type: "array" });
  }

  // Dùng sheet đầu tiên có tên khách
  for (const sheet of workbook.SheetNames) {
    const rows = XLSX.utils.sheet_to_json<string[]>(workbook.Sheets[sheet], {
      header: 1,
      raw: false,
      defval: "",
      blankrows: false,
    });
    const result = extractGuestNames(rows);
    if (result.names.length > 0) return { ...result, sheet };
  }
  return { names: [], column: "", sheet: "" };
}

/** Tạo và tải về file .xlsx */
export async function downloadXlsx(fileName: string, sheetName: string, rows: string[][], colWidths: number[]) {
  const XLSX = await loadXlsx();
  const sheet = XLSX.utils.aoa_to_sheet(rows);
  sheet["!cols"] = colWidths.map((wch) => ({ wch }));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, sheetName);
  XLSX.writeFile(workbook, fileName);
}

/** File mẫu để điền danh sách khách */
export function downloadTemplate() {
  return downloadXlsx(
    "mau-danh-sach-khach-moi.xlsx",
    "Khách mời",
    [
      ["STT", "Xưng hô", "Họ và tên", "Ghi chú"],
      ["1", "Anh", "Nam", "Bạn đại học"],
      ["2", "Chị", "Lan & gia đình", "Đồng nghiệp"],
      ["3", "", "Bạn Minh", ""],
    ],
    [6, 10, 30, 25],
  );
}
