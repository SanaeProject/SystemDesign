// プルダウンメニューにデータを追加
const invoiceSelect = document.getElementById("invoiceSelect");
invoices.forEach(invoice => {
    const option = document.createElement("option");
    option.value = invoice.id;
    option.textContent = `${invoice.id} - ${invoice.client}`;
    invoiceSelect.appendChild(option);
});

// 選択された請求書の詳細を表示
invoiceSelect.addEventListener("change", () => {
    const selectedId = invoiceSelect.value;
    const tbody = document.getElementById('invoiceItems');
    tbody.innerHTML = '';

    if (selectedId) {
        const selectedInvoice = invoices.find(inv => inv.id === selectedId);

        // 請求書の基本情報を表示
        document.getElementById('clientName').innerText = selectedInvoice.client;
        document.getElementById('resistrationNumber').innerText = `請求番号: ${selectedId}`;
        document.getElementById('closingDate').innerText = `締め日: ${selectedInvoice.date[0]}年${selectedInvoice.date[1]}月${selectedInvoice.date[2]}日`;

        let subtotal = 0;
        selectedInvoice.items.forEach((item) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.date}</td>
                <td>${item.location}</td>
                <td>${item.amount.toLocaleString()}</td>
            `;
            tbody.appendChild(row);
            subtotal += item.amount;
        });
        
        const tax = Math.floor(subtotal * 0.1);
        const total = subtotal + tax;

        document.getElementById('subtotal').textContent = subtotal.toLocaleString();
        document.getElementById('tax').textContent = tax.toLocaleString();
        document.getElementById('total').textContent = total.toLocaleString();
    }
});