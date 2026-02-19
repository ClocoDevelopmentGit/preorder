(function() {
  async function init() {
    const shop = window.Shopify?.shop;
    let settings = { enablePreorderAll: false, buttonLabel: "Preorder", preorderMessage: "Preorder available soon", enabled: true };
    let preorderProducts = [];
    const variantStatusCache = new Map();

    async function fetchSettings() {
      if (!shop) return;
      try {
        const resp = await fetch(`/apps/api/preorder-data?shop=${shop}`);
        const data = await resp.json();
        if (data.settings) {
          settings = { ...settings, ...data.settings };
          settings.enablePreorderAll = !!data.settings.enablePreorderAll;
          settings.enabled = data.settings.enabled !== false;
        }
        if (data.products) preorderProducts = data.products;
      } catch(e) { console.error("[Preorder] Failed to fetch settings:", e); }
    }

    async function fetchVariantStatus(variantId) {
      if (!shop || !variantId) return null;
      if (variantStatusCache.has(variantId)) return variantStatusCache.get(variantId);
      
      try {
        const resp = await fetch(`/apps/api/preorder-data?shop=${shop}&variantId=${variantId}`);
        const data = await resp.json();
        if (data.success && data.variantInfo) {
          variantStatusCache.set(variantId, data.variantInfo);
          return data.variantInfo;
        }
      } catch(e) { console.error("[Preorder] Failed to fetch variant status:", e); }
      return null;
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

    let _runLock = false;
    const run = async () => {
      if (settings.enabled === false || _runLock) return;
      _runLock = true;
      
      try {
        const btn = document.getElementById("btn-preOrder") || 
                    document.querySelector(".product-form__submit") ||
                    document.querySelector(".single-product__add-to-cart") || 
                    document.querySelector(".add-to-cart") ||
                    document.querySelector("[name='add']") ||
                    document.querySelector('button[type="submit"][name="add"]');
        
        if (!btn) { _runLock = false; return; }

        const variantId = getLiveId();
        if (!variantId || !productData) { _runLock = false; return; }

        // 1. Get status (cached or fetch)
        const vStatus = await fetchVariantStatus(variantId);
        
        const variant = productData.variants.find(v => v.id.toString() === variantId);
        const isTracked = variant?.inventory_management === "shopify";
        
        // Accurate candidate check
        let isCandidate = false;
        if (vStatus) {
           isCandidate = vStatus.isOutOfStock && vStatus.canPreorder;
        } else {
           // Better fallback: if variant is tracked but NOT available, it's a solid candidate
           isCandidate = isTracked ? (!variant.available) : false;
        }

        const pId = productData.id.toString();
        const productEntry = preorderProducts.find(p => p.productId.split('/').pop() === pId);
        
        let showPreorder = settings.enablePreorderAll 
          ? (isCandidate && (!productEntry || productEntry.status !== "Disabled")) 
          : (isCandidate && productEntry && productEntry.status === "Enabled" && (!productEntry.variants?.find(v => v.variantId.split('/').pop() === variantId) || productEntry.variants.find(v => v.variantId.split('/').pop() === variantId).status === "Enabled"));
        
        const existingMsg = document.getElementById("p-msg");
        const existingBadge = document.getElementById("p-badge");
        const existingImgBadge = document.getElementById("p-img-badge");

        if (!showPreorder) {
          if (existingMsg) existingMsg.remove();
          if (existingBadge) existingBadge.remove();
          if (existingImgBadge) existingImgBadge.remove();
          if (btn._originalText) {
            const span = btn.querySelector('[data-add-to-cart-text]') || btn.querySelector('span') || btn;
            if (span.textContent === settings.buttonLabel) span.textContent = btn._originalText;
          }
          _runLock = false;
          return;
        }

        // 1. BUTTON TEXT (Figma: Pre-Order Now)
        const displayLabel = "Pre-Order Now";
        const span = btn.querySelector('[data-add-to-cart-text]') || btn.querySelector('span') || btn;
        const currentText = span.textContent.trim();
        if (!btn._originalText && currentText !== displayLabel) btn._originalText = currentText;
        if (currentText !== displayLabel) span.textContent = displayLabel;
        
        btn.disabled = false;
        btn.style.visibility = "visible";
        btn.style.display = "inline-block";

        // 2. BADGE ON IMAGE (Figma Style)
        if (!document.getElementById("p-img-badge")) {
           const media = document.querySelector(".product__media-container, .product-media-container, .product__media, .product__photo-wrapper, .image-wrapper, .main-image");
           if (media) {
              const b = document.createElement("span");
              b.id = "p-img-badge"; b.textContent = "PRE-ORDER";
              b.style.cssText = "position: absolute; top: 15px; left: 15px; z-index: 10; background: #a5bdaf; color: #fff; padding: 6px 16px; border-radius: 2px; font-size: 10px; font-weight: 700; letter-spacing: 1px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-transform: uppercase;";
              if (window.getComputedStyle(media).position === 'static') media.style.position = "relative";
              media.appendChild(b);
           }
        }

        // 3. BADGE NEAR TITLE (Fallback)
        if (!document.getElementById("p-badge")) {
          const title = document.querySelector(".product__title, .product-single__title, h1");
          if (title) {
            const b = document.createElement("span");
            b.id = "p-badge"; b.textContent = "PREORDER";
            b.style.cssText = "display: inline-block; background: #a5bdaf; color: #fff; padding: 4px 12px; border-radius: 4px; font-size: 11px; font-weight: 700; letter-spacing: 1px; margin-left: 15px; vertical-align: middle; text-transform: uppercase;";
            title.appendChild(document.createTextNode(" ")); title.appendChild(b);
          }
        }

        // 4. DYNAMIC FIGMA MESSAGE
        if (!document.getElementById("p-msg")) {
          const m = document.createElement("div");
          m.id = "p-msg"; 
          m.style.cssText = "margin-top:20px; display:flex; align-items:flex-start; font-family: inherit; color: #333; line-height: 1.4; text-align: left !important; width: 100%; clear: both; animation: fadeIn 0.4s ease;";
          
          const iconHtml = `<div style="background: #a5bdaf; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; margin-right: 12px; flex-shrink: 0; box-shadow: 0 2px 4px rgba(165,189,175,0.2);">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h14v12zm-7-8c-1.66 0-3-1.34-3-3H9c0 2.21 1.79 4 4 4s4-1.79 4-4h-1c0 1.66-1.34 3-3 3z"/></svg>
          </div>`;
          
          // Get Dynamic Message (Product Settings -> Global Settings)
          let rawMsg = settings.preorderMessage || "Available for Pre-Order";
          if (productEntry && productEntry.customSettings) {
             try {
               const custom = typeof productEntry.customSettings === 'string' ? JSON.parse(productEntry.customSettings) : productEntry.customSettings;
               if (custom.preorderMessage) rawMsg = custom.preorderMessage;
             } catch(e) {}
          }

          let headerText = "PRE-ORDER | ETA to Our Warehouse:";
          let mainText = rawMsg;
          let subText = "| Dispatch starts after this date";
          let isDateStyle = false;

          // If the message contains "available from", we format it like the Figma date
          if (rawMsg.toLowerCase().includes("available from")) {
             mainText = rawMsg.split(/available from/i).pop().trim();
             isDateStyle = true;
          } else if (rawMsg.length < 25 && /\d/.test(rawMsg)) {
             // Likely a short date string
             isDateStyle = true;
          }

          const textHtml = `<div>
            <div style="font-weight: bold; font-size: 11px; text-transform: uppercase; color: #777; letter-spacing: 1px; margin-bottom: 2px;">${headerText}</div>
            <div style="font-size: 14px; color: #333;">
              <span style="font-weight: 700; color: #333;">${mainText}</span>
              ${isDateStyle ? `<span style="color: #999; margin-left: 4px; font-weight: 400; font-size: 13px;">${subText}</span>` : ""}
            </div>
          </div>`;
          
          m.innerHTML = iconHtml + textHtml;
          const form = btn.closest('form[action^="/cart/add"]');
          if (form) form.appendChild(m); else if (btn.parentNode) btn.parentNode.insertBefore(m, btn.nextSibling);
        }

        if (!btn._pB) {
          btn._pB = true;
          btn.addEventListener('click', async (e) => {
            if (span.textContent.trim() !== settings.buttonLabel) return;
            e.preventDefault(); e.stopPropagation();
            const oldTxt = settings.buttonLabel;
            span.textContent = "Adding...";
            btn.disabled = true;
            try {
              const vid = getLiveId();
              const r = await fetch('/cart/add.js', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: [{ id: vid, quantity: 1, properties: { '_preorder': 'true' } }] })
              });
              if (r.ok) window.location.href = '/cart'; 
              else { const err = await r.json(); alert("Error: " + (err.description || "Could not add to cart")); span.textContent = oldTxt; btn.disabled = false; }
            } catch(ex) { alert("Error adding to cart"); span.textContent = oldTxt; btn.disabled = false; }
          }, true);
        }
      } catch (err) {
        console.warn("[Preorder] Run loop error:", err);
      } finally {
        _runLock = false;
      }
    };

    const runCartLogic = () => {
      if (_cC) return;
      _cC = true;
      fetch('/cart.js').then(r => r.json()).then(cart => {
          const preorderIndices = new Set(); let hasPreorder = false;
          cart.items.forEach((item, idx) => { if (item.properties?.['_preorder'] === 'true' || item.properties?.['_preorder'] === true) { preorderIndices.add(idx); hasPreorder = true; } });
          document.querySelectorAll('[data-index]').forEach(el => {
              const rowIndex = parseInt(el.getAttribute('data-index')) - 1; 
              const row = el.closest('.cart-item') || el.closest('.cart__row');
              if (row) {
                  const details = row.querySelector('.cart-item__details') || row.querySelector('.cart-item-details'), existing = row.querySelector('.preorder-cart-msg');
                  if (preorderIndices.has(rowIndex)) {
                      if (details && !existing) {
                          const msg = document.createElement("div"); msg.className = "preorder-cart-msg";
                          msg.textContent = settings.preorderMessage; msg.style.cssText = "font-size: 12px; color: #666; margin-top: 4px; font-style: italic; display: block;";
                          const title = details.querySelector('.cart-item__name, .product-title, h3, a');
                          if (title) title.parentNode.insertBefore(msg, title.nextElementSibling || null); else details.appendChild(msg);
                      }
                  } else if (existing) existing.remove();
              }
          });
          const footerMsgId = 'preorder-footer-warning';
          if (hasPreorder) {
              const checkoutBtns = document.querySelectorAll('.cart__checkout-button, [name="checkout"], .cart__ctas');
              checkoutBtns.forEach(btnContainer => {
                  const parent = btnContainer.closest('.cart__ctas') || btnContainer.parentNode;
                  if (parent && !parent.querySelector('#' + footerMsgId)) {
                      const note = document.createElement("div"); note.id = footerMsgId;
                      note.innerHTML = `<span style="display:block; margin-bottom:5px;">⚠️ <b>Note:</b> Order contains preorder items.</span>`;
                      note.style.cssText = "font-size: 13px; color: #444; margin-top: 10px; text-align: center; width:100%; border:1px solid #ddd; padding:8px; background:#fafafa; border-radius:4px;";
                      parent.appendChild(note);
                  }
              });
          } else document.querySelectorAll('#' + footerMsgId).forEach(el => el.remove());
          _cC = false;
      }).catch(() => { _cC = false; });
    };

    let _cC = false;
    await fetchSettings();
    setInterval(run, 500); setInterval(runCartLogic, 3000); 
    setTimeout(run, 50);
    document.addEventListener('variant:change', () => setTimeout(run, 50));
    document.addEventListener('change', (e) => { if (e.target.closest('form[action^="/cart/add"]')) setTimeout(run, 50); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
