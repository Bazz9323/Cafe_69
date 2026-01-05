let orders = {};

function showMenu(category) {
    document.querySelectorAll('.menu-section').forEach(sec => {
        sec.classList.add('hidden');
    });
    document.querySelector(`[data-category="${category}"]`)
        .classList.remove('hidden');

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

function addItem(name, price) {
    if (!orders[name]) {
        orders[name] = { price, qty: 1 };
    } else {
        orders[name].qty++;
    }
    renderOrder();

    showToast(`${name} ditambahkan ke keranjang`);
}

function changeQty(name, delta) {
    orders[name].qty += delta;

    if (orders[name].qty <= 0) {
        delete orders[name];
    }
    renderOrder();
}

function renderOrder() {
    const list = document.getElementById("orderList");
    list.innerHTML = "";

    let total = 0;

    for (let item in orders) {
        let sub = orders[item].price * orders[item].qty;
        total += sub;

        list.innerHTML += `
        <div class="order-item">
            <div>${item}</div>

            <div class="qty-control">
                <button onclick="changeQty('${item}', -1)">−</button>
                ${orders[item].qty}
                <button onclick="changeQty('${item}', 1)">+</button>
            </div>

            <div>Rp ${sub.toLocaleString()}</div>
        </div>
        `;
    }

    document.getElementById("total").innerText =
        "Total: Rp " + total.toLocaleString();
}

function sendToWhatsApp() {
    const name = customerName.value;
    const table = tableNumber.value;
    const pay = payment.value;

    if (!name || !table || Object.keys(orders).length === 0) {
        alert("Lengkapi data & pesanan");
        return;
    }

    let msg = `*Pesanan Cafe 69*\n\nNama\t\t: ${name}\nMeja\t\t: ${table}\nPembayaran\t: ${pay}\n\n`;
    let total = 0;

    for (let i in orders) {
        let sub = orders[i].qty * orders[i].price;
        total += sub;
        msg += `- ${i} x${orders[i].qty} = Rp ${sub.toLocaleString()}\n`;
    }

    msg += `\nTotal: Rp ${total.toLocaleString()}`;

    window.open(
        `https://wa.me/6282191600989?text=${encodeURIComponent(msg)}`,
        "_blank"
    );

    // ==== RESET WEB ====
    orders = {};
    renderOrder();

    customerName.value = "";
    tableNumber.value = "";
    payment.value = "";
}

function showToast(text) {
    const toast = document.getElementById("toast");
    toast.innerText = text;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 1500);
}
