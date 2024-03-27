const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');
const client = new Client({
  puppeteer: {
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
    ],
  },
});
var favicon = require('serve-favicon')
const express = require("express");
const { google } = require("googleapis");
const mongoose = require('mongoose');
const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
const session = require('express-session');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/Jakarta');
const port =3000;
const bodyParser = require('body-parser');
const { resourceLimits } = require('worker_threads');
const id_spreadsheets_asli ="1cpkSi_4mIZnyHFxq5ial4Yxh5YKOso4Y1XbCKbCUsog";
const id_spreadsheets_testing ="1Jbf0LtbDXsDzdmODbnVMNrZncWJUSl3ebE4KfnJN0_M";
const path = require('path');
const { error } = require('console');
// Gunakan middleware body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(express.static(path.join(__dirname, 'public')));



// fungsi untuk wa

async function sendMessage(chatId, message) {
  return await client.sendMessage(chatId, message);
}

// client.on('qr', qr => {
//   qrcode.generate(qr, { small: true });
// });

// Event saat klien siap
client.on('ready', () => {
  console.log('Client is ready!');
});



// Gunakan cookie-parser sebagai middleware
app.use(cookieParser());

// untuk session 
app.use(session({
  secret: 'rahasia-saya',
  resave: false,
  saveUninitialized: true,
}));

//untuk perintah mongo db
const uri = "mongodb+srv://MOZAACHMADDANI:02188881019@cluster0.q9565ii.mongodb.net/violet";

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(uri, options)

//tempat untuk scemha -----------------------------------------------------

// untuk komentar
// Create a schema for storing VCF data
const akun_karyawan_violet = new mongoose.Schema({
  username:String,
  password:String,
  nama: String,
  nik: String,
  nomer_telfon:String,
  divisi:String,
  lokasi_kerja:String,
  jumlah_login:String
});

const kirim_akun_karyawan_violet = mongoose.model('akun_karyawan_violets', akun_karyawan_violet);

const input_akun_karyawan_violet = new kirim_akun_karyawan_violet({
  username:"adi",
  password: "adi123123",
  nama: "adi suryadi",
  nik: "005",
  nomer_telfon:"085779336158",
  divisi:"editor",
  lokasi_kerja:"grand wisata",
  jumlah_login:"1"
});



// input_akun_karyawan_violet.save();

  // Mengatur cookie agar kadaluarsa dalam 3 bulan
  const expirationDate = new Date();
  expirationDate.setMonth(expirationDate.getMonth() + 3);


// Fungsi untuk mengenkripsi teks
function enkripsi(text, secretKey) {
  const cipher = crypto.createCipher('aes-256-cbc', secretKey);
  let encrypted = cipher.update(text, 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}


// Fungsi untuk mendekripsi teks
function buka_enkripsi(encryptedText, secretKey) {
  const decipher = crypto.createDecipher('aes-256-cbc', secretKey);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');
  return decrypted;
}


const secretKey = 'kuncirahasia'; // Ganti ini dengan kunci rahasia 



// funsi untuk akun hitung waktu
function hitung_waktu_string(waktuAwalBingit, waktuAkhirBingit) {
  // Waktu awal
  let waktuAwal = waktuAwalBingit;
  let [jamAwal, menitAwal, detikAwal] = waktuAwal.split(":").map(Number);

  // Waktu akhir
  let waktuAkhir = waktuAkhirBingit;
  let [jamAkhir, menitAkhir, detikAkhir] = waktuAkhir.split(":").map(Number);

  // Konversi waktu ke detik
  let detikAwalTotal = jamAwal * 3600 + menitAwal * 60 + detikAwal;
  let detikAkhirTotal = jamAkhir * 3600 + menitAkhir * 60 + detikAkhir;

  // Hitung selisih detik
  let selisihDetik = detikAkhirTotal - detikAwalTotal;

  // Konversi selisih detik ke jam, menit, dan detik
  let jamSelisih = Math.floor(selisihDetik / 3600);
  let sisaDetik = selisihDetik % 3600;
  let menitSelisih = Math.floor(sisaDetik / 60);
  let detikSelisih = sisaDetik % 60;

  let jumlahWaktu = `${jamSelisih}:${menitSelisih}:${detikSelisih}`;
  
  // Kembalikan hasil perhitungan waktu
  return jumlahWaktu;
}

// ini untuk buat akun karyawan
app.get("/buat_akun_karyawan", (req, res) => {
  if(req.session.status=="login" && req.session.divisi === "HRD"){
  res.render("buat_akun_karyawan",{
    data_masuk:"tidak ada"
  });
  }
  else{
    res.redirect("/login");
  }
});


app.get("/", async (req, res) => {

  res.render("welcome");
});


// data akun karyawana
app.get("/data_akun_karyawan", async (req, res) => {
  if(req.session.status=="login" && req.session.divisi === "HRD"){
    
    const db_data = await kirim_akun_karyawan_violet.find({},'username password nama nik divisi lokasi_kerja jumlah_login nomer_telfon').exec();
  
    res.render("data_akun_karyawan",{
    data_masuk:"tidak ada",
    nama : req.session.nama,
    username:req.session.username,
    password:req.session.password,
    status_nik:req.session.nik,
    status_login:req.session.status,
    data_akun_karyawan:db_data
  });
  }
  else{
    res.redirect("/login");
  }
});
// untuk perintah get dan post
app.get("/sukses_absen", (req, res) => {
  if(req.session.status=="login"){
  res.render("berhasil_absen",{
    nama : req.session.nama,
    username:req.session.username,
    password:req.session.password,
    status_nik:req.session.nik,
    status_login:req.session.status
  });
  }else {
    res.redirect("login")
  }
});


// ini untuk scan masuk
app.get("/scan_absen_masuk", (req, res) => {
  const currentTime = moment();
  if(req.session.status=="login"){
    if(req.session.keterangan_absen==`absen masuk`){
  console.log(`--------------`);
  console.log(`Jam ${currentTime.format("HH:mm:ss")}}`);
  console.log(`Nama Ingin Absen Masuk: ${req.session.nama}`);
  console.log(`--------------`);
  req.session.status_gps="";
  res.render("scan_absen_masuk");
    }
    else{
      res.redirect("/login");
    }
      } else{
    res.redirect("/login");
  }
});

// ini untuk scan pulang
app.get("/scan_absen_pulang", (req, res) => {
  const currentTime = moment();
  if(req.session.status=="login"){
    if(req.session.keterangan_absen==`absen pulang`){
    console.log(`--------------`);
    console.log(`Jam ${currentTime.format("HH:mm:ss")}}`);
    console.log(`Nama Ingin Absen Pulang: ${req.session.nama}`);
    console.log(`--------------`);
    req.session.status_gps="";
    res.render("scan_absen_pulang");
    }
    else{
      res.redirect("/login")
    }
      }else{
    res.redirect("/login");
  }
});

app.get('/login', async (req, res) => {
  const { status_login } = req.query;
  let status_login_ke_ejs;

  if (status_login) {
    status_login_ke_ejs = status_login;
  } else {
    status_login_ke_ejs = false;
  }


  if (req.session.status === "login") {

    const db_data = await kirim_akun_karyawan_violet.findOne({
      username: req.session.username,
      password: req.session.password,
      nama: req.session.nama
    }, 'username password nama nik divisi lokasi_kerja jumlah_login nomer_telfon').exec();

    if(db_data){
      req.session.username = db_data.username;
      req.session.password = db_data.password;
      req.session.lokasi_kerja = db_data.lokasi_kerja;
      req.session.nama = db_data.nama;
      req.session.nik = db_data.nik;
      req.session.divisi = db_data.divisi;
      req.session.nomer_telfon = db_data.nomer_telfon;
      req.session.status= "login";
      res.redirect("/home");

    }
    else{
      res.redirect("/logout")
    }
  
  }
    else if(req.cookies.username && req.cookies.password) {
      const db_data = await kirim_akun_karyawan_violet.findOne({
        username: buka_enkripsi(req.cookies.username, secretKey),
        password: buka_enkripsi(req.cookies.password, secretKey),
        nama: buka_enkripsi(req.cookies.nama, secretKey)
      }, 'username password nama nik divisi lokasi_kerja jumlah_login nomer_telfon').exec();
  
      if (db_data) {
        req.session.username = db_data.username;
        req.session.password = db_data.password;
        req.session.lokasi_kerja = db_data.lokasi_kerja;
        req.session.nama = db_data.nama;
        req.session.nik = db_data.nik;
        req.session.divisi = db_data.divisi;
        req.session.nomer_telfon = db_data.nomer_telfon;
        req.session.status= "login";
        res.redirect("/home");
      }
      else{
        res.redirect("/logout");
      }
    }
    else{
      res.render("login",{
        statusnya:status_login_ke_ejs
      });
    }


});



app.post('/login/proses_login', async (req, res) => {
  const { username, password } = req.body;

    const db_data = await kirim_akun_karyawan_violet.findOne({username:username,password:password},'username password nama nik divisi lokasi_kerja jumlah_login nomer_telfon').exec();
    if (db_data && db_data.divisi == "HRD" ) {
      res.cookie('username',enkripsi(db_data.username, secretKey), {expires: expirationDate,httpOnly: true});
      res.cookie('password',enkripsi(db_data.password, secretKey), {expires: expirationDate,httpOnly: true});
      res.cookie('nama',enkripsi(db_data.nama, secretKey),{expires: expirationDate,httpOnly: true});
    
    
      console.log('Data ditemukan:');
      console.log(db_data.username);
      console.log(db_data.password);
      console.log(db_data.nama);
      req.session.username = db_data.username;
      req.session.password = db_data.password;
      req.session.lokasi_kerja = db_data.lokasi_kerja;
      req.session.nama = db_data.nama;
      req.session.nik = db_data.nik;
      req.session.divisi = db_data.divisi;
      req.session.nomer_telfon = db_data.nomer_telfon;
      req.session.status= "login";

      // ni untuk wa
    //   try {
    //     const number = `+62${req.session.nomer_telfon}`;
    //     const text = `Anda Berhasil Login! *${req.session.nama}* hubungi HRD jika anda tidak merasa Login dan anda hanya bisa login sekali!`;
    //     const chatId = `${number.substring(1)}@c.us`;
    //    await sendMessage(chatId, text);
    //    res.redirect("/home");
    //  } catch (error) {
    //    console.error('Error sending message:', error);
    //    res.redirect("/home");
    //  }
    res.redirect("/home");
    }

  else if (db_data && db_data.jumlah_login == "0" ) {
  res.cookie('username',enkripsi(db_data.username, secretKey), {expires: expirationDate,httpOnly: true});
  res.cookie('password',enkripsi(db_data.password, secretKey), {expires: expirationDate,httpOnly: true});
  res.cookie('nama',enkripsi(db_data.nama, secretKey),{expires: expirationDate,httpOnly: true});


  console.log('Data ditemukan:');
  console.log(db_data.username);
  console.log(db_data.password);
  console.log(db_data.nama);
  req.session.username = db_data.username;
  req.session.password = db_data.password;
  req.session.lokasi_kerja = db_data.lokasi_kerja;
  req.session.nama = db_data.nama;
  req.session.nik = db_data.nik;
  req.session.divisi = db_data.divisi;
  req.session.nomer_telfon = db_data.nomer_telfon;
  req.session.status= "login";

  kirim_akun_karyawan_violet.findOneAndUpdate(
    { username: req.session.username, password:req.session.password },
    { $set: { jumlah_login: "1" } },
    { new: true }
  )
    .then(updatedDocument => {
      if (updatedDocument) {
        console.log('Data berhasil diupdate jumlah loginya:', updatedDocument);
      } else {
        console.log('Tidak ada data yang diupdate.');
      }
    })
    .catch(error => {
      console.error('Terjadi kesalahan:', error);
    });


    try {
      const number = `+62${req.session.nomer_telfon}`;
      const text = `Anda Berhasil Login! ${req.session.nama} hubungi HRD jika anda tidak merasa Login dan anda hanya bisa login sekali!`;
      const chatId = `${number.substring(1)}@c.us`;
     await sendMessage(chatId, text);
     res.redirect("/home");
   } catch (error) {
     console.error('Error sending message:', error);
     res.redirect("/home");
   }
}
else if( db_data && db_data.jumlah_login==="1"){
  res.redirect('/login?status_login=sudah login sekali tolong hubungi HRD atau Developer untuk mereset ulang login');

}
else {
  console.log('Data tidak ditemukan');
  res.redirect('/login?status_login=salah');
}

});
app.get('/home', async (req,res)=>{
if(req.session.status=="login"){
  // const currentTime = moment();
  // const auth = new google.auth.GoogleAuth({
  //   keyFile: "credentials.json",
  //   scopes: "https://www.googleapis.com/auth/spreadsheets",
  // });

  // // ... (kode lainnya)

  // const sheets = google.sheets('v4');
  // const spreadsheetId = id_spreadsheets_asli;
  // const range = "Sheet1!A:H";

  // const getCells = await sheets.spreadsheets.values.get({
  //   auth,
  //   spreadsheetId,
  //   range,
  // });

  // const rowIndex = await getCells.data.values.findIndex(row => row[1] === req.session.nik && row[3] === currentTime.format('YYYY-MM-DD')); // Menggunakan 'true' karena data di spreadsheet biasanya berupa string

  // try{
  //   console.log(`${req.session.status_absen_nama}${req.session.status_absen_jam_masuk}${req.session.status_absen_jam_pulang}${getCells.data.values[rowIndex][1]}`)
  

  // if(req.session.status_absen_jam_masuk || req.session.status_absen_jam_pulang){
  //   console.log("session data sudah ada");
  // }
  // else{
  //   console.log("data belum ada");
  //   req.session.status_absen_nama=getCells.data.values[rowIndex][0];
  //   req.session.status_absen_jam_masuk=getCells.data.values[rowIndex][6];
  //   req.session.status_absen_jam_pulang=getCells.data.values[rowIndex][7];
  //   console.log("namun sudah di buat");
  // }

  // }
  // catch{
  //   req.session.status_absen_nama=false;
  //   req.session.status_absen_jam_masuk=false;
  //   req.session.status_absen_jam_pulang=false;
  //   console.log("kita semua buat session fasle semua");
  // }
  const db_data = await kirim_akun_karyawan_violet.findOne({nama:req.session.nama,username:req.session.username,password:req.session.password},"nama username password").exec();
  
  if(db_data){
    res.render("home",{
      nama : req.session.nama,
      username:req.session.username,
      password:req.session.password,
      status_login:req.session.status,
      divisi:req.session.divisi
      // absen:[req.session.status_absen_nama,req.session.status_absen_jam_masuk,req.session.status_absen_jam_pulang]                   
      });
  }
  else{
    res.redirect("/login");
  }
}
else{
  res.redirect("/login")
}
});


app.get('/logout',(req,res)=>{

  req.session.destroy();
  res.clearCookie('username');
  res.clearCookie('password');
  res.clearCookie('nama');
  res.redirect("/login");

});


app.get("/pilih_absen", async (req, res) => {

  if (req.session.status == "login") {
    if(req.session.status_gps == "lulus"){
    const currentTime = moment();
    const auth = new google.auth.GoogleAuth({
      keyFile: "credentials.json",
      scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    // ... (kode lainnya)

    const sheets = google.sheets('v4');
    const spreadsheetId = id_spreadsheets_asli;
    const range = "Sheet1!A:H";

    // Dapatkan nilai sel di dalam kolom A (asumsikan kolom A adalah yang ingin diedit)
    const getCells = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range,
    });

    // Dapatkan indeks baris yang sesuai dengan session.nik (misalnya, asumsikan session.nik ada di kolom A)
    const rowIndex = getCells.data.values.findIndex(row => row[1] === req.session.nik && row[3] === currentTime.format('YYYY-MM-DD')); // Menggunakan 'true' karena data di spreadsheet biasanya berupa string

    if (rowIndex !== -1) {
      const jam_absen_masuk = getCells.data.values[rowIndex][6];
      const jam_absen_pulang = getCells.data.values[rowIndex][7];
      if(!jam_absen_pulang){
      console.log(`test ${jam_absen_pulang}`);
        console.log(`pilihanya absen pulang ${req.session.nama}`);
        req.session.keterangan_absen="absen pulang";
        res.render("pilih_absen",{
          jam_absen_masuk:true,
          jam_absen_pulang:false,
        });
      }
      else{
        req.session.keterangan_absen=false;
        res.render("berhasil_absen",{
          nama:req.session.nama
        });
      }
      // res.render("pilih_absen",{
      //   jenis_absen:data_h
      // });

    } else {
      console.log(`pilihanya absen masuk ${req.session.nama}`);
      req.session.keterangan_absen="absen masuk";
      res.render("pilih_absen",{
        jam_absen_masuk:false,
        jam_absen_pulang:false
    });
    }
   
  }
    else{
      res.redirect("/get_gps");
    }
  } else {
     res.redirect("/login");
  }
});

app.get("/data_absen_masuk_karyawan", async (req, res) => {
  const {lokasi} = req.query;


if(req.session.status=="login"){
 const currentTime = moment();
 const auth = new google.auth.GoogleAuth({
   keyFile: "credentials.json",
   scopes: "https://www.googleapis.com/auth/spreadsheets",
 });

 // Create client instance for auth
 const client = await auth.getClient();

 // Instance of Google Sheets API
 const googleSheets = google.sheets({ version: "v4", auth: client });

 const spreadsheetId = id_spreadsheets_asli;

 // Get metadata about spreadsheet
 const metaData = await googleSheets.spreadsheets.get({
   auth,
   spreadsheetId,
 });

 // Read rows from spreadsheet
 const getRows = await googleSheets.spreadsheets.values.get({
   auth,
   spreadsheetId,
   range: "Sheet1!A:A",
 });

 // Write row(s) to spreadsheet
 await googleSheets.spreadsheets.values.append({
   auth,
   spreadsheetId,
   range: "Sheet1!A:B",
   valueInputOption: "USER_ENTERED",
   resource: {
    values: [[req.session.nama,`'${req.session.nik}`,req.session.lokasi_kerja,currentTime.format('YYYY-MM-DD'),lokasi,req.session.divisi,currentTime.format('HH:mm:ss')]],
   },
 });
 console.log(`-------------------------------`);
 console.log(`jam ${currentTime.format("HH:mm:ss")}}`);
 console.log(`Data Absen masuk`);
 console.log(`username = ${req.session.username}`);
 console.log(`nik = ${req.session.nik}`);
 console.log(`nama = ${req.session.nama}`);
 console.log(`divisi = ${req.session.divisi}`);
 console.log(`lokasi = ${lokasi}`);
 console.log(`lokasi kerja = ${req.session.lokasi_kerja}`);
 console.log(`-------------------------------`);
 req.session.keterangan_absen="absen pulang";


//  try {
//    // untuk wa
//  const number = `+62${req.session.nomer_telfon}`;
//  const text = `Anda Berhasil Absen Masuk! *${req.session.nama}* hubungi HRD jika anda tidak merasa absen`;
//  const chatId = `${number.substring(1)}@c.us`;
//   await sendMessage(chatId, text);
//   res.redirect("/sukses_absen");
// } catch (error) {
//   console.error('Error sending message:', error);
//   res.redirect("/sukses_absen");
// }
 res.redirect("/sukses_absen");

 
}
else{
 res.redirect("/login");
}
});

// untuk absen pualng
app.get("/data_absen_pulang_karyawan", async (req, res) => {
  const { lokasi } = req.query;

  if (req.session.status == "login") {
    const currentTime = moment();
    const auth = new google.auth.GoogleAuth({
      keyFile: "credentials.json",
      scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    // ... (kode lainnya)

    const sheets = google.sheets('v4');
    const spreadsheetId = id_spreadsheets_asli;
    const range = "Sheet1!A:I";

    // Dapatkan nilai sel di dalam kolom A (asumsikan kolom A adalah yang ingin diedit)
    const getCells = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range,
    });

    
    // Dapatkan indeks baris yang sesuai dengan session.nik (misalnya, asumsikan session.nik ada di kolom A)
    const rowIndex = getCells.data.values.findIndex(row => row[1] === req.session.nik && row[3] === currentTime.format('YYYY-MM-DD') );
    if (rowIndex !== -1) {
      console.log(parseInt("12:34:02"));
      const waktuSelisih = hitung_waktu_string(getCells.data.values[rowIndex][6], currentTime.format('HH:mm:ss') );
      let jadwal_absen;
      console.log(parseInt(waktuSelisih,10));
    
      if(parseInt(waktuSelisih,10) >= 11 && parseInt(getCells.data.values[rowIndex][6]) <= 10 ){
        console.log("dia long");
        jadwal_absen = "Long";
      }else if(parseInt(waktuSelisih,10) >= 5 && parseInt(getCells.data.values[rowIndex][6]) <= 10 ){
        console.log("dia pagi");
        jadwal_absen = "pagi";
      }
      else if(parseInt(waktuSelisih,10) >= 5 && parseInt(getCells.data.values[rowIndex][6]) >= 11 ){
        console.log("dia siang");
        jadwal_absen = "siang";
      }
      else{
        console.log("tidak sesuai jadwal");
        jadwal_absen = "tidak sesuai";
      }

      // Update nilai di dalam kolom H dan I di baris yang sesuai
      await sheets.spreadsheets.values.update({
        auth,
        spreadsheetId,
        range: `Sheet1!H${rowIndex + 1}:I${rowIndex + 1}`, // +1 karena indeks dimulai dari 0
        valueInputOption: "USER_ENTERED",
        resource: {
          values: [[currentTime.format('HH:mm:ss'),jadwal_absen]],
        },
      });

    
      console.log(`-------------------------------`);
      console.log(`jam ${currentTime.format("HH:mm:ss")}}`);

      console.log(`Data Absen Pulang`);
      console.log(`username = ${req.session.username}`);
      console.log(`nik = ${req.session.nik}`);
      console.log(`nama = ${req.session.nama}`);
      console.log(`divisi = ${req.session.divisi}`);
      console.log(`lokasi = ${lokasi}`);
      console.log(`lokasi kerja = ${req.session.lokasi_kerja}`);
      console.log(`-------------------------------`);
      req.session.keterangan_absen=false;

    //   try {
    //     // kirim ke wa
    //     const number = `+62${req.session.nomer_telfon}`;
    //     const text = `Anda Berhasil Absen Pulang! *${req.session.nama}* hubungi HRD jika anda tidak merasa absen`;
    //     const chatId = `${number.substring(1)}@c.us`;
    //    await sendMessage(chatId, text);
    //    res.redirect("/sukses_absen");
    //  } catch (error) {
    //    console.error('Error sending message:', error);
    //    res.redirect("/sukses_absen");
    //  }
     res.redirect("/sukses_absen");

    } else {
      console.log('Data tidak ditemukan untuk session.nik tertentu.');
      return res.redirect("/login");
    }
  } else {
    return res.redirect("/login");
  }
});


// ini untuk ionput put
app.post('/buat_akun', async (req, res) => {
  const { komentar,nama,waktu } = req.body;
  console.log(req.body);

  //untuk waktu------------
  //batasnya ------------

  const data_komentar = new kirim_komentar({
    nama_akun: nama,
    komentar: komentar,
    tanggal: waktu
  });
  data_komentar.save();
  const respon = {new:true}

  res.json(respon);

});

app.post("/proses_buat_akun_karyawan", async (req, res) => {
  const {nama,username,password,nomer_telfon,divisi,lokasi_kerja} = req.body;
  if(req.session.status=="login"){

    const db_data = await kirim_akun_karyawan_violet.findOne({},'username password nama nik divisi lokasi_kerja').sort({ _id: -1 }).exec();
    const cari_data_sesuai = await kirim_akun_karyawan_violet.findOne({username:username,password:password},'username password nama nik divisi lokasi_kerja').sort({ _id: -1 }).exec();
    console.log(db_data.nik);
    const nik_int=parseInt(db_data.nik, 10);
    const buat_nik_baru=nik_int+1;

    const input_akun_karyawan_violet = new kirim_akun_karyawan_violet({
      username:username,
      password: password,
      nama: nama,
      nik: buat_nik_baru,
      nomer_telfon:nomer_telfon,
      divisi:divisi,
      lokasi_kerja:lokasi_kerja,
      jumlah_login:"0"
    });

    if(cari_data_sesuai){
      console.log(`data sudah ada`);
      res.render("buat_akun_karyawan",{
        username:username,
        password: password,
        nama: nama,
        nomer_telfon:nomer_telfon,
        divisi:divisi,
        lokasi_kerja:lokasi_kerja,
        data_masuk:"ada"
      });
    }
    else{

      input_akun_karyawan_violet.save();
      console.log(`${username}`);
      console.log(`${password}`);
      console.log(`${nama}`);
      console.log(`${nomer_telfon}`);
      console.log(`${divisi}`);
      console.log(`${lokasi_kerja}`);
      console.log(`berhasil membuat akun karyawan`);


      try{
        // untuk wa
        const number = `+62${nomer_telfon}`;
        const text = `Assalamualaikum Sdr/i *${nama}*
  
Selamat Bergabung di Keluarga Violet!
Anda Berhasil Membuat Akun Absen Karyawan!
denga data sebagai berikut
Nama : ${nama}
Username : ${username}
Password : ${password}
nomertelfon : ${nomer_telfon}
divisi : ${divisi}
Lokasi Kerja : ${lokasi_kerja}
Nik : ${buat_nik_baru}
        
Jika ada ketidak sesuaian data maka mohon untuk hubungi HRD.
  
untuk login absen ada dapat di https://absen.karyawanviolet.my.id/
Terimaksih
Salam
HR Violet
        `;
        const chatId = `${number.substring(1)}@c.us`;
        await sendMessage(chatId, text);
      }
      catch{
        console.error('Error sending message:', error);
      }
      res.redirect("/home");
    }
  }
  else{
    res.redirect("/login");
  }
});


// Gpss
app.get('/get_gps', async (req, res) => {

if(req.session.status == "login"){
  const {lat,lng} = req.query;
  res.render("get_gps");

}
else{
res.redirect("/home");
}

});



// Gpss
app.get('/lulus_get_gps', async (req, res) => {
if(req.session.status){
const {token_gps} = req.query;
console.log(token_gps);
req.session.status_gps= token_gps;
res.redirect("pilih_absen");
}else{
res.redirect("/home");
}
});

app.put('/hapus_akun/:id_akun_hapus', async (req, res) => {
  try {
    const { id_akun_hapus } = req.params;
    const { Hapus_akun } = req.body; // Make sure the key matches the front-end code
    console.log(Hapus_akun);
    console.log(id_akun_hapus);

    if (Hapus_akun == true) {
      const Hapus_akun = await kirim_akun_karyawan_violet.deleteOne({ _id: id_akun_hapus });
      res.json(Hapus_akun);
    } else {
      console.log("datanya false");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
});


app.get('/form_izin', async (req,res)=>{
  if(req.session.status === "login"){
    const currentTime = moment();
    const auth = new google.auth.GoogleAuth({
      keyFile: "credentials.json",
      scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    // ... (kode lainnya)

    const sheets = google.sheets('v4');
    const spreadsheetId = id_spreadsheets_asli;
    const range = "Sheet1!A:H";

    // Dapatkan nilai sel di dalam kolom A (asumsikan kolom A adalah yang ingin diedit)
    const getCells = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range,
    });

    // Dapatkan indeks baris yang sesuai dengan session.nik (misalnya, asumsikan session.nik ada di kolom A)
    const rowIndex = getCells.data.values.findIndex(row => row[1] === req.session.nik && row[3] === currentTime.format('YYYY-MM-DD')); // Menggunakan 'true' karena data di spreadsheet biasanya berupa string

if (rowIndex !== -1) {
      const tanggal = getCells.data.values[rowIndex][3];
      const jam_absen_pulang = getCells.data.values[rowIndex][7];

      if(tanggal === currentTime.format('YYYY-MM-DD')){
        res.redirect("/sukses_absen");
      }
      else{
        res.redirect("/sukses_absen");

      }


    }
    else{
     res.render("form_izin");
    }
  }
  else{
    res.redirect("/home");
  }
})

app.post("/proses_izin", async (req, res) => {
  const {izin,pesan} = req.body;
  if(req.session.status=="login"){

    const currentTime = moment();
    const auth = new google.auth.GoogleAuth({
      keyFile: "credentials.json",
      scopes: "https://www.googleapis.com/auth/spreadsheets",
    });
   
    // Create client instance for auth
    const client = await auth.getClient();
   
    // Instance of Google Sheets API
    const googleSheets = google.sheets({ version: "v4", auth: client });
   
    const spreadsheetId = id_spreadsheets_asli;
   
    // Get metadata about spreadsheet
    const metaData = await googleSheets.spreadsheets.get({
      auth,
      spreadsheetId,
    });
   
    // Read rows from spreadsheet
    const getRows = await googleSheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: "Sheet1!A:A",
    });
   
    // Write row(s) to spreadsheet
    await googleSheets.spreadsheets.values.append({
      auth,
      spreadsheetId,
      range: "Sheet1!A:B",
      valueInputOption: "USER_ENTERED",
      resource: {
       values: [[req.session.nama,`'${req.session.nik}`,req.session.lokasi_kerja,currentTime.format('YYYY-MM-DD'),`${pesan}`,req.session.divisi,currentTime.format('HH:mm:ss'),``,`${izin}`]],
      },
    });
    console.log(`Data Absen yang ke data masuk`);
    console.log(`username = ${req.session.username}`);
    console.log(`nik = ${req.session.nik}`);
    console.log(`nama = ${req.session.nama}`);
    console.log(`divisi = ${req.session.divisi}`);
    console.log(`lokasi kerja = ${req.session.lokasi_kerja}`);
    console.log("sakit")
    res.redirect("/sukses_absen");

    
  }
  else{
    res.redirect("/login");
  }
});
// untuk perintah get dan post
app.get("/data_absen", async (req, res) => {
  if(req.session.status === "login"){
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  // ... (kode lainnya)

  const sheets = google.sheets('v4');
  const spreadsheetId = id_spreadsheets_asli;
  const range = "Sheet1!A:I";

  try {
    const currentTime = moment();
    const {tanggal, bulan} = req.query;

    if(tanggal){

      // untuk bulan
    if(tanggal==="Januari"){
      var bulan_tahun = `${currentTime.format("YYYY")}-01`;
      console.log("mencari rekap absen :");
      console.log(bulan_tahun); 
    }else if(tanggal==="Februari"){
      var bulan_tahun = `${currentTime.format("YYYY")}-02`;
      console.log("mencari rekap absen :");
      console.log(bulan_tahun); 
    }else if(tanggal==="Maret"){
      var bulan_tahun = `${currentTime.format("YYYY")}-03`;
      console.log("mencari rekap absen :");
      console.log(bulan_tahun); 
    }else if(tanggal==="April"){
      var bulan_tahun = `${currentTime.format("YYYY")}-04`;
      console.log("mencari rekap absen :");
      console.log(bulan_tahun); 
    }else if(tanggal==="Mei"){
      var bulan_tahun = `${currentTime.format("YYYY")}-05`;
      console.log("mencari rekap absen :");
      console.log(bulan_tahun); 
    }else if(tanggal==="Juni"){
      var bulan_tahun = `${currentTime.format("YYYY")}-06`;
      console.log("mencari rekap absen :");
      console.log(bulan_tahun); 
    }else if(tanggal==="Juli"){
      var bulan_tahun = `${currentTime.format("YYYY")}-07`;
      console.log("mencari rekap absen :");
      console.log(bulan_tahun); 
    }else if(tanggal==="Agustus"){
      var bulan_tahun = `${currentTime.format("YYYY")}-08`;
      console.log("mencari rekap absen :");
      console.log(bulan_tahun); 
    }else if(tanggal==="September"){
      var bulan_tahun = `${currentTime.format("YYYY")}-09`;
      console.log("mencari rekap absen :");
      console.log(bulan_tahun); 
    }else if(tanggal==="Oktober"){
      var bulan_tahun = `${currentTime.format("YYYY")}-10`;
      console.log("mencari rekap absen :");
      console.log(bulan_tahun); 
    }else if(tanggal==="November"){
      var bulan_tahun = `${currentTime.format("YYYY")}-11`;
      console.log("mencari rekap absen :");
      console.log(bulan_tahun); 
    }else if(tanggal==="Desember"){
      var bulan_tahun = `${currentTime.format("YYYY")}-12`;
      console.log("mencari rekap absen :");
      console.log(bulan_tahun); 
    }
    else{
      res.redirect("/data_absen");
    }

    const { data } = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range,  
    });
    
    const values = data.values;
    
    if (values && values.length) {

      const target_nik = req.session.nik;
      const filteredRows = values.filter(row => row[1] === req.session.nik && row[3].startsWith(bulan_tahun));

    
      if (filteredRows.length > 0) {
        // Menampilkan semua data yang sesuai
        console.log(`Data spreadsheet nik : ${target_nik} ${req.session.nama}:`);
        console.log(`---------------------------------------------------`);
        res.render("data_absen",{
          nama:req.session.nama,
          nik:req.session.nik,
          rekap_absen:filteredRows,
          data:true,
          bulan:true
        });
  
      } else {
        res.redirect("/data_absen?bulan=tidakada");
      }
    } else {
      console.log('No data found.');
    }
  }
  else if(bulan === "tidakada"){
    res.render("data_absen",{
      tanggal:tanggal,
      nama:req.session.nama,
      nik:req.session.nik,
      data:false,
      bulan:false
    })
  }
  else{
    res.render("data_absen",{
      nama:req.session.nama,
      nik:req.session.nik,
      data:false,
      bulan:true
    });
  }
    
  } catch (error) {
    console.error("Error retrieving data:", error);
    res.status(500).send("Servernya Eror Boskuuu tunggu beberapa detik untuk reload halaman lagi atau hubungi Developer");
  }
}else{
  res.redirect("/login");
}
});


client.initialize();
app.listen(port, (req, res) => console.log(`berjalan di port ${port}`));

