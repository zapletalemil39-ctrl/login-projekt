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

  let html = `
    <h1>Admin Panel</h1>
    <table border="1" cellpadding="10">
      <tr>
        <th>Username</th>
        <th>Password</th>
      </tr>
  `;

  users.forEach(u => {
    html += `
      <tr>
        <td>${u.username}</td>
        <td>${u.password}</td>
      </tr>
    `;
  });

  html += `</table>`;

  res.send(html);
});