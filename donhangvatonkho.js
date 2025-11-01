// ======= DỮ LIỆU MẪU =======
const orders = [
  {id: 'DH001', customer: 'Nguyễn A', date: '2025-10-20', status: 'new', total: 58000000},
  {id: 'DH002', customer: 'Trần B', date: '2025-10-22', status: 'delivered', total: 15000000}
];

const products = [
  {id: 'DT01', name: 'iPhone 15', category: 'Apple', price: 29000000, stock: 5, low: 3},
  {id: 'DT02', name: 'Samsung S25', category: 'Samsung', price: 24000000, stock: 2, low: 3},
  {id: 'DT03', name: 'Xiaomi 14', category: 'Xiaomi', price: 17000000, stock: 4, low: 2},
  {id: 'DT04', name: 'OPPO Reno 11', category: 'OPPO', price: 12000000, stock: 1, low: 2},
];

// ======= HIỂN THỊ ĐƠN HÀNG =======
function renderOrders(list = orders) {
  const tbody = document.querySelector('#orderTable tbody');
  tbody.innerHTML = list.map(o => `
    <tr>
      <td>${o.id}</td>
      <td>${o.customer}</td>
      <td>${o.date}</td>
      <td>
        <select onchange="updateOrderStatus('${o.id}', this.value)">
          <option value="new" ${o.status==='new'?'selected':''}>Mới đặt</option>
          <option value="processed" ${o.status==='processed'?'selected':''}>Đã xử lý</option>
          <option value="delivered" ${o.status==='delivered'?'selected':''}>Đã giao</option>
          <option value="cancel" ${o.status==='cancel'?'selected':''}>Hủy</option>
        </select>
      </td>
      <td>${o.total.toLocaleString()}₫</td>
      <td><button onclick="viewOrder('${o.id}')">Xem</button></td>
    </tr>
  `).join('');
}

function filterOrders() {
  const from = document.getElementById('fromDate').value;
  const to = document.getElementById('toDate').value;
  const status = document.getElementById('statusFilter').value;

  const filtered = orders.filter(o => {
    let ok = true;
    if (from && o.date < from) ok = false;
    if (to && o.date > to) ok = false;
    if (status && o.status !== status) ok = false;
    return ok;
  });

  renderOrders(filtered);
}

function viewOrder(id) {
  const o = orders.find(x => x.id === id);
  alert(`Đơn hàng ${o.id}\nKhách: ${o.customer}\nNgày đặt: ${o.date}\nTình trạng: ${o.status}\nTổng tiền: ${o.total.toLocaleString()}₫`);
}

function updateOrderStatus(id, newStatus) {
  const order = orders.find(o => o.id === id);
  if (order) order.status = newStatus;
  alert(`Đã cập nhật tình trạng đơn ${id} thành: ${newStatus}`);
}

// ======= HIỂN THỊ TỒN KHO =======
function renderInventory(list = products) {
  const tbody = document.querySelector('#inventoryTable tbody');
  tbody.innerHTML = list.map(p => `
    <tr class="${p.stock <= p.low ? 'low-stock' : ''}">
      <td>${p.id}</td>
      <td>${p.name}</td>
      <td>${p.category}</td>
      <td>${p.price.toLocaleString()}₫</td>
      <td>${p.stock}</td>
    </tr>
  `).join('');
  checkLowStock();
}

function searchInventory() {
  const keyword = document.getElementById('searchProduct').value.toLowerCase();
  const category = document.getElementById('categoryFilter').value;
  const filtered = products.filter(p => 
    (p.name.toLowerCase().includes(keyword) || p.id.toLowerCase().includes(keyword)) &&
    (category === '' || p.category === category)
  );
  renderInventory(filtered);
}

function importProduct() {
  const id = prompt('Nhập mã sản phẩm cần nhập:');
  const quantity = parseInt(prompt('Nhập số lượng nhập:'), 10);
  const p = products.find(x => x.id === id);
  if (p && quantity > 0) {
    p.stock += quantity;
    alert(`Đã nhập thêm ${quantity} ${p.name}`);
    renderInventory();
  } else {
    alert('Không hợp lệ hoặc không tìm thấy sản phẩm.');
  }
}

function exportProduct() {
  const id = prompt('Nhập mã sản phẩm bán/xuất:');
  const quantity = parseInt(prompt('Nhập số lượng:'), 10);
  const p = products.find(x => x.id === id);
  if (p && quantity > 0 && p.stock >= quantity) {
    p.stock -= quantity;
    alert(`Đã xuất ${quantity} ${p.name}`);
    renderInventory();
  } else {
    alert('Không hợp lệ hoặc tồn không đủ.');
  }
}

function checkLowStock() {
  const lowList = products.filter(p => p.stock <= p.low);
  const alertDiv = document.getElementById('lowStockAlert');
  alertDiv.innerHTML = lowList.length
    ? '⚠️ Sản phẩm sắp hết hàng: ' + lowList.map(p => p.name).join(', ')
    : '';
}

// ======= TAB CHUYỂN =======
function showSection(id) {
  document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// ======= KHỞI TẠO =======
renderOrders();
renderInventory();
