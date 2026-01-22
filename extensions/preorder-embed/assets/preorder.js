(function() {
  async function init() {
    console.log("[Preorder] Cart Mode v1");
    const shop = window.Shopify?.shop;
    if (!shop) return;
    
    // Fetch settings to get labels/messages
    let settings = { buttonLabel: "Preorder Now", preorderMessage: "This is a preorder item." };
    try {
      const resp = await fetch(`/apps/api/preorder-data?shop=${shop}`);
      const data = await resp.json();
      if (data.settings) settings = { ...settings, ...data.settings };
    } catch(e) { console.warn("[Preorder] Using default settings"); }

    const getLiveId = () => {
      const url = new URLSearchParams(window.location.search).get('variant');
      if (url && /^\d+$/.test(url)) return url;
      return window.ShopifyAnalytics?.meta?.selectedVariantId?.toString() || 
             document.querySelector('form[action^="/cart/add"] [name="id"]')?.value;
    };

    const run = () => {
      try {
        const btn = document.getElementById("btn-preOrder") || 
                    document.querySelector(".single-product__add-to-cart");
        
        if (!btn) return;

        // Force text change
        const label = settings.buttonLabel || "Preorder Now";
        const span = btn.querySelector('[data-add-to-cart-text]') || btn.querySelector('span');
        
        if (span) {
          if (span.textContent.trim() !== label) span.textContent = label;
        } else if (btn.textContent.trim() !== label) {
          btn.textContent = label;
        }

        btn.style.visibility = "visible";
        btn.disabled = false;
        btn.classList.remove('disabled');

        // Add message if missing
        if (settings.preorderMessage && !document.getElementById("p-msg")) {
          const m = document.createElement("p");
          m.id = "p-msg"; 
          m.textContent = settings.preorderMessage; 
          m.style.cssText = "margin-top:10px; font-size:14px; color:inherit; text-align:center; width:100%;";
          btn.after(m);
        }

        // Click Handler (Standard Cart Add)
        if (!btn._preBound) {
          btn._preBound = true;
          btn.addEventListener('click', async (e) => {
             e.preventDefault(); e.stopPropagation();
             
             const originalText = span ? span.textContent : btn.textContent;
             if (span) span.textContent = "Adding..."; else btn.textContent = "Adding...";
             btn.style.opacity = "0.7";
             btn.disabled = true;

             try {
               const variantId = getLiveId();
               
               // Use standard Shopify cart/add.js
               const cartResp = await fetch('/cart/add.js', {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({ 
                   items: [{ id: variantId, quantity: 1, properties: { '_preorder': 'true' } }]
                 })
               });

               if (cartResp.ok) {
                 // Redirect to cart
                 window.location.href = '/cart';
               } else {
                 const error = await cartResp.json();
                 alert(error.description || "Error adding to cart");
                 if (span) span.textContent = originalText; else btn.textContent = originalText;
                 btn.style.opacity = "1";
                 btn.disabled = false;
               }
             } catch(ex) { 
               alert("Error adding to cart");
               if (span) span.textContent = originalText; else btn.textContent = originalText;
               btn.style.opacity = "1";
               btn.disabled = false;
             }
          }, true);
        }
      } catch(e) {}
    };

    setInterval(run, 1000);
    run();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
