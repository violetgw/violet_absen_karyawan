// Import module atau library yang diperlukan
const express = require('express');
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const app = express();
const port = 3000;
const client = new Client();
app.set('view engine', 'ejs');

// Membuat instance dari WhatsApp Client

// Inisialisasi WhatsApp client



// Fungsi untuk mengirim pesan
async function sendMessage(chatId, message) {
  return await client.sendMessage(chatId, message);
}

client.on('qr', qr => {
  qrcode.generate(qr, { small: true });
});

// Event saat klien siap
client.on('ready', () => {
  console.log('Client is ready!');
});
// Route untuk halaman welcome
app.get('/welcome', async (req, res) => {
  const number = "+6281932240030";
  const text = "Hey moza";
  const chatId = `${number.substring(1)}@c.us`;

  try {
    await sendMessage(chatId, text);
    res.render('welcome', { success: true });
} catch (error) {
    console.error('Error sending message:', error);
    res.render('welcome', { success: false, errorMessage: error.message });
  }
});

client.initialize();
// Port untuk server Express
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});

