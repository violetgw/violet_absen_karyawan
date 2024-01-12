const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');
const client = new Client();

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


// client.on('qr', qr => {
//   qrcode.generate(qr, { small: true });
// });

// client.on('ready', () => {
//   console.log('Client is ready!');
// });



// client.initialize();




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
  lokasi_kerja:String
});

const kirim_akun_karyawan_violet = mongoose.model('akun_karyawan_violets', akun_karyawan_violet);

const input_akun_karyawan_violet = new kirim_akun_karyawan_violet({
  username:"adi",
  password: "adi123123",
  nama: "adi suryadi",
  nik: "005",
  nomer_telfon:"085779336158",
  divisi:"editor",
  lokasi_kerja:"grand wisata"
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



// ini untuk buat akun karyawan
app.get("/buat_akun_karyawan", (req, res) => {
  if(req.session.status=="login"){
  res.render("buat_akun_karyawan");
  }
  else{
    res.redirect("/login");
  }
});

// untuk perintah get dan post
app.get("/sukses_absen", (req, res) => {
  if(req.session.status=="login"){
  res.render("berhasil_absen",{      nama : req.session.nama,
    username:req.session.username,
    password:req.session.password,
    status_nik:req.session.nik,
    status_login:req.session.status,
  });
  }else {
    res.rendirect("login")
  }
});


// ini untuk scan masuk
app.get("/scan_absen_masuk", (req, res) => {
  if(req.session.status=="login"){
  res.render("scan_absen_masuk");
  }
  else{
    res.redirect("/login");
  }
});

// ini untuk scan pulang
app.get("/scan_absen_pulang", (req, res) => {
  if(req.session.status=="login"){
  res.render("scan_absen_pulang");
  }
  else{
    res.redirect("/login");
  }
});

app.get('/login', async (req, res) => {
  if (req.session.status === "login") {
  
    res.redirect("/home");
  //   const db_data = await kirim_akun_karyawan_violet.findOne({
  //     username: req.session.username,
  //     password: req.session.password,
  //     nama: req.session.nama
  //   }, 'username password nama nik divisi').exec();

  //   if(db_data){
  //     res.redirect("/home");

  //   }
  //   else{
  //     res.redirect("/logout")
  //   }
  
  // }
  // else{
  //   res.redirect("");
   }
  // else{
  //   if (req.cookies.username && req.cookies.password) {
  //     const db_data = await kirim_akun_karyawan_violet.findOne({
  //       username: buka_enkripsi(req.cookies.username, secretKey),
  //       password: buka_enkripsi(req.cookies.password, secretKey),
  //       nama: buka_enkripsi(req.cookies.nama, secretKey)
  //     }, 'username password nama nik divisi').exec();
  
  //     if (db_data) {
  //       req.session.status="login"; 
  //       res.redirect("/login");
  //     }
  //   }
  //   else{
  //     res.redirect("/login");
  //   }
  // }

  const { status_login } = req.query;
  if (status_login) {
    res.render('login', { statusnya: status_login });
  } else {
    res.render("login", { statusnya: false });
  }
});



app.post('/login/proses_login', async (req, res) => {
  const { username, password } = req.body;

    const db_data = await kirim_akun_karyawan_violet.findOne({username:username,password:password},'username password nama nik divisi lokasi_kerja').exec();
if (db_data) {
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
  req.session.status= "login";
  res.redirect('/home');
} else {
  console.log('Data tidak ditemukan');
  res.redirect('/login?status_login=salah');
}

});
app.get('/home', async (req,res)=>{

if(req.session.status=="login"){
  const db_data = await kirim_akun_karyawan_violet.findOne({nama:req.session.nama,username:req.session.username,password:req.session.password},"nama username password").exec();
  
  if(db_data){
    res.render("home",{
      nama : req.session.nama,
      username:req.session.username,
      password:req.session.password,
      status_login:req.session.status                    
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
    const currentTime = moment();
    const auth = new google.auth.GoogleAuth({
      keyFile: "credentials.json",
      scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    // ... (kode lainnya)

    const sheets = google.sheets('v4');
    const spreadsheetId = "1Jbf0LtbDXsDzdmODbnVMNrZncWJUSl3ebE4KfnJN0_M";
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
        console.log("ya dia ada ada absen pualngnya");
        res.render("pilih_absen",{
          jam_absen_masuk:true,
          jam_absen_pulang:false
        });
      }
      else{
        res.render("berhasil_absen",{
          nama:req.session.nama
        });
      }
      // res.render("pilih_absen",{
      //   jenis_absen:data_h
      // });


    } else {
      console.log(`"ya dia ada absen masuknya`);
      res.render("pilih_absen",{
        jam_absen_masuk:false,
        jam_absen_pulang:false
    });
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

 const spreadsheetId = "1Jbf0LtbDXsDzdmODbnVMNrZncWJUSl3ebE4KfnJN0_M";

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
 console.log(`Data Absen yang ke data masuk`);
 console.log(`username = ${req.session.username}`);
 console.log(`nik = ${req.session.nik}`);
 console.log(`nama = ${req.session.nama}`);
 console.log(`divisi = ${req.session.divisi}`);
 console.log(`lokasi = ${lokasi}`);
 console.log(`lokasi kerja = ${req.session.lokasi_kerja}`);
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
    const spreadsheetId = "1Jbf0LtbDXsDzdmODbnVMNrZncWJUSl3ebE4KfnJN0_M";
    const range = "Sheet1!A:H";

    // Dapatkan nilai sel di dalam kolom A (asumsikan kolom A adalah yang ingin diedit)
    const getCells = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range,
    });

    // Dapatkan indeks baris yang sesuai dengan session.nik (misalnya, asumsikan session.nik ada di kolom A)
    const rowIndex = getCells.data.values.findIndex(row => row[1] === req.session.nik && row[3] === currentTime.format('YYYY-MM-DD') );

    if (rowIndex !== -1) {
      // Update nilai sel di dalam kolom H di baris yang sesuai
      await sheets.spreadsheets.values.update({
        auth,
        spreadsheetId,
        range: `Sheet1!H${rowIndex + 1}`, // +1 karena indeks dimulai dari 0
        valueInputOption: "USER_ENTERED",
        resource: {
          values: [[currentTime.format('HH:mm:ss')]],
        },
      });

      console.log(`Data Absen yang ke data masuk`);
      console.log(`username = ${req.session.username}`);
      console.log(`nik = ${req.session.nik}`);
      console.log(`nama = ${req.session.nama}`);
      console.log(`divisi = ${req.session.divisi}`);
      console.log(`lokasi = ${lokasi}`);
      console.log(`lokasi kerja = ${req.session.lokasi_kerja}`);

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

app.post("/proses_buat_akun_karyawan", (req, res) => {
  const {nama,username,password,nomer_telfon,divisi,lokasi_kerja} = req.body;
  if(req.session.status=="login"){
    const input_akun_karyawan_violet = new kirim_akun_karyawan_violet({
      username:username,
      password: password,
      nama: nama,
      nik: "005",
      nomer_telfon:nomer_telfon,
      divisi:divisi,
      lokasi_kerja:lokasi_kerja
    });
    
    input_akun_karyawan_violet.save();
    console.log(`${username}`);
    console.log(`${password}`);
    console.log(`${nama}`);
    console.log(`${nomer_telfon}`);
    console.log(`${divisi}`);
    console.log(`${lokasi_kerja}`);

    res.redirect("/home");
  }
  else{
    res.redirect("/login");
  }
});


app.listen(port, (req, res) => console.log(`berjalan di port ${port}`));

