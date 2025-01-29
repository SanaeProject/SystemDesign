// プルダウンにメニューを追加
const invoiceSelect = document.getElementById("client");
invoices.forEach(invoice => {
    const option = document.createElement("option");
    option.textContent = invoice.client;
    invoiceSelect.appendChild(option);
});

// 印刷
function printInvoice(invoiceId) {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (!invoice) {
        alert('請求書が見つかりません。');
        return;
    }

    console.log(invoice.date[1] == 1 ? 12 : invoice.date[1] - 1);

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>請求書 ${invoice.id}</title>
                <style>
                    body {
                        font-family: 'Arial', sans-serif;
                        margin: 20px;
                    }
                    h1, h2, h3 {
                        text-align: center;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 20px;
                    }
                    table, th, td {
                        border: 1px solid black;
                    }
                    th, td {
                        padding: 10px;
                        text-align: left;
                    }
                    .total {
                        text-align: right;
                        font-weight: bold;
                    }
                    .footer {
                        margin-top: 20px;
                        border-top: 1px solid black;
                        padding-top: 10px;
                    }
                </style>
            </head>
            <body>
                <h1>請 求 書</h1>
                <h3>${invoice.date[0]} 年 ${invoice.date[1]} ⽉ ${invoice.date[2]} 日 締 め</h3>
                <div>
                    <p><strong>請求番号:</strong>   T1234567890123</p>
                    <p><strong>請求先:</strong> ${invoice.client} 御中</p>
                    <p><strong>請求日:</strong> ${invoice.date[0]}年${invoice.date[1] == 1 ? 12 : invoice.date[1] - 1}⽉${invoice.date[2]}日</p>
                    <p><strong>ご請求金額:</strong> ¥${invoice.amount.toLocaleString()}</p>
                </div>
                <h2>明細</h2>
                <table>
                    <thead>
                        <tr>
                            <th>日付</th>
                            <th>着地</th>
                            <th>金額</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${invoice.items.map(item => `
                            <tr>
                                <td>${item.date}</td>
                                <td>${item.location}</td>
                                <td>¥${item.amount.toLocaleString()}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div>
                    <p class="total">小計: ¥${invoice.items.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}</p>
                    <p class="total">消費税 (10%): ¥${Math.floor(invoice.amount * 0.1).toLocaleString()}</p>
                    <p class="total">合計金額: ¥${invoice.amount.toLocaleString()}</p>
                </div>
                <div class="footer">
                    <h3><振込先></h3>
                    <p>○○銀行 ○○支店</p>
                    <p>（普通）12345678</p>
                    <p>愛知県名古屋市○○○○</p>
                    <p>TEL: 0562-00-0000</p>
                    <p>FAX: 0562-11-1111</p>
                </div>
                <script>
                    window.print();
                    setTimeout(() => window.close(), 100);
                </script>
            </body>
        </html>
    `);
    printWindow.document.close();
}

function getStatusBadgeClass(status) {
    switch(status) {
        case "未請求": return "bg-warning";
        case "請求済み": return "bg-primary";
        case "入金済み": return "bg-success";
        default: return "bg-secondary";
    }
}

function viewInvoice(id) {
    const selectedId = id;
    const tbody = document.getElementById('invoiceItems');
    tbody.innerHTML = '';

    console.log(tbody);

    if (selectedId) {
        const selectedInvoice = invoices.find(inv => inv.id === selectedId);

        // 請求書の基本情報を表示
        document.getElementById('clientName').innerText = selectedInvoice.client;
        document.getElementById('resistrationNumber').innerText = `請求番号: ${selectedInvoice.id}`;
        document.getElementById('closingDate').innerText = `締め日: ${selectedInvoice.date[1] == 12 ? selectedInvoice.date[0] + 1 : selectedInvoice.date[0]}年${selectedInvoice.date[1] == 12 ? 1 : selectedInvoice.date[1] + 1}月${selectedInvoice.date[2]}日`;

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

        document.getElementById('invoiceDetail').style.display = "block";

        location.replace(location.href.substring(0, location.href.indexOf('#')) + '#invoiceDetail');
    }
}

function hideInvoiceDetail() {
    document.getElementById('invoiceDetail').style.display = 'none';
    location.replace(location.href.substring(0, location.href.indexOf('#')) + '#');
}

function filterInvoices() {
    const statusFilter = document.getElementById('status').value;
    const clientFilter = document.getElementById('client').value;
    const tbody = document.getElementById('invoiceList');
    tbody.innerHTML = ''; // テーブルの内容をクリア

    const filteredInvoices = invoices.filter(invoice => {
        // 状態フィルタの判定
        const statusMatches = statusFilter === 'all' || invoice.status === statusFilter;
        // 取引先フィルタの判定
        const clientMatches = clientFilter === '' || invoice.client === clientFilter;
        // 両方の条件が一致する場合のみ表示
        return statusMatches && clientMatches;
    });

    filteredInvoices.forEach(invoice => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${invoice.id}</td>
            <td>${invoice.client}</td>
            <td>${invoice.date.join('/')}</td>
            <td>¥${invoice.amount.toLocaleString()}</td>
            <td>
                <span class="badge ${getStatusBadgeClass(invoice.status)} status-badge">
                    ${invoice.status}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-2" onclick="viewInvoice('${invoice.id}')">
                    <i class="fas fa-eye me-1"></i>詳細
                </button>
                <button class="btn btn-sm btn-outline-success" onclick="printInvoice('${invoice.id}')">
                    <i class="fas fa-print me-1"></i>印刷
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function displayInvoices() {
    const tbody = document.getElementById('invoiceList');
    tbody.innerHTML = '';

    invoices.forEach(invoice => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${invoice.id}</td>
            <td>${invoice.client}</td>
            <td>${invoice.date}</td>
            <td>¥${invoice.amount.toLocaleString()}</td>
            <td>
                <span class="badge ${getStatusBadgeClass(invoice.status)} status-badge">
                    ${invoice.status}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-2" onclick="viewInvoice('${invoice.id}')">
                    <i class="fas fa-eye me-1"></i>詳細
                </button>
                <button class="btn btn-sm btn-outline-success" onclick="printInvoice('${invoice.id}')">
                    <i class="fas fa-print me-1"></i>印刷
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// 初期表示
displayInvoices();