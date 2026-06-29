const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

async function loadJSON(path) {
  const response = await fetch(path, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Could not load ${path}`);
  return response.json();
}

function setConfig(config) {
  document.querySelectorAll('[data-config]').forEach((node) => {
    const key = node.getAttribute('data-config');
    if (config[key]) node.textContent = config[key];
  });
  document.title = config.siteName || document.title;
}

function renderDonationLinks(links) {
  const container = document.getElementById('donation-links');
  container.innerHTML = links.map((link) => `
    <article class="donation-card">
      <h3>${link.name}</h3>
      <p>${link.description}</p>
      <a class="button" href="${link.url}" target="_blank" rel="noopener">Donate via ${link.name}</a>
    </article>
  `).join('');
}

function renderReceipts(receipts) {
  const tbody = document.getElementById('receipt-rows');
  if (!receipts.length) {
    tbody.innerHTML = '<tr><td colspan="5">No receipts have been posted yet.</td></tr>';
    return;
  }

  tbody.innerHTML = receipts.map((receipt) => `
    <tr>
      <td>${receipt.date}</td>
      <td><span class="status-badge">${receipt.category}</span></td>
      <td><strong>${receipt.vendor}</strong><br>${receipt.description}</td>
      <td class="amount">${money.format(receipt.amount)}</td>
      <td>${receipt.proofUrl ? `<a class="proof-link" href="${receipt.proofUrl}" target="_blank" rel="noopener">View receipt</a>` : 'Pending'}</td>
    </tr>
  `).join('');
}

function renderTotals(summary, receipts) {
  const spent = receipts.reduce((sum, receipt) => sum + Number(receipt.amount || 0), 0);
  const raised = Number(summary.totalRaised || 0);
  const balance = raised - spent;
  const spentPercent = raised > 0 ? Math.min((spent / raised) * 100, 100) : 0;

  document.getElementById('total-raised').textContent = money.format(raised);
  document.getElementById('total-spent').textContent = money.format(spent);
  document.getElementById('balance').textContent = money.format(balance);
  document.getElementById('spent-meter').style.width = `${spentPercent}%`;
  document.getElementById('last-updated').textContent = `Last updated: ${summary.lastUpdated || 'not published yet'}`;
}

async function init() {
  try {
    const [config, ledger] = await Promise.all([
      loadJSON('data/config.json'),
      loadJSON('data/receipts.json')
    ]);

    setConfig(config);
    renderDonationLinks(config.donationLinks || []);
    renderReceipts(ledger.receipts || []);
    renderTotals(ledger.summary || {}, ledger.receipts || []);
  } catch (error) {
    console.error(error);
    document.getElementById('receipt-rows').innerHTML = '<tr><td colspan="5">Could not load receipt data. Check the JSON files.</td></tr>';
  }
}

init();
