(function() {
  async function init() {
    const shop = window.Shopify?.shop;
    let settings = { enablePreorderAll: false, buttonLabel: "Preorder", preorderMessage: "Preorder available soon", enabled: true };
    let preorderProducts = [];
    const variantStatusCache = new Map();
    const fetchFailedCache = new Set();

    async function fetchSettings() {
      if (!shop) return;
      try {
        const resp = await fetch(`/apps/api/preorder-data?shop=${shop}`);
        if (!resp.ok) return;
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
      if (fetchFailedCache.has(variantId)) return null;
      
      try {
        const resp = await fetch(`/apps/api/preorder-data?shop=${shop}&variantId=${variantId}`);
        if (!resp.ok) {
           fetchFailedCache.add(variantId);
           return null;
        }
        const data = await resp.json();
        if (data.success && data.variantInfo) {
          variantStatusCache.set(variantId, data.variantInfo);
          return data.variantInfo;
        }
      } catch(e) { 
        console.error("[Preorder] Failed to fetch variant status:", e);
        fetchFailedCache.add(variantId);
      }
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

        const vStatus = await fetchVariantStatus(variantId);
        const variant = productData.variants.find(v => v.id.toString() === variantId);
        const isTracked = variant?.inventory_management === "shopify";
        
        let isCandidate = false;
        if (vStatus) {
           isCandidate = vStatus.isOutOfStock && vStatus.canPreorder;
        } else {
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

        const displayLabel = "Pre-Order Now";
        const span = btn.querySelector('[data-add-to-cart-text]') || btn.querySelector('span') || btn;
        const currentText = span.textContent.trim();
        if (!btn._originalText && currentText !== displayLabel) btn._originalText = currentText;
        if (currentText !== displayLabel) span.textContent = displayLabel;
        
        btn.disabled = false;
        btn.style.visibility = "visible";
        btn.style.display = "inline-block";

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

        if (!document.getElementById("p-badge")) {
          const image = document.querySelector(".grid__item.product__media-wrapper");
          if (image) {
            if (window.getComputedStyle(image).position === 'static') image.style.position = "relative";
            const b = document.createElement("span");
            b.id = "p-badge"; b.textContent = "PREORDER";
            b.style.cssText = "display: inline-block; background:#8CA0AA; color: #fff; padding: 4px 12px; border-radius: 4px; font-size: 11px; font-weight: 700; letter-spacing: 1px; margin-left: 15px; vertical-align: middle; text-transform: uppercase;position:absolute;top:0px;left:0px;";
            image.appendChild(document.createTextNode(" ")); image.appendChild(b);
          }
        }

        if (!document.getElementById("p-msg")) {
          const m = document.createElement("div");
          m.id = "p-msg"; 
          m.style.cssText = "margin-top:20px; display:flex; align-items:flex-start; font-family: inherit; color: #333; line-height: 1.4; text-align: left !important; width: 100%; clear: both; animation: fadeIn 0.4s ease;";
          
          const iconHtml = `<div style="background: #a5bdaf; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; margin-right: 12px; flex-shrink: 0; box-shadow: 0 2px 4px rgba(165,189,175,0.2);">
           <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
<circle cx="16" cy="16" r="16" fill="#8CA0AA"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M13.902 4.68604C15.652 4.68604 16.693 5.5171 16.693 7.04834V8.66748H19.318C19.6855 8.66748 19.992 8.95623 20.0182 9.32373C20.1407 11.2398 20.2285 12.4559 20.2897 13.4009C23.7459 13.5846 26.4938 16.3233 26.4938 19.9458C26.4938 23.5682 23.5537 26.5081 19.9313 26.5083C16.9388 26.5083 14.418 24.496 13.6305 21.7573H6.60513C6.19388 21.7573 5.86994 21.4069 5.90494 20.9956C6.16739 17.9598 6.28139 16.6386 6.38638 15.4487L6.41177 15.1597C6.48177 14.3547 6.55193 13.5405 6.66568 12.228C6.82316 10.347 6.86701 9.91797 6.90201 9.59424V9.47217C6.91074 9.41975 6.91956 9.36728 6.91958 9.30615C6.95458 8.9474 7.26103 8.66748 7.61978 8.66748H10.6471V7.04834L10.6735 6.85596C11.076 5.42978 12.2134 4.68611 13.902 4.68604ZM19.9401 14.7837C19.6164 14.7837 19.301 14.8094 18.9948 14.8706C16.5973 15.3169 14.777 17.4171 14.777 19.9458C14.777 20.0857 14.7858 20.217 14.7946 20.3569C14.8383 20.8469 14.9438 21.3198 15.11 21.7573C15.8451 23.7172 17.7264 25.1079 19.9401 25.1079C22.7924 25.1077 25.1022 22.7982 25.1022 19.9458C25.1022 17.251 23.0374 15.0378 20.3952 14.8101C20.2465 14.7926 20.0887 14.7837 19.9401 14.7837ZM19.9401 16.2271C20.3251 16.2271 20.6403 16.5422 20.6403 16.9272V19.6831L20.6667 19.7183C20.7279 19.7882 20.7629 19.8233 20.8678 19.9458L20.9372 20.0249C21.2347 20.3661 21.3668 20.523 21.568 20.7417L21.7077 20.8999C21.8651 21.0749 22.0579 21.3021 22.3727 21.6606C22.6265 21.9494 22.5999 22.3962 22.3024 22.6499C22.0137 22.9034 21.5678 22.8769 21.3141 22.5796C20.8507 22.0462 20.6316 21.8012 20.4479 21.5913L20.3249 21.4507C20.2024 21.3108 20.0797 21.1702 19.8786 20.9429C19.7739 20.8207 19.7123 20.7599 19.6686 20.7075L19.6081 20.6284C19.6081 20.6284 19.5552 20.5755 19.5202 20.5317C19.4852 20.491 19.4556 20.4564 19.4323 20.4272C19.4308 20.4258 19.4143 20.4092 19.4059 20.4009C19.2923 20.2697 19.2311 20.1119 19.2311 19.937V16.9185C19.2311 16.5335 19.5463 16.2183 19.9313 16.2183L19.9401 16.2271ZM8.25845 10.0669V10.1284C8.2322 10.4609 8.17989 11.0211 8.08365 12.1235L8.06607 12.3511C7.95235 13.672 7.88215 14.4769 7.81216 15.2817L7.7858 15.5708C7.6983 16.6207 7.59347 17.7582 7.39224 20.0942L7.36685 20.3481H13.3952C13.3864 20.2169 13.3776 20.0769 13.3776 19.937C13.3776 16.6647 15.7746 13.9613 18.8981 13.4624C18.8456 12.6487 18.7756 11.6158 18.6706 10.1108V10.0669H16.7018V11.1782C16.7018 11.5631 16.3874 11.8782 16.0026 11.8784C15.6176 11.8784 15.3024 11.5632 15.3024 11.1782V10.0669H12.0563V11.1782C12.0563 11.537 11.7843 11.8259 11.443 11.8784H11.3561C10.9711 11.8784 10.6559 11.5632 10.6559 11.1782V10.0669H8.25845ZM13.9108 6.09424C12.8522 6.09428 12.2925 6.43639 12.0563 7.1626V8.67627H15.3024V7.05713C15.3024 6.37463 14.952 6.09424 13.9108 6.09424Z" fill="white"/>
</svg>
          </div>`;
          
          let rawMsg = settings.preorderMessage || "Available for Pre-Order";
          if (productEntry && productEntry.customSettings) {
             try {
               const custom = typeof productEntry.customSettings === 'string' ? JSON.parse(productEntry.customSettings) : productEntry.customSettings;
               if (custom.preorderMessage) rawMsg = custom.preorderMessage;
             } catch(e) {}
          }

          let headerText = "ETA to Our Warehouse:";
          let mainText = rawMsg;
          let subText = "| Dispatch starts after this date";
          let isDateStyle = false;

          if (rawMsg.toLowerCase().includes("available from")) {
             mainText = rawMsg.split(/available from/i).pop().trim();
             isDateStyle = true;
          } else if (rawMsg.length < 25 && /\d/.test(rawMsg)) {
             isDateStyle = true;
          }

          const textHtml = `<div>
            <div style="font-weight: bold; font-size: 14px;color:#3A3A3A; letter-spacing: 1px; margin-bottom: 2px;line-height: 30px;"><span style="color: #677F87;">PRE-ORDER | </span>${headerText}</div>
            <div style="font-size: 14px; color: #333;">
              <span style="font-weight: 700; color:black;">${mainText}</span>
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
            if (span.textContent.trim() !== "Pre-Order Now") return;
            e.preventDefault(); e.stopPropagation();
            const oldTxt = span.textContent;
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

    const runCollectionLogic = () => {
      if (settings.enabled === false) return;
      
      const cards = document.querySelectorAll('.card-wrapper, .card, .grid__item, .product-card, .product-item');
      if (!cards.length) return;

      cards.forEach(card => {
        if (card.querySelector('.p-grid-badge')) return;

        const link = card.querySelector('a[href*="/products/"]');
        if (!link) return;

        try {
          const rawPath = link.getAttribute('href');
          const handleMatch = rawPath.match(/\/products\/([^\/\?#]+)/);
          if (!handleMatch) return;
          
          const handle = decodeURIComponent(handleMatch[1]);
          const productEntry = preorderProducts.find(p => p.handle === handle);
          
          // Debugging (Helpful for complex themes)
          // console.log(`[Preorder] Checking grid item: ${handle}`, !!productEntry);

          const isSoldOut = card.innerText.toLowerCase().includes('sold out') || 
                            card.innerText.toLowerCase().includes('out of stock') ||
                            card.querySelector('.badge--sold-out') || 
                            card.querySelector('.product-label-sold-out') ||
                            card.querySelector('.sold-out') ||
                            card.querySelector('.badge--out-of-stock');

          let shouldShow = false;
          
          if (productEntry && productEntry.status === "Enabled") {
            // Priority 1: Specifically enabled preorder product
            shouldShow = true;
          } else if (settings.enablePreorderAll && isSoldOut) {
            // Priority 2: Global preorder enabled and item is sold out
            shouldShow = true;
          }

          if (shouldShow) {
            // Support multiple theme structures for image container
            const media = card.querySelector('.card__media, .media, .product-card__image-wrapper, .image-wrapper, .grid-view-item__image-container, .product-item__image-wrapper, .card__inner');
            if (media) {
              if (window.getComputedStyle(media).position === 'static') media.style.position = 'relative';
              const b = document.createElement("span");
              b.className = "p-grid-badge";
              b.textContent = "PRE-ORDER";
              b.style.cssText = "position: absolute; top: 12px; left: 12px; z-index: 5; background: #8CA0AA; color: #fff; padding: 4px 10px; border-radius:0px 6px 6px 0px; font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; box-shadow: 0 2px 5px rgba(0,0,0,0.2); pointer-events: none;";
              media.appendChild(b);
            }
          } 
        } catch (e) {
          // Silent fail for individual cards to keep script running
        }
      });
    };

    const runCartLogic = () => {
      if (_cC) return;
      _cC = true;
      fetch('/cart.js', { cache: 'no-store' }).then(r => r.json()).then(cart => {
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
    setInterval(run, 2000); 
    setInterval(runCollectionLogic, 3000);
    setInterval(runCartLogic, 5000); 
    setTimeout(run, 100);
    setTimeout(runCollectionLogic, 500);
    document.addEventListener('variant:change', () => setTimeout(run, 50));
    document.addEventListener('change', (e) => { 
        if (e.target.closest('form[action^="/cart/add"]')) {
            setTimeout(run, 50);
        }
    });
    window.addEventListener('load', () => {
        setTimeout(run, 1000);
        setTimeout(runCollectionLogic, 1000);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
