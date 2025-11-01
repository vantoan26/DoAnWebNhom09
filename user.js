// Danh sách khách hàng mẫu
let users = [
  { id: 1, name: "Nguyễn Văn A", email: "a@gmail.com", locked: false },
  { id: 2, name: "Trần Thị B", email: "b@gmail.com", locked: true },
  { id: 3, name: "Lê Văn C", email: "c@gmail.com", locked: false }
];

// Hàm hiển thị danh sách khách hàng
function renderTable() {
  const tbody = document.querySelector("#userTable tbody");
  tbody.innerHTML = ""; // Xóa nội dung cũ

  users.forEach(user => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${user.id}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.locked ? "🔒 Khóa" : "🟢 Hoạt động"}</td>
      <td>
        <button class="btn-reset" onclick="resetPassword(${user.id})">Reset MK</button>
        ${
          user.locked
            ? `<button class="btn-unlock" onclick="toggleLock(${user.id})">Mở khóa</button>`
            : `<button class="btn-lock" onclick="toggleLock(${user.id})">Khóa</button>`
        }
      </td>
    `;

    tbody.appendChild(row);
  });
}

// Hàm reset mật khẩu
function resetPassword(id) {
  const user = users.find(u => u.id === id);
  alert(`✅ Đã reset mật khẩu cho ${user.name} (email: ${user.email})`);
}

// Hàm khóa / mở khóa tài khoản
function toggleLock(id) {
  const user = users.find(u => u.id === id);
  user.locked = !user.locked;
  renderTable();
}

renderTable(); // Gọi hiển thị ban đầu
