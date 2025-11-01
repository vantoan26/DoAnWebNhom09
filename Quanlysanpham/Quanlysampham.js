let cart = [];

function addToCart(name, price) {
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  renderCart();
}

function renderCart() {
  const cartList = document.getElementById('cart-items');
  const total = document.getElementById('total');
  cartList.innerHTML = '';
  let sum = 0;

  cart.forEach((item, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${item.name} - ${item.price.toLocaleString()}đ x ${item.qty}
      <div>
        <button onclick="changeQty(${index}, 1)">+</button>
        <button onclick="changeQty(${index}, -1)">-</button>
      </div>
    `;
    cartList.appendChild(li);
    sum += item.price * item.qty;
  });

  total.textContent = `Tổng tiền: ${sum.toLocaleString()}đ`;
}

function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  renderCart();
}

function showCheckout() {
  if (cart.length === 0) {
    alert("Giỏ hàng trống!");
    return;
  }
  document.getElementById('checkout').classList.remove('hidden');
}

document.getElementById('address').addEventListener('change', function () {
  const newAddress = document.getElementById('newAddress');
  if (this.value === 'new') {
    newAddress.classList.remove('hidden');
  } else {
    newAddress.classList.add('hidden');
  }
});

function confirmOrder() {
  const payment = document.getElementById('payment').value;
  const addressSelect = document.getElementById('address').value;
  const address = addressSelect === 'new'
    ? document.getElementById('newAddress').value
    : 'Địa chỉ trong tài khoản';

  let sum = cart.reduce((acc, i) => acc + i.price * i.qty, 0);
  const summary = `
    <p><b>Địa chỉ giao hàng:</b> ${address}</p>
    <p><b>Phương thức thanh toán:</b> ${payment}</p>
    <p><b>Tổng tiền:</b> ${sum.toLocaleString()}đ</p>
    <h3>Chi tiết sản phẩm:</h3>
    <ul>${cart.map(i => `<li>${i.name} x ${i.qty}</li>`).join('')}</ul>
  `;

  document.getElementById('summary-content').innerHTML = summary;
  document.getElementById('order-summary').classList.remove('hidden');
  document.getElementById('checkout').classList.add('hidden');
}

