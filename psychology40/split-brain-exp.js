// 裂脑实验交互组件
const SplitBrainExp = {
  items: [
    { id: 'key', name: '钥匙', icon: '🔑', side: null },
    { id: 'hammer', name: '锤子', icon: '🔨', side: null },
    { id: 'apple', name: '苹果', icon: '🍎', side: null },
    { id: 'book', name: '书本', icon: '📖', side: null }
  ],
  
  state: {
    leftZone: null,
    rightZone: null,
    feedback: ''
  },

  init(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="split-brain-exp bg-slate-50 border rounded-xl p-6 select-none relative overflow-hidden" style="min-height: 500px;">
        <div class="text-center mb-6">
          <h3 class="text-lg font-bold text-slate-700">裂脑人实验演示</h3>
          <p class="text-sm text-slate-500">将物品拖放到左/右视野，点击“被试”查看反应</p>
        </div>

        <!-- 实验台场景 -->
        <div class="relative mx-auto" style="width: 100%; max-width: 600px; height: 400px;">
          
          <!-- 桌面区域 -->
          <div class="absolute top-0 left-0 w-full h-48 bg-[#e2e8f0] rounded-lg border-b-4 border-slate-300 flex">
            <!-- 左视野区域 (Left Visual Field -> Right Hemisphere) -->
            <div id="drop-left" class="w-1/2 h-full border-r-2 border-slate-400 border-dashed flex items-center justify-center bg-blue-50/30 transition-colors" data-side="left">
              <span class="text-slate-400 text-sm font-medium pointer-events-none">左视野 (LVF)</span>
            </div>
            <!-- 右视野区域 (Right Visual Field -> Left Hemisphere) -->
            <div id="drop-right" class="w-1/2 h-full flex items-center justify-center bg-green-50/30 transition-colors" data-side="right">
              <span class="text-slate-400 text-sm font-medium pointer-events-none">右视野 (RVF)</span>
            </div>
          </div>

          <!-- 隔板 (Visual Barrier) -->
          <div class="absolute left-1/2 top-[-20px] bottom-[140px] w-2 bg-slate-800 transform -translate-x-1/2 z-10 shadow-xl"></div>

          <!-- 被试 (Subject) -->
          <div id="subject-head" class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-32 cursor-pointer group z-20">
            <!-- 头部SVG -->
            <svg viewBox="0 0 100 100" class="w-full h-full drop-shadow-lg transition-transform group-hover:scale-105">
              <circle cx="50" cy="50" r="45" fill="#f8fafc" stroke="#334155" stroke-width="3"/>
              <!-- 左脑 (Left Hemisphere - Language) -->
              <path d="M50 5 A 45 45 0 0 1 50 95" fill="#dcfce7" opacity="0.5"/>
              <text x="70" y="40" font-size="8" fill="#15803d" text-anchor="middle">左脑</text>
              <text x="70" y="50" font-size="6" fill="#15803d" text-anchor="middle">(语言)</text>
              
              <!-- 右脑 (Right Hemisphere - Spatial) -->
              <path d="M50 5 A 45 45 0 0 0 50 95" fill="#dbeafe" opacity="0.5"/>
              <text x="30" y="40" font-size="8" fill="#1d4ed8" text-anchor="middle">右脑</text>
              <text x="30" y="50" font-size="6" fill="#1d4ed8" text-anchor="middle">(空间)</text>
              
              <!-- 胼胝体 (切断) -->
              <line x1="50" y1="15" x2="50" y2="85" stroke="#ef4444" stroke-width="2" stroke-dasharray="4 2"/>
              
              <!-- 眼睛 -->
              <ellipse cx="35" cy="25" rx="5" ry="3" fill="#334155"/>
              <ellipse cx="65" cy="25" rx="5" ry="3" fill="#334155"/>
            </svg>
          </div>
            
          <!-- 气泡反馈 (Moved out of subject-head to prevent click bubbling issues) -->
          <div id="feedback-bubble" class="absolute bottom-[130px] left-1/2 transform -translate-x-1/2 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-lg w-48 text-center text-sm font-medium text-slate-700 opacity-0 transition-opacity duration-300 z-40 pointer-events-auto">
            <div id="feedback-content"></div>
            <div class="absolute bottom-[-6px] left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white border-b border-r border-slate-200 rotate-45"></div>
          </div>

          <!-- 物品栏 -->
          <div id="palette-zone" class="absolute bottom-4 w-full flex justify-center gap-4 z-30 min-h-[60px] items-center rounded-lg transition-colors border-2 border-transparent">
            ${this.items.map(item => `
              <div class="draggable-item w-12 h-12 bg-white border border-slate-200 rounded-lg shadow-sm flex items-center justify-center text-2xl cursor-grab active:cursor-grabbing hover:scale-110 transition-transform z-50 select-none touch-none" 
                   draggable="true" 
                   style="touch-action: none;"
                   data-id="${item.id}">
                ${item.icon}
              </div>
            `).join('')}
          </div>

        </div>

        <div class="flex justify-end mt-4">
          <button id="reset-btn" class="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded text-xs transition-colors">重置实验</button>
        </div>
      </div>
    `;

    this.attachEvents();
  },

  processDrop(itemEl, zone) {
    if (!itemEl || !zone) return;
    
    zone.appendChild(itemEl);
    const itemId = itemEl.dataset.id;
    const draggedItem = this.items.find(i => i.id === itemId);
    const subject = document.getElementById('subject-head');
    const bubble = document.getElementById('feedback-bubble');
    const isPalette = zone.id === 'palette-zone';

    if (isPalette) {
      if (this.state.leftZone?.id === itemId) this.state.leftZone = null;
      if (this.state.rightZone?.id === itemId) this.state.rightZone = null;
      bubble.style.opacity = '0';
    } else {
      // Clear previous state for this item if it moved from another zone
      if (this.state.leftZone?.id === itemId) this.state.leftZone = null;
      if (this.state.rightZone?.id === itemId) this.state.rightZone = null;

      if (zone.id === 'drop-left') {
        this.state.leftZone = draggedItem;
      } else {
        this.state.rightZone = draggedItem;
      }
      this.showFeedback(subject, bubble, zone.id === 'drop-left' ? 'left' : 'right');
    }
  },

  attachEvents() {
    const draggables = document.querySelectorAll('.draggable-item');
    const leftZone = document.getElementById('drop-left');
    const rightZone = document.getElementById('drop-right');
    const paletteZone = document.getElementById('palette-zone');
    const subject = document.getElementById('subject-head');
    const bubble = document.getElementById('feedback-bubble');
    const resetBtn = document.getElementById('reset-btn');

    let draggedItem = null;

    // --- Mouse / HTML5 Drag & Drop ---
    draggables.forEach(item => {
      item.addEventListener('dragstart', (e) => {
        draggedItem = this.items.find(i => i.id === item.dataset.id);
        e.dataTransfer.setData('text/plain', item.dataset.id);
        requestAnimationFrame(() => item.classList.add('opacity-50', 'scale-90'));
      });

      item.addEventListener('dragend', (e) => {
        e.target.classList.remove('opacity-50', 'scale-90');
      });
    });

    const zones = [leftZone, rightZone, paletteZone];
    
    zones.forEach(zone => {
      zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (zone === paletteZone) zone.classList.add('border-slate-300', 'bg-slate-100/50');
        else zone.classList.add(zone.id === 'drop-left' ? 'bg-blue-100' : 'bg-green-100');
      });

      zone.addEventListener('dragleave', (e) => {
        if (zone === paletteZone) zone.classList.remove('border-slate-300', 'bg-slate-100/50');
        else zone.classList.remove('bg-blue-100', 'bg-green-100');
      });

      zone.addEventListener('drop', (e) => {
        e.preventDefault();
        // Cleanup styles
        if (zone === paletteZone) zone.classList.remove('border-slate-300', 'bg-slate-100/50');
        else zone.classList.remove('bg-blue-100', 'bg-green-100');

        const itemId = e.dataTransfer.getData('text/plain');
        const itemEl = document.querySelector(`.draggable-item[data-id="${itemId}"]`);
        this.processDrop(itemEl, zone);
      });
    });

    // --- Touch Events for Mobile ---
    draggables.forEach(item => {
      item.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Prevent scroll
        const touch = e.touches[0];
        draggedItem = this.items.find(i => i.id === item.dataset.id);
        
        // Visual feedback
        item.classList.add('opacity-50', 'scale-90');
        
        // Clone for dragging
        const clone = item.cloneNode(true);
        clone.id = 'drag-proxy';
        clone.style.position = 'fixed';
        clone.style.zIndex = '9999';
        clone.style.pointerEvents = 'none';
        clone.style.left = (touch.clientX - item.offsetWidth/2) + 'px';
        clone.style.top = (touch.clientY - item.offsetHeight/2) + 'px';
        clone.style.width = item.offsetWidth + 'px';
        clone.style.height = item.offsetHeight + 'px';
        clone.style.opacity = '0.8';
        document.body.appendChild(clone);
      }, { passive: false });

      item.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const clone = document.getElementById('drag-proxy');
        if(clone) {
          clone.style.left = (touch.clientX - clone.offsetWidth/2) + 'px';
          clone.style.top = (touch.clientY - clone.offsetHeight/2) + 'px';
        }
        
        // Highlight zones
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        const zone = target?.closest('#drop-left, #drop-right, #palette-zone');
        
        zones.forEach(z => {
           if (z === zone) {
              if (z === paletteZone) z.classList.add('border-slate-300', 'bg-slate-100/50');
              else z.classList.add(z.id === 'drop-left' ? 'bg-blue-100' : 'bg-green-100');
           } else {
              if (z === paletteZone) z.classList.remove('border-slate-300', 'bg-slate-100/50');
              else z.classList.remove('bg-blue-100', 'bg-green-100');
           }
        });
      }, { passive: false });

      item.addEventListener('touchend', (e) => {
        const clone = document.getElementById('drag-proxy');
        if(clone) clone.remove();
        item.classList.remove('opacity-50', 'scale-90');
        
        // Cleanup zone highlights
        zones.forEach(z => {
           if (z === paletteZone) z.classList.remove('border-slate-300', 'bg-slate-100/50');
           else z.classList.remove('bg-blue-100', 'bg-green-100');
        });

        const touch = e.changedTouches[0];
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        const zone = target?.closest('#drop-left, #drop-right, #palette-zone');
        
        if (zone) {
          this.processDrop(item, zone);
        }
      });
    });

    // Click Subject
    subject.addEventListener('click', () => {
      // Determine which item to report on. Priority to Right Zone (Verbal)
      if (this.state.rightZone && rightZone.contains(document.querySelector(`[data-id="${this.state.rightZone.id}"]`))) {
         this.showFeedback(subject, bubble, 'right');
      } else if (this.state.leftZone && leftZone.contains(document.querySelector(`[data-id="${this.state.leftZone.id}"]`))) {
         this.showFeedback(subject, bubble, 'left');
      } else {
         const content = document.getElementById('feedback-content');
         if (content) content.innerHTML = "请将物品拖入视野区域";
         bubble.style.opacity = '1';
         setTimeout(() => bubble.style.opacity = '0', 2000);
      }
    });

    // Reset
    resetBtn.addEventListener('click', () => {
      draggables.forEach(item => paletteZone.appendChild(item));
      this.state.leftZone = null;
      this.state.rightZone = null;
      bubble.style.opacity = '0';
      const content = document.getElementById('feedback-content');
      if (content) content.innerHTML = '';
      
      // Reset any active classes
      leftZone.classList.remove('bg-blue-50', 'border-blue-400');
      rightZone.classList.remove('bg-green-50', 'border-green-400');
    });
  },

  showFeedback(subject, bubble, activeSide) {
    // Phase 1: Visual Report (Verbal)
    let visualText = "";
    let item = null;
    
    if (activeSide === 'right') {
      // Right VF -> Left Hemi -> Speaking
      item = this.state.rightZone;
      visualText = `我看见了 <span class="text-blue-600 font-bold">${item.name}</span>`;
    } else {
      // Left VF -> Right Hemi -> Silent
      item = this.state.leftZone;
      visualText = "我...什么也没看见";
    }

    // Show Visual Report
    const content = document.getElementById('feedback-content');
    if (content) {
      content.innerHTML = `
        <div class="mb-2">${visualText}</div>
        <button id="grab-btn" class="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded-full hover:bg-blue-700 transition-colors shadow-sm animate-pulse cursor-pointer select-none" style="pointer-events: auto;">
          抓取
        </button>
      `;
    }
    
    bubble.style.opacity = '1';
    
    // Animate head
    const svg = subject.querySelector('svg');
    svg.style.transform = 'scale(1.05)';
    setTimeout(() => svg.style.transform = 'scale(1)', 200);

    // Bind Grab Button Event
    // Use timeout to ensure DOM is ready
    setTimeout(() => {
      const grabBtn = document.getElementById('grab-btn');
      if (grabBtn) {
        // Remove old listeners if any (by replacing element or just overwriting onclick)
        grabBtn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation(); // Prevent bubbling
          this.showGrabFeedback(subject, bubble, activeSide, item);
        };
        // Add touchstart for better mobile response
        grabBtn.ontouchstart = (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.showGrabFeedback(subject, bubble, activeSide, item);
        };
      }
    }, 50);
  },

  showGrabFeedback(subject, bubble, activeSide, item) {
    let grabText = "";
    
    if (activeSide === 'right') {
      // Right Hand (Left Hemi)
      grabText = `(右手成功抓起了 <span class="text-blue-600 font-bold">${item.name}</span>)`;
    } else {
      // Left Hand (Right Hemi)
      grabText = `(左手成功抓起了 <span class="text-green-600 font-bold">${item.name}</span>)`;
    }

    // Update Bubble content with animation
    const content = document.getElementById('feedback-content');
    if (content) {
      content.innerHTML = `
        <div class="mb-2 text-slate-400 text-xs line-through opacity-70">抓取</div>
        <div class="font-bold text-slate-800 animate-bounce">${grabText}</div>
      `;
    }

    // Hide after delay
    setTimeout(() => {
      bubble.style.opacity = '0';
    }, 4000);
  }
};

// Auto-init if container exists
if (document.getElementById('split-brain-container')) {
  SplitBrainExp.init('split-brain-container');
}
