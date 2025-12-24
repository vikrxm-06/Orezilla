document.addEventListener("DOMContentLoaded", () => {

    // ** IMPORTANT: ADJUST THIS VALUE **
    // This value must be the height of your sticky navbar in pixels (e.g., 120, 130, 140).
    const SCROLL_OFFSET_FIX = 120; 
    
    // =========================================================
    // 1. TIMELINE ANIMATION LOGIC (Your Existing Code)
    // =========================================================
    const line = document.getElementById("progress-line");
    const dots = document.querySelectorAll(".timeline-dot"); 

    if (line && dots.length > 0) {
        // ... (rest of your timeline setup code) ...
        const firstDotTop = dots[0].offsetTop + dots[0].offsetHeight / 2;
        const lastDotTop = dots[dots.length - 1].offsetTop + dots[dots.length - 1].offsetHeight / 2;
        const maxHeight = lastDotTop - firstDotTop;
        let currentHeight = 0;

        function updateLine() {
            const scrollTop = window.scrollY;
            const viewportCenter = scrollTop + window.innerHeight / 2;
            let targetHeight = viewportCenter - firstDotTop;

            if (targetHeight < 0) targetHeight = 0;
            if (targetHeight > maxHeight) targetHeight = maxHeight;

            animateLine(targetHeight);
            
            dots.forEach(dot => {
                const dotCenter = dot.getBoundingClientRect().top + dot.offsetHeight / 2;
                if (dotCenter <= window.innerHeight / 2) {
                    dot.classList.add("active-dot"); 
                } else {
                    dot.classList.remove("active-dot");
                }
            });
        }

        function animateLine(targetHeight) {
            const speed = 0.15;
            currentHeight += (targetHeight - currentHeight) * speed;
            line.style.top = firstDotTop + "px"; 
            line.style.height = currentHeight + "px";

            if (Math.abs(currentHeight - targetHeight) > 0.5) {
                requestAnimationFrame(() => animateLine(targetHeight));
            }
        }

        window.addEventListener("scroll", updateLine);
        window.addEventListener("resize", updateLine);
        updateLine(); 
    }

    // ----------------------------------------------------------------------
    
    
    // =========================================================
    // 2. SERVICE DETAIL TOGGLE LOGIC (Manual Click)
    // =========================================================
    
    const viewDetailsBtns = document.querySelectorAll('.service-arrow-link[data-target]');
    const closeBtns = document.querySelectorAll('.close-panel-btn');

    viewDetailsBtns.forEach(btn => {
        btn.addEventListener('click', (event) => {
            event.preventDefault(); 
            
            const targetId = btn.getAttribute('data-target');
            const targetPanel = document.querySelector(targetId);

            // Close all other panels (Accordion effect)
            document.querySelectorAll('.service-details-panel.is-active').forEach(panel => {
                if (panel !== targetPanel) {
                    panel.classList.remove('is-active');
                }
            });

            if (targetPanel) {
                // Toggles the 'is-active' class to show/hide the panel.
                // NO SCROLLING here, as requested by you for manual clicks.
                targetPanel.classList.toggle('is-active'); 
            }
        });
    });

    // Logic to CLOSE the panel
    closeBtns.forEach(closeBtn => {
        closeBtn.addEventListener('click', (event) => {
            event.preventDefault();
            const panel = closeBtn.closest('.service-details-panel');
            if (panel) {
                panel.classList.remove('is-active');
            }
        });
    });


    // =========================================================
    // 3. HASH CHECKER LOGIC (Redirect Auto-Open)
    // =========================================================

    function handleUrlHash() {
        const hash = window.location.hash; // e.g., #service-web-dev
        
        if (hash) {
            // Find the service row that matches the hash ID
            const serviceRow = document.querySelector(hash);
            
            if (serviceRow) {
                // Find the View Details button inside that row
                const btn = serviceRow.querySelector('.service-arrow-link[data-target]');

                if (btn) {
                    // Get the target detail panel ID (e.g., #details-web-dev)
                    const detailPanelId = btn.getAttribute('data-target');
                    const targetPanel = document.querySelector(detailPanelId);

                    if (targetPanel) {
                        // 1. Open the panel
                        targetPanel.classList.add('is-active');

                        // 2. Scroll to the panel (necessary for cross-page redirection)
                        // Wait briefly for the CSS transition (max-height) to start
                        setTimeout(() => {
                            // Calculate the correct scroll position
                            const scrollTarget = targetPanel.offsetTop - SCROLL_OFFSET_FIX;
                            
                            window.scrollTo({
                                top: scrollTarget,
                                behavior: 'smooth'
                            });
                            
                            // Remove the hash from the URL after scrolling for a cleaner look
                            // window.history.replaceState(null, null, ' ');
                        }, 200); // 200ms delay to allow max-height transition to start
                    }
                }
            }
        }
    }
    
    // Run the hash check function once the page is fully loaded
    handleUrlHash();
});