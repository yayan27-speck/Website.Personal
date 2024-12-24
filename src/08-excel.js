function pencadanganData() {

  // Membuat workbook
  const wb = XLSX.utils.book_new();

  // Mengkonversi data ke worksheet
  const wsSiswa = XLSX.utils.json_to_sheet(dataSiswa)
  const tempDataAbsen = []
  for (let z = 0; z < dataAbsen.length; z++) {
    const element = dataAbsen[z];

    const cariSiswa = dataSiswa.find(d => d.nomor === element.nomor)
    if (typeof cariSiswa === 'undefined') continue

    tempDataAbsen.push({ nomor: element.nomor, nama: cariSiswa.nama, tanggal: element.tanggal, jam: element.jam })
  }

  const wsAbsen = XLSX.utils.json_to_sheet(tempDataAbsen)

  // Menambahkan worksheet ke workbook
  XLSX.utils.book_append_sheet(wb, wsSiswa, Sheet1);
  XLSX.utils.book_append_sheet(wb, wsAbsen, Sheet2);

  // Menggunakan write untuk mendapatkan data dalam bentuk array
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

  // Mengkonversi data array ke blob
  const blob = new Blob([new Uint8Array(wbout)], { type: 'application/octet-stream' });

  // Membuat link unduhan dan mengkliknya untuk mengunduh
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'absen.xlsx';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function pemulihanData() {
  const input = document.getElementById('upload');
  const file = input.files[0];

  const reader = new FileReader();
  reader.onload = function (event) {
    const data = event.target.result;
    const workbook = XLSX.read(data, { type: 'binary' });

    // Mengambil nama sheet pertama
    const wsSiswa = workbook.Sheets[Sheet1];
    const wsAbsen = workbook.Sheets[Sheet2];

    // Mengkonversi worksheet ke array objek
    dataSiswa = XLSX.utils.sheet_to_json(wsSiswa);
    dataAbsen = XLSX.utils.sheet_to_json(wsAbsen);

    simpanData(keySiswa, dataSiswa)
    simpanData(keyAbsen, dataAbsen)
    tampilkanDataSiswa()
    tampilkanDataAbsen()
  };
  reader.readAsArrayBuffer(file);
}
