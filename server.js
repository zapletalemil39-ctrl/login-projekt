const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const DB = "users.json";

function loadUsers() {
  if (!fs.existsSync(DB)) return [];
  return JSON.parse(fs.readFileSync(DB));
}

function saveUsers(users) {
  fs.writeFileSync(DB, JSON.stringify(users, null, 2));
}

app.post("/register", (req, res) => {
  const { username, password } = req.body;

  let users = loadUsers();
  users.push({ username, password });

  saveUsers(users);
  res.send("Gespeichert!");
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  let users = loadUsers();

  const user = users.find(u =>
    u.username === username && u.password === password
  );

  res.send(user ? "Login erfolgreich" : "Falsch");
});

app.listen(3000, () => {
  console.log("http://localhost:3000");
});

app.get("/admin", (req, res) => {
  let users = loadUsers();

  let rows = "";

  users.forEach(u => {
    rows += `
      <tr>
        <td>${u.username}</td>
        <td>${u.password}</td>
      </tr>
    `;
  });

  let html = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Admin</title>
    <style>
      body {
        margin: 0;
        font-family: Arial;
        background: #12141c;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }

      .box {
        width: 500px;
        background: #1c1f26;
        padding: 30px;
        border: 1px solid #3a3d45;
      }

      h1 {
        margin-bottom: 20px;
        text-align: center;
      }

      table {
        width: 100%;
        border-collapse: collapse;
      }

      th {
        text-align: left;
        padding: 10px;
        background: #2a2d35;
      }

      td {
        padding: 10px;
        border-top: 1px solid #3a3d45;
      }

      tr:hover {
        background: #2a2d35;
      }

      .empty {
        text-align: center;
        color: #aaa;
        margin-top: 20px;
      }
    </style>
  </head>

  <body>
    <div class="box">
      <h1>Admin Panel</h1>

      ${
        users.length === 0
          ? `<div class="empty">Keine Daten vorhanden</div>`
          : `
            <table>
              <tr>
                <th>Benutzer</th>
                <th>Passwort</th>
              </tr>
              ${rows}
            </table>
          `
      }
    </div>
  </body>
  </html>
  `;

  res.send(html);
});
