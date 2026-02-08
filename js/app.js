// MOMS SHOP app.js (Vanilla JS)
(() => {
  const TELEGRAM_USERNAME = "Samplerasdip";
  const DATA_URL = "./data/menu.json";

  const LANGS = {
    km:{label:"ភាសាខ្មែរ", flag:"🇰🇭"},
    en:{label:"English", flag:"🇬🇧"},
    zh:{label:"中文", flag:"🇨🇳"},
    th:{label:"ไทย", flag:"🇹🇭"},
    vi:{label:"Tiếng Việt", flag:"🇻🇳"},
    id:{label:"Indonesia", flag:"🇮🇩"},
  };

  const UI = {
    en:{search:"Search menu...",categories:"Categories",tapFilter:"Tap to filter",best:"Best Seller",all:"All",
      sectionSub:"Tap + to add to cart • Checkout via Telegram",cart:"Your cart",delivery:"Delivery details",
      building:"Building",phone:"Phone",floor:"Floor",room:"Room",payment:"Payment",total:"Total",
      checkout:"Checkout via Telegram",
      policy:"Orders 5+ may require payment first (QR). Please provide floor/room and phone number for delivery.",
      hint:"Checkout will open Telegram and send the order message in Khmer for staff.",
      empty:"Your cart is empty.", sizeS:"Small", sizeL:"Large"},
    km:{search:"ស្វែងរកម៉ឺនុយ...",categories:"ប្រភេទ",tapFilter:"ចុចដើម្បីជ្រើស",best:"លក់ដាច់",all:"ទាំងអស់",
      sectionSub:"ចុច + ដើម្បីដាក់ក្នុងកន្រ្តក • Checkout ទៅ Telegram",cart:"កន្រ្តក",delivery:"ព័ត៌មានដឹកជញ្ជូន",
      building:"អគារ",phone:"លេខទូរស័ព្ទ",floor:"ជាន់",room:"បន្ទប់",payment:"វិធីបង់ប្រាក់",total:"សរុប",
      checkout:"Checkout ទៅ Telegram",
      policy:"ការបញ្ជាទិញ 5+ អាចត្រូវបង់មុន (QR)។ សូមបញ្ចូលជាន់/បន្ទប់ និងលេខទូរស័ព្ទ។",
      hint:"Checkout នឹងបើក Telegram ហើយផ្ញើសារបញ្ជាទិញជាភាសាខ្មែរ។",
      empty:"មិនមានទំនិញក្នុងកន្រ្តកទេ។", sizeS:"តូច", sizeL:"ធំ"},
    zh:{search:"搜索菜单...",categories:"分类",tapFilter:"点击筛选",best:"热销",all:"全部",
      sectionSub:"点击 + 加入购物车 • 通过 Telegram 下单",cart:"购物车",delivery:"配送信息",
      building:"楼栋",phone:"电话",floor:"楼层",room:"房间",payment:"付款方式",total:"合计",
      checkout:"Telegram 下单",
      policy:"5杯以上订单可能需要先付款（QR）。请填写楼层/房间和电话号码。",
      hint:"下单会打开 Telegram，并用高棉语发送订单给店员。",
      empty:"购物车为空。", sizeS:"小", sizeL:"大"},
    th:{search:"ค้นหาเมนู...",categories:"หมวดหมู่",tapFilter:"แตะเพื่อกรอง",best:"ขายดี",all:"ทั้งหมด",
      sectionSub:"กด + เพื่อใส่ตะกร้า • สั่งผ่าน Telegram",cart:"ตะกร้า",delivery:"ข้อมูลจัดส่ง",
      building:"อาคาร",phone:"โทรศัพท์",floor:"ชั้น",room:"ห้อง",payment:"การชำระเงิน",total:"รวม",
      checkout:"สั่งผ่าน Telegram",
      policy:"ออเดอร์ 5 แก้วขึ้นไปอาจต้องชำระก่อน (QR) กรุณากรอกชั้น/ห้องและเบอร์โทร",
      hint:"จะเปิด Telegram และส่งออเดอร์เป็นภาษาเขมรให้พนักงาน",
      empty:"ตะกร้าว่าง", sizeS:"เล็ก", sizeL:"ใหญ่"},
    vi:{search:"Tìm kiếm menu...",categories:"Danh mục",tapFilter:"Chạm để lọc",best:"Bán chạy",all:"Tất cả",
      sectionSub:"Nhấn + để thêm vào giỏ • Đặt qua Telegram",cart:"Giỏ hàng",delivery:"Thông tin giao hàng",
      building:"Tòa nhà",phone:"Số điện thoại",floor:"Tầng",room:"Phòng",payment:"Thanh toán",total:"Tổng",
      checkout:"Đặt qua Telegram",
      policy:"Đơn 5 ly+ có thể cần thanh toán trước (QR). Vui lòng nhập tầng/phòng và số điện thoại.",
      hint:"Sẽ mở Telegram và gửi đơn bằng tiếng Khmer cho nhân viên.",
      empty:"Giỏ hàng trống.", sizeS:"Nhỏ", sizeL:"Lớn"},
    id:{search:"Cari menu...",categories:"Kategori",tapFilter:"Ketuk untuk filter",best:"Best Seller",all:"Semua",
      sectionSub:"Tekan + untuk masuk keranjang • Checkout via Telegram",cart:"Keranjang",delivery:"Detail pengantaran",
      building:"Gedung",phone:"No. HP",floor:"Lantai",room:"Ruang",payment:"Pembayaran",total:"Total",
      checkout:"Checkout via Telegram",
      policy:"Order 5+ bisa wajib bayar dulu (QR). Isi lantai/ruang dan nomor HP untuk delivery.",
      hint:"Checkout akan membuka Telegram dan mengirim pesan order dalam bahasa Khmer untuk staff.",
      empty:"Keranjang masih kosong.", sizeS:"Kecil", sizeL:"Besar"},
  };

  const $ = (id) => document.getElementById(id);

  const state = {
    lang: localStorage.getItem('moms_lang') || 'en',
    items: [],
    query: "",
    category: "best",
    cart: {},
  };

  function t(key){
    const dict = UI[state.lang] || UI.en;
    return dict[key] || UI.en[key] || key;
  }

  function formatRiel(n){
    try{ return new Intl.NumberFormat('en-US').format(n) + "៛"; }
    catch{ return String(n) + "៛"; }
  }

  function categoryKey(cat){
    const c = (cat || "").toLowerCase();
    if(c.includes("smoothie")) return "smoothie";
    if(c.includes("cream")) return "cream";
    if(c.includes("milk")) return "milk";
    if(c.includes("bottled")) return "bottled";
    if(c.includes("snacks")) return "snacks";
    if(c.includes("cigarettes")) return "cigarettes";
    return c || "other";
  }

  const CATEGORY_META = [
    {key:"best", icon:"⭐", labelKey:"best"},
    {key:"all", icon:"📋", labelKey:"all"},
    {key:"smoothie", icon:"🥤", label:"Smoothie"},
    {key:"cream", icon:"🥛", label:"Cream (Layer)"},
    {key:"milk", icon:"🧋", label:"Milk / Tea"},
    {key:"bottled", icon:"🧃", label:"Bottled & Canned"},
    {key:"snacks", icon:"🍟", label:"Snacks"},
    {key:"cigarettes", icon:"🚬", label:"Cigarettes"},
  ];

  function applyUI(){
    $('searchInput').placeholder = t('search');
    $('catTitle').textContent = t('categories');
    $('catHint').textContent = t('tapFilter');
    $('sectionSub').textContent = t('sectionSub');
    $('cartTitle').textContent = t('cart');
    $('deliveryTitle').textContent = t('delivery');
    $('lblBuilding').textContent = t('building');
    $('lblPhone').textContent = t('phone');
    $('lblFloor').textContent = t('floor');
    $('lblRoom').textContent = t('room');
    $('lblPayment').textContent = t('payment');
    $('totalLabel').textContent = t('total');
    $('checkoutBtn').textContent = t('checkout');
    $('policy').textContent = t('policy');
    $('checkoutHint').textContent = t('hint');
    // Section title depends on category
    $('sectionTitle').textContent = state.category === 'best' ? t('best') : (state.category === 'all' ? t('all') : $('sectionTitle').textContent);
  }

  function setLang(code){
    if(!LANGS[code]) return;
    state.lang = code;
    localStorage.setItem('moms_lang', code);
    applyUI();
    renderCategories();
    renderGrid();
    renderCart();
  }

  function getDisplayName(it){
    const n = it.names || {};
    return n[state.lang] || n.en || n.km || it.code;
  }
  function getKhmerName(it){
    const n = it.names || {};
    return n.km || n.en || it.code;
  }
  function getImageUrl(it){
    return it.image ? ("./assets/img/" + it.image) : "";
  }

  function activeItems(){ return state.items.filter(i => i.active); }

  function counts(items){
    const c = {best:0, all:items.length};
    for(const it of items){
      const k = categoryKey(it.category);
      c[k] = (c[k]||0)+1;
      if(it.bestSeller) c.best++;
    }
    return c;
  }

  function renderCategories(){
    const items = activeItems();
    const c = counts(items);
    const list = $('catList');
    list.innerHTML = "";
    CATEGORY_META.forEach(meta => {
      const btn = document.createElement('button');
      btn.className = 'catbtn' + (state.category === meta.key ? ' active' : '');
      const label = meta.labelKey ? t(meta.labelKey) : meta.label;
      const count = c[meta.key] ?? 0;
      btn.innerHTML = `<div>${meta.icon}</div><div style="flex:1">${label}</div><span>${count}</span>`;
      btn.onclick = () => {
        state.category = meta.key;
        $('sectionTitle').textContent = label;
        renderCategories(); renderGrid();
      };
      list.appendChild(btn);
    });

    const mob = $('mobileCats');
    mob.innerHTML = "";
    CATEGORY_META.slice(0,4).forEach(meta => {
      const b = document.createElement('button');
      b.className = 'iconbtn';
      const label = meta.labelKey ? t(meta.labelKey) : meta.label;
      b.textContent = `${meta.icon} ${label}`;
      b.onclick = () => {
        state.category = meta.key;
        $('sectionTitle').textContent = label;
        renderCategories(); renderGrid();
      };
      mob.appendChild(b);
    });
  }

  function ensure(code){
    if(!state.cart[code]) state.cart[code] = {small:0, large:0, one:0};
    return state.cart[code];
  }
  function setQty(code, which, val){
    const e = ensure(code);
    e[which] = Math.max(0, val);
  }

  function byCode(code){ return state.items.find(i => i.code === code); }

  function cartCount(){
    let n=0;
    for(const e of Object.values(state.cart)){
      n += (e.small||0)+(e.large||0)+(e.one||0);
    }
    return n;
  }
  function cartTotal(){
    let tot=0;
    for(const [code,e] of Object.entries(state.cart)){
      const it = byCode(code);
      if(!it) continue;
      if(it.hasSize){
        tot += (e.small||0)*(it.prices.small||0);
        tot += (e.large||0)*(it.prices.large||0);
      }else{
        const unit = (it.prices.small ?? it.prices.large ?? 0);
        tot += (e.one||0)*unit;
      }
    }
    return tot;
  }

  function filtered(){
    const items = activeItems();
    const q = state.query.trim().toLowerCase();
    let arr = items;

    if(state.category === 'best') arr = arr.filter(i => i.bestSeller);
    else if(state.category !== 'all') arr = arr.filter(i => categoryKey(i.category) === state.category);

    if(q){
      arr = arr.filter(i => {
        const blob = [i.code, i.names?.km, i.names?.en, i.names?.zh, i.names?.th, i.names?.vi, i.names?.id].filter(Boolean).join(" ").toLowerCase();
        return blob.includes(q);
      });
    }
    arr.sort((a,b) => (a.sortOrder-b.sortOrder) || a.code.localeCompare(b.code));
    return arr;
  }

  function renderGrid(){
    const grid = $('grid');
    grid.innerHTML = "";
    for(const it of filtered()){
      const e = ensure(it.code);
      const card = document.createElement('div');
      card.className = 'card';

      const imgUrl = getImageUrl(it);
      card.innerHTML = `
        <div class="thumb">
          <div class="codepill">${it.code}</div>
          ${imgUrl ? `<img src="${imgUrl}" alt="${getDisplayName(it)}" loading="lazy" />` : ``}
        </div>
        <div class="cardbody">
          <p class="name">${getDisplayName(it)}</p>
          <p class="subname">${getKhmerName(it)}</p>
          <div class="prices"></div>
          <div class="qtyrow"></div>
        </div>
      `;

      const pricesEl = card.querySelector('.prices');
      const qtyrow = card.querySelector('.qtyrow');

      if(it.hasSize){
        const sLab = it.sizeLabels.small || "700ml";
        const lLab = it.sizeLabels.large || "1000ml";
        pricesEl.innerHTML = `
          <span class="pricechip">${sLab}: ${formatRiel(it.prices.small||0)}</span>
          <span class="pricechip">${lLab}: ${formatRiel(it.prices.large||0)}</span>
        `;

        qtyrow.style.flexDirection='column';
        qtyrow.style.alignItems='stretch';
        qtyrow.style.gap='8px';

        const makeLine = (label, which, val) => {
          const wrap = document.createElement('div');
          wrap.style.display='flex';
          wrap.style.alignItems='center';
          wrap.style.justifyContent='space-between';
          wrap.innerHTML = `<span style="color:var(--muted);font-size:12px">${label}</span>`;
          const ctrl = document.createElement('div');
          ctrl.className='qtyctrl';
          ctrl.innerHTML = `
            <button>−</button>
            <div class="qty">${val}</div>
            <button>+</button>
          `;
          ctrl.children[0].onclick = () => { setQty(it.code, which, (ensure(it.code)[which]||0)-1); renderGrid(); renderCart(); };
          ctrl.children[2].onclick = () => { setQty(it.code, which, (ensure(it.code)[which]||0)+1); renderGrid(); renderCart(); };
          wrap.appendChild(ctrl);
          return wrap;
        };
        qtyrow.appendChild(makeLine(sLab, 'small', e.small||0));
        qtyrow.appendChild(makeLine(lLab, 'large', e.large||0));

      }else{
        const unit = (it.prices.small ?? it.prices.large ?? 0);
        pricesEl.innerHTML = `<span class="pricechip">${formatRiel(unit)}</span>`;
        const ctrl = document.createElement('div');
        ctrl.className='qtyctrl';
        ctrl.innerHTML = `
          <button>−</button>
          <div class="qty">${e.one||0}</div>
          <button>+</button>
        `;
        ctrl.children[0].onclick = () => { setQty(it.code,'one',(ensure(it.code).one||0)-1); renderGrid(); renderCart(); };
        ctrl.children[2].onclick = () => { setQty(it.code,'one',(ensure(it.code).one||0)+1); renderGrid(); renderCart(); };
        qtyrow.appendChild(ctrl);
      }

      grid.appendChild(card);
    }
  }

  function renderCart(){
    const badge = $('cartBadge');
    const count = cartCount();
    badge.textContent = String(count);
    badge.style.display = count ? 'inline-flex' : 'none';

    const cartItems = $('cartItems');
    cartItems.innerHTML = "";

    const entries = Object.entries(state.cart)
      .map(([code,e]) => ({code,e,it:byCode(code)}))
      .filter(x => x.it && ((x.e.small||0)+(x.e.large||0)+(x.e.one||0) > 0));

    $('totalValue').textContent = formatRiel(cartTotal());
    $('checkoutBtn').disabled = entries.length === 0;

    if(entries.length === 0){
      cartItems.innerHTML = `<p style="color:var(--muted);margin:6px 0 0">${t('empty')}</p>`;
      return;
    }

    for(const {code,e,it} of entries){
      const row = document.createElement('div');
      row.className='cartitem';
      row.innerHTML = `
        <div class="cmeta">
          <b>${code} — ${getDisplayName(it)}</b>
          <small>${getKhmerName(it)}</small>
        </div>
        <div class="cqty"></div>
      `;
      const q = row.querySelector('.cqty');

      if(it.hasSize){
        q.style.flexDirection='column';
        q.style.alignItems='flex-end';
        const sLab = it.sizeLabels.small || "700ml";
        const lLab = it.sizeLabels.large || "1000ml";

        const line = (label, which, val) => {
          const wrap = document.createElement('div');
          wrap.style.display='flex'; wrap.style.alignItems='center'; wrap.style.gap='8px';
          wrap.innerHTML = `<small style="color:var(--muted)">${label}</small>`;
          const minus = document.createElement('button'); minus.textContent="−";
          const plus = document.createElement('button'); plus.textContent="+";
          const num = document.createElement('span'); num.textContent=String(val);
          num.style.fontWeight='800';
          minus.onclick = () => { setQty(code, which, (ensure(code)[which]||0)-1); renderGrid(); renderCart(); };
          plus.onclick = () => { setQty(code, which, (ensure(code)[which]||0)+1); renderGrid(); renderCart(); };
          wrap.appendChild(minus); wrap.appendChild(num); wrap.appendChild(plus);
          return wrap;
        };
        if((e.small||0)>0) q.appendChild(line(sLab,'small',e.small||0));
        if((e.large||0)>0) q.appendChild(line(lLab,'large',e.large||0));
        // show both lines even if 0? keep only existing to reduce clutter
        if((e.small||0)===0) q.appendChild(line(sLab,'small',0));
        if((e.large||0)===0) q.appendChild(line(lLab,'large',0));

      }else{
        const minus = document.createElement('button'); minus.textContent="−";
        const plus = document.createElement('button'); plus.textContent="+";
        const num = document.createElement('span'); num.textContent=String(e.one||0);
        num.style.fontWeight='800';
        minus.onclick = () => { setQty(code,'one',(ensure(code).one||0)-1); renderGrid(); renderCart(); };
        plus.onclick = () => { setQty(code,'one',(ensure(code).one||0)+1); renderGrid(); renderCart(); };
        q.appendChild(minus); q.appendChild(num); q.appendChild(plus);
      }

      cartItems.appendChild(row);
    }
  }

  function openDrawer(){
    $('overlay').classList.add('show');
    $('drawer').classList.add('show');
  }
  function closeDrawer(){
    $('overlay').classList.remove('show');
    $('drawer').classList.remove('show');
  }

  function buildTelegramMessage(){
    const building = $('building').value.trim() || "HISO";
    const floor = $('floor').value.trim() || "__";
    const room = $('room').value.trim() || "__";
    const phone = $('phone').value.trim() || "__";
    const payment = $('payment').value;

    const lines = [];
    lines.push("📦 ការបញ្ជាទិញ (MOMS SHOP)");
    lines.push("");

    const entries = Object.entries(state.cart)
      .map(([code,e]) => ({code,e,it:byCode(code)}))
      .filter(x => x.it && ((x.e.small||0)+(x.e.large||0)+(x.e.one||0) > 0));

    for(const {code,e,it} of entries){
      const nameKm = getKhmerName(it);
      if(it.hasSize){
        const sLab = it.sizeLabels.small || "700ml";
        const lLab = it.sizeLabels.large || "1000ml";
        if((e.small||0)>0) lines.push(`${code} ${nameKm} (${sLab}) x${e.small}`);
        if((e.large||0)>0) lines.push(`${code} ${nameKm} (${lLab}) x${e.large}`);
      }else{
        const unit = (it.prices.small ?? it.prices.large ?? 0);
        if((e.one||0)>0) lines.push(`${code} ${nameKm} x${e.one} (${unit}៛)`);
      }
    }

    lines.push("");
    lines.push(`💰 សរុប: ${formatRiel(cartTotal())}`);
    lines.push(`📍 ទីតាំង: ${building} ជាន់ ${floor} បន្ទប់ ${room}`);
    lines.push(`📞 លេខទូរស័ព្ទ: ${phone}`);
    lines.push(`💳 វិធីបង់ប្រាក់: ${payment}`);
    lines.push("");
    lines.push("🕘 ម៉ោងបើក: 09:00–23:00");
    return lines.join("\n");
  }

  async function init(){
    if(!state.lang) state.lang='en';
    applyUI();

    $('searchInput').addEventListener('input', (e)=>{ state.query=e.target.value; renderGrid(); });
    $('cartBtn').onclick=openDrawer;
    $('overlay').onclick=closeDrawer;
    $('closeDrawer').onclick=closeDrawer;

    $('checkoutBtn').onclick=()=>{
      const msg = buildTelegramMessage();
      const url = `https://t.me/${TELEGRAM_USERNAME}?text=${encodeURIComponent(msg)}`;
      window.open(url, "_blank");
    };

    $('langBtn').onclick=()=>{
      const chosen = prompt("Select language: km/en/zh/th/vi/id", state.lang);
      if(chosen) setLang(chosen.trim());
    };

    const res = await fetch(DATA_URL);
    const data = await res.json();
    state.items = data.items || [];

    renderCategories();
    renderGrid();
    renderCart();
  }

  init().catch(err=>{
    console.error(err);
    alert("Failed to load menu data. Use a local web server (VS Code Live Server).");
  });
})();
