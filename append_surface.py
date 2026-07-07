with open('style.css', 'a', encoding='utf-8') as f:
    f.write('''\n/* ==========================================================================
   Back to Surface Button
   ========================================================================== */
.back-to-surface {
    position: fixed;
    bottom: 30px;
    right: 30px;
    display: flex;
    align-items: center;
    gap: 12px;
    background: rgba(12, 36, 68, 0.85);
    backdrop-filter: blur(10px);
    border: 1px solid var(--color-blue);
    padding: 8px 16px 8px 8px;
    border-radius: 50px;
    color: var(--text-primary);
    text-decoration: none;
    z-index: 999;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    overflow: hidden;
}

.back-to-surface.hidden {
    opacity: 0;
    transform: translateY(50px) scale(0.8);
    pointer-events: none;
}

.back-to-surface.visible {
    opacity: 1;
    transform: translateY(0) scale(1);
    pointer-events: auto;
}

.surface-gauge {
    background: #000;
    border: 2px solid var(--color-orange);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Courier New', Courier, monospace;
    font-weight: bold;
    font-size: 0.75rem;
    color: #00ffcc;
    box-shadow: inset 0 0 5px rgba(0,255,204,0.5);
    position: relative;
    z-index: 2;
}

.surface-action {
    display: flex;
    align-items: center;
    gap: 8px;
    z-index: 2;
}

.surface-arrow {
    color: var(--color-orange);
    width: 18px;
    height: 18px;
    transition: transform 0.3s;
}

.surface-text {
    font-size: 0.9rem;
    font-weight: 600;
    white-space: nowrap;
    opacity: 0.9;
}

.back-to-surface:hover {
    background: rgba(12, 36, 68, 1);
    border-color: var(--color-orange);
    box-shadow: 0 6px 20px rgba(255, 138, 0, 0.3);
}

.back-to-surface:hover .surface-arrow {
    transform: translateY(-3px);
}

@media (max-width: 768px) {
    .back-to-surface {
        bottom: 20px;
        right: 20px;
        padding: 8px 12px 8px 8px;
    }
    .surface-text {
        display: none;
    }
}
''')

with open('app.js', 'a', encoding='utf-8') as f:
    f.write('''\n// Back to Surface Depth Gauge Logic
document.addEventListener('DOMContentLoaded', () => {
    const surfaceBtn = document.getElementById('back-to-surface');
    const depthNumber = document.getElementById('depth-number');
    const maxDepth = 40; // Max depth in meters
    
    if (surfaceBtn && depthNumber) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            
            // Show/hide logic
            if (scrollY > 400) {
                surfaceBtn.classList.remove('hidden');
                surfaceBtn.classList.add('visible');
            } else {
                surfaceBtn.classList.remove('visible');
                surfaceBtn.classList.add('hidden');
            }
            
            // Calculate fake depth based on scroll percentage
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = Math.min(Math.max(scrollY / scrollHeight, 0), 1);
            
            const currentDepth = Math.floor(scrollPercent * maxDepth);
            depthNumber.textContent = `-${currentDepth}m`;
        });
    }
});
''')

print('Appended CSS and JS successfully.')
