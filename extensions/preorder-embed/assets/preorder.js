(function() {
  console.log("[Preorder] Final Mode - Untracked = Preorder");
  
  async function init() {
    const shop = window.Shopify?.shop;
    
    let settings = { 
      buttonLabel: "Preorder", 
      preorderMessage: "Your Preorder is available from 25th June"
    };
    
    if (shop) {
      try {
        const resp = await fetch(`/apps/api/preorder-data?shop=${shop}`);
        const data = await resp.json();
        if (data.settings) {
          settings.buttonLabel = data.settings.buttonLabel || settings.buttonLabel;
          settings.preorderMessage = data.settings.preorderMessage || settings.preorderMessage;
        }
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
                  document.querySelector(".single-product__add-to-cart");
      
      if (!btn) return;

      const variantId = getLiveId();
      if (!variantId || !productData) return;

      const variant = productData.variants.find(v => v.id.toString() === variantId);
      if (!variant) return;

      const qty = variant.inventory_quantity;
      const isTracked = variant.inventory_management === "shopify";
      
      let showPreorder = false;
      
      if (isTracked) {
        // Tracked: show preorder if qty <= 0
        showPreorder = qty !== null && qty !== undefined && qty <= 0;
        console.log(`[Preorder] Tracked: qty=${qty}, showPreorder=${showPreorder}`);
      } else {
        // Untracked: ALWAYS show preorder
        showPreorder = true;
        console.log(`[Preorder] Untracked: showing preorder`);
      }

      if (!showPreorder) {
        console.log(`[Preorder] Keeping default button`);
        return;
      }

      console.log(`[Preorder] ✓ Showing Preorder button`);

      const span = btn.querySelector('[data-add-to-cart-text]') || btn.querySelector('span');
      if (span) {
        span.textContent = settings.buttonLabel;
      } else {
        btn.textContent = settings.buttonLabel;
      }

      btn.disabled = false;
      btn.style.visibility = "visible";

      if (!document.getElementById("p-msg")) {
        const m = document.createElement("p");
        m.id = "p-msg"; 
        m.textContent = settings.preorderMessage; 
        m.style.cssText = "margin-top:10px; font-size:14px; color:#666; text-align:center;";
        btn.parentElement.appendChild(m);
      }

      if (!btn._preBound) {
        btn._preBound = true;
        btn.addEventListener('click', async (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          const originalText = span ? span.textContent : btn.textContent;
          if (span) span.textContent = "Adding..."; else btn.textContent = "Adding...";
          btn.disabled = true;

          try {
            const vid = getLiveId();
            const cartResp = await fetch('/cart/add.js', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                items: [{ id: vid, quantity: 1, properties: { '_preorder': 'true' } }]
              })
            });

            if (cartResp.ok) {
              window.location.href = '/cart';
            } else {
              alert("Error adding to cart");
              if (span) span.textContent = originalText; else btn.textContent = originalText;
              btn.disabled = false;
            }
          } catch(ex) { 
            alert("Error adding to cart");
            if (span) span.textContent = originalText; else btn.textContent = originalText;
            btn.disabled = false;
          }
        }, true);
      }
    };

    setInterval(run, 1500);
    setTimeout(run, 500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
