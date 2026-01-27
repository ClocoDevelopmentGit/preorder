(function() {
  async function init() {
    const shop = window.Shopify?.shop;
    let settings = { enablePreorderAll: false, buttonLabel: "Preorder", preorderMessage: "Preorder available soon" };
    let preorderProducts = [];
    if (shop) {
      try {
        const resp = await fetch(`/apps/api/preorder-data?shop=${shop}`);
        const data = await resp.json();
        if (data.settings) {
          settings.buttonLabel = data.settings.buttonLabel || settings.buttonLabel;
          settings.preorderMessage = data.settings.preorderMessage || settings.preorderMessage;
          settings.enablePreorderAll = !!data.settings.enablePreorderAll;
        }
        if (data.products) preorderProducts = data.products;
      } catch(e) {}
    }
    const getLiveId = () => {
      const url = new URLSearchParams(window.location.search).get('variant');
      if (url && /^\d+$/.test(url)) return url;
      return window.ShopifyAnalytics?.meta?.selectedVariantId?.toString() || 
             document.querySelector('form[action^="/cart/add"] [name="id"]')?.value;
    };
    let productData = null;
    const match = window.location.pathname.match(/\/products\/([^\/?]+)/);
    if (match) {
      try {
        const res = await fetch(`/products/${match[1]}.js`);
        if (res.ok) productData = await res.json();
      } catch(e) {}
    }
    const run = () => {
      const btn = document.getElementById("btn-preOrder") || 
                  document.querySelector(".single-product__add-to-cart") || 
                  document.querySelector("[name='add']");
      if (!btn) return;
      
      const variantId = getLiveId();
      if (!variantId || !productData) return;
      const variant = productData.variants.find(v => v.id.toString() === variantId);
      if (!variant) return;

      const qty = variant.inventory_quantity;
      const isTracked = variant.inventory_management === "shopify";
      const pId = productData.id.toString();
      
      const productEntry = preorderProducts.find(p => 
        p.productId === pId || p.productId.endsWith(`/${pId}`) || p.productId.includes(`Product/${pId}`)
      );
      
      let isCandidate = false;
      if (isTracked) {
        isCandidate = (qty !== null && qty <= 0) && (variant.inventory_policy === 'continue');
      } else {
        isCandidate = true;
      }

      const variantKey = `${pId}-${variantId}`;
      if (window._lastPreorderV !== variantKey) {
        window._lastPreorderV = variantKey;
        console.log(`[Preorder] Checking: "${productData.title}"`);
        console.log(`[Preorder] ID: ${pId}, In List: ${!!productEntry}, Candidate: ${isCandidate}`);
        
        if (!productEntry && !settings.enablePreorderAll) {
          console.warn(`[Preorder] Product NOT in list. Current list IDs:`, preorderProducts.map(p => p.productId));
        }
        
        if (isTracked && qty <= 0 && variant.inventory_policy !== 'continue') {
            console.error("[Preorder] ❌ FIX REQUIRED: 'Continue selling when out of stock' is NOT enabled in Shopify Admin.");
        }
      }

      let showPreorder = false;
      if (settings.enablePreorderAll) {
        showPreorder = isCandidate && (!productEntry || productEntry.status !== "Disabled");
      } else {
        const vEntry = productEntry?.variants?.find(v => v.variantId.endsWith(`/${variantId}`) || v.variantId === variantId);
        showPreorder = isCandidate && productEntry && productEntry.status === "Enabled" && (!vEntry || vEntry.status === "Enabled");
      }

      const existingMsg = document.getElementById("p-msg");
      if (!showPreorder) {
        if (existingMsg) existingMsg.remove();
        return;
      }

      const span = btn.querySelector('[data-add-to-cart-text]') || btn.querySelector('span');
      const setBtnText = (txt) => { if (span) span.textContent = txt; else btn.textContent = txt; };
      if ((span ? span.textContent : btn.textContent) !== settings.buttonLabel) setBtnText(settings.buttonLabel);
      btn.disabled = false;
      btn.style.visibility = "visible";
      if (!document.getElementById("p-msg")) {
        const m = document.createElement("p");
        m.id = "p-msg"; m.textContent = settings.preorderMessage; 
        m.style.cssText = "margin-top:10px; font-size:14px; color:#666; text-align:center;";
        if(btn.parentNode) btn.parentNode.insertBefore(m, btn.nextSibling);
      }
      if (!btn._preBound) {
        btn._preBound = true;
        btn.addEventListener('click', async (e) => {
          if ((span ? span.textContent : btn.textContent) !== settings.buttonLabel) return;
          e.preventDefault(); e.stopPropagation();
          const oldTxt = settings.buttonLabel;
          setBtnText("Adding...");
          btn.disabled = true;
          try {
            const vid = getLiveId();
            const r = await fetch('/cart/add.js', {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ items: [{ id: vid, quantity: 1, properties: { '_preorder': 'true' } }] })
            });
            if (r.ok) window.location.href = '/cart'; else { alert("Error adding to cart"); setBtnText(oldTxt); btn.disabled = false; }
          } catch(ex) { alert("Error adding to cart"); setBtnText(oldTxt); btn.disabled = false; }
        }, true);
      }
    };
    const runCartLogic = () => {
      const cartRows = document.querySelectorAll('.cart-item');
      const checkoutBtns = document.querySelectorAll('.cart__checkout-button, [name="checkout"], .cart__ctas');
      if (cartRows.length === 0 && checkoutBtns.length === 0) return;
      if (_cartChecking) return;
      _cartChecking = true;
      fetch('/cart.js').then(r => r.json()).then(cart => {
          const preorderIndices = new Set(); 
          let hasPreorder = false;
          cart.items.forEach((item, idx) => {
             if (item.properties && (item.properties['_preorder'] === 'true' || item.properties['_preorder'] === true)) {
                 preorderIndices.add(idx); hasPreorder = true;
             }
          });
          document.querySelectorAll('[data-index]').forEach(el => {
              const idxStr = el.getAttribute('data-index');
              if (!idxStr) return;
              const rowIndex = parseInt(idxStr) - 1; 
              const row = el.closest('.cart-item');
              if (row) {
                  const details = row.querySelector('.cart-item__details');
                  const existing = row.querySelector('.preorder-cart-msg');
                  if (preorderIndices.has(rowIndex)) {
                      if (details && !existing) {
                          const msg = document.createElement("div");
                          msg.className = "preorder-cart-msg";
                          msg.textContent = settings.preorderMessage;
                          msg.style.cssText = "font-size: 12px; color: #666; margin-top: 4px; font-style: italic; display: block;";
                          const title = details.querySelector('.cart-item__name, .product-title, h3, a');
                          if (title) title.parentNode.insertBefore(msg, title.nextElementSibling || null);
                          else details.appendChild(msg);
                      }
                  } else if (existing) existing.remove();
              }
          });
          const footerMsgId = 'preorder-footer-warning';
          if (hasPreorder) {
              checkoutBtns.forEach(btnContainer => {
                  const parent = btnContainer.closest('.cart__ctas') || btnContainer.parentNode;
                  if (parent && !parent.querySelector('#' + footerMsgId)) {
                      const note = document.createElement("div");
                      note.id = footerMsgId;
                      note.innerHTML = `<span style="display:block; margin-bottom:5px;">⚠️ <b>Note:</b> Order contains preorder items.</span>`;
                      note.style.cssText = "font-size: 13px; color: #444; margin-top: 10px; text-align: center; width:100%; border:1px solid #ddd; padding:8px; background:#fafafa; border-radius:4px;";
                      parent.appendChild(note);
                  }
              });
          } else document.querySelectorAll('#' + footerMsgId).forEach(el => el.remove());
          _cartChecking = false;
      }).catch(() => { _cartChecking = false; });
    };
    let _cartChecking = false;
    setInterval(run, 1500);
    setInterval(runCartLogic, 1000);
    setTimeout(run, 500);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();


