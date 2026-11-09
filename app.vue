<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Theme State
const isDark = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
  if (typeof document !== 'undefined') {
    if (isDark.value) {
      document.documentElement.setAttribute('data-theme', 'dark')
      localStorage.setItem('papyrus_theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
      localStorage.setItem('papyrus_theme', 'light')
    }
  }
}

// Mockup Interactive Tabs
const activeMockTab = ref<'home' | 'youtube' | 'settings'>('home')

const mockUrls: Record<string, string> = {
  home: 'papyrus://newtab',
  youtube: 'https://youtube.com/watch?v=papyrus_demo',
  settings: 'papyrus://settings'
}

const mockCounters: Record<string, string> = {
  home: 'Bộ lọc: 0',
  youtube: 'Bộ lọc: 18 (Đã bỏ qua QC)',
  settings: 'Bộ lọc: 2,410'
}

const setMockTab = (tab: 'home' | 'youtube' | 'settings') => {
  activeMockTab.value = tab
}

const openNewMockTab = () => {
  activeMockTab.value = 'home'
  showToast('Đã mở tab mới trong khung mô phỏng!')
}

// FAQ Accordion State
const openFaqIndex = ref<number | null>(0)

const toggleFaq = (index: number) => {
  openFaqIndex.value = openFaqIndex.value === index ? null : index
}

// Toast Notification State
const toastMessage = ref('')
const toastVisible = ref(false)
let toastTimer: ReturnType<typeof setTimeout> | null = null

const showToast = (msg: string) => {
  toastMessage.value = msg
  toastVisible.value = true
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastVisible.value = false
  }, 3000)
}

// Bless Modal State
const showBlessModal = ref(false)
const copiedStk = ref(false)

const copyStk = (stk: string) => {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(stk).then(() => {
      copiedStk.value = true
      showToast('Đã sao chép số tài khoản ACB 16601281!')
      setTimeout(() => { copiedStk.value = false }, 3000)
    }).catch(() => {
      showToast('STK ACB: ' + stk)
    })
  }
}

const copyChecksum = (val: string) => {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(val).then(() => {
      showToast('Đã sao chép mã SHA-256 vào clipboard!')
    }).catch(() => {
      showToast('Mã băm: ' + val)
    })
  }
}

onMounted(() => {
  const saved = localStorage.getItem('papyrus_theme')
  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true
    document.documentElement.setAttribute('data-theme', 'dark')
  } else {
    isDark.value = false
    document.documentElement.removeAttribute('data-theme')
  }
})
</script>

<template>
  <div class="papyrus-app" :class="{ 'theme-dark': isDark }">
    <!-- Navbar -->
    <header class="navbar">
      <div class="container nav-inner">
        <a href="#" class="brand">
          <svg class="brand-logo-svg" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="44" height="44" rx="10" fill="url(#prs_grad_nav)" stroke="#8C6941" stroke-width="2.5"/>
            <rect x="6" y="6" width="36" height="36" rx="7" stroke="#BAA07A" stroke-width="1.2" stroke-dasharray="2 1.5"/>
            <text x="24" y="29" font-family="'Playfair Display', serif" font-size="16" font-weight="bold" fill="#2C1708" text-anchor="middle">PRS</text>
            <defs>
              <linearGradient id="prs_grad_nav" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#FAF6ED"/>
                <stop offset="100%" stop-color="#E5D6BA"/>
              </linearGradient>
            </defs>
          </svg>
          <span class="brand-name">Papyrus</span>
        </a>

        <nav class="nav-links">
          <a href="#features">Tính năng cốt lõi</a>
          <a href="#architecture">Kiến trúc Rust</a>
          <a href="#comparison">So sánh</a>
          <a href="#download">Tải về</a>
          <a href="#faq">Câu hỏi thường gặp</a>
        </nav>

        <div class="nav-actions">
          <button class="theme-toggle" :title="isDark ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'" aria-label="Đổi giao diện" @click="toggleTheme">
            <svg v-if="isDark" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
            <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </button>
          <button class="btn btn-outline-bless btn-sm" @click="showBlessModal = true" title="Ban phước / Ủng hộ dự án">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            Ban phước
          </button>
          <a href="#download" class="btn btn-primary btn-sm">Tải Papyrus</a>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="hero">
      <div class="container">

        <h1>
          Trình duyệt web cho Windows.<br>
          <span class="gradient-text">Nhẹ như trang giấy, nhanh như chớp mắt.</span>
        </h1>

        <p class="lead">
          Tạm biệt sự nặng nề của trình duyệt truyền thống. Papyrus kết hợp vẻ đẹp tao nhã của phong cách giấy cói cổ điển với sức mạnh của ngôn ngữ Rust và nhân WebView2 tối ưu.
        </p>

        <div class="hero-cta">
          <a href="/Papyrus-v0.3.7-x64.msi" class="btn btn-primary" download>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Tải bản Cài đặt (MSI ~3.5MB)
          </a>
          <a href="/Papyrus.exe" class="btn btn-secondary" download>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
            Bản Portable (Chạy ngay ~4.4MB)
          </a>
        </div>

        <div class="hero-meta">
          <span><svg class="meta-check-icon" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-6"/></svg> Hỗ trợ Windows 10/11 x64</span>
          <span><svg class="meta-check-icon" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-6"/></svg> Đã tích hợp sẵn Adblock Brave</span>
          <span><svg class="meta-check-icon" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-6"/></svg> Không Telemetry theo dõi ngầm</span>
        </div>

        <!-- Live Browser Mockup -->
        <div class="preview-wrapper">
          <div class="browser-frame">
            <!-- Mockup Topbar -->
            <div class="mock-topbar">
              <div class="mock-brand">
                <svg width="16" height="16" viewBox="0 0 48 48" fill="none">
                  <rect x="2" y="2" width="44" height="44" rx="10" fill="#FAF6ED" stroke="#8C6941" stroke-width="3"/>
                  <text x="24" y="30" font-family="'Playfair Display', serif" font-size="16" font-weight="bold" fill="#2C1708" text-anchor="middle">PRS</text>
                </svg>
                <span>Papyrus</span>
              </div>

              <div class="mock-tabs">
                <div class="mock-tab" :class="{ active: activeMockTab === 'home' }" @click="setMockTab('home')">
                  <span>Trang mới</span>
                  <span class="mock-tab-close"><svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3.5" y1="3.5" x2="12.5" y2="12.5"/><line x1="12.5" y1="3.5" x2="3.5" y2="12.5"/></svg></span>
                </div>
                <div class="mock-tab" :class="{ active: activeMockTab === 'youtube' }" @click="setMockTab('youtube')">
                  <span>YouTube — Không QC</span>
                  <span class="mock-tab-close"><svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3.5" y1="3.5" x2="12.5" y2="12.5"/><line x1="12.5" y1="3.5" x2="3.5" y2="12.5"/></svg></span>
                </div>
                <div class="mock-tab" :class="{ active: activeMockTab === 'settings' }" @click="setMockTab('settings')">
                  <span>Cài đặt &amp; Bảo mật</span>
                  <span class="mock-tab-close"><svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3.5" y1="3.5" x2="12.5" y2="12.5"/><line x1="12.5" y1="3.5" x2="3.5" y2="12.5"/></svg></span>
                </div>
              </div>

              <!-- Fixed Plus Button hugging the tabs -->
              <button class="mock-plus" title="Mở tab mới (Ctrl+T)" @click="openNewMockTab"><svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="8" y1="3" x2="8" y2="13"/><line x1="3" y1="8" x2="13" y2="8"/></svg></button>
              <div class="mock-drag"></div>

              <div class="mock-window-btns">
                <button class="mock-win-btn" aria-label="Thu nhỏ">
                  <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="7.5" width="12" height="1.5" rx="0.5"/></svg>
                </button>
                <button class="mock-win-btn" aria-label="Phóng to">
                  <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="2.5" y="2.5" width="11" height="11" rx="1"/></svg>
                </button>
                <button class="mock-win-btn close" aria-label="Đóng">
                  <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="3.5" y1="3.5" x2="12.5" y2="12.5"/><line x1="12.5" y1="3.5" x2="3.5" y2="12.5"/></svg>
                </button>
              </div>
            </div>

            <!-- Mockup Toolbar -->
            <div class="mock-toolbar">
              <button class="mock-tool-btn" title="Trang trước">←</button>
              <button class="mock-tool-btn" title="Trang sau">→</button>
              <button class="mock-tool-btn" title="Tải lại">↻</button>
              <div class="mock-omnibox">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="opacity:0.6;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                <span class="mock-url-text">{{ mockUrls[activeMockTab] }}</span>
                <span class="mock-omnibox-badge">Riêng tư</span>
              </div>
              <button class="mock-shield-btn" title="Bộ chặn quảng cáo">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                <span>{{ mockCounters[activeMockTab] }}</span>
              </button>
            </div>

            <!-- Mockup Viewport -->
            <div class="mock-content-viewport">
              <!-- Content 1: Newtab -->
              <div v-show="activeMockTab === 'home'" class="mock-page-content active">
                <div class="newtab-center">
                  <h2>Chào mừng bạn đến với Papyrus</h2>
                  <p class="sub">Trình duyệt sạch sẽ, nhẹ nhàng, tốc độ tức thì không rác quảng cáo.</p>
                  <div class="newtab-search">
                    <input type="text" placeholder="Tìm kiếm với Google hoặc nhập URL..." readonly>
                    <button class="btn btn-primary">Mở</button>
                  </div>
                  <div class="newtab-features">
                    <div class="pill"><svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor"><path d="M9 1.5L2.5 9h5l-1 6 7-8h-5l1.5-5.5z"/></svg> Khởi động: ~0.15s</div>
                    <div class="pill"><svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 1.5l5.5 2v4.5c0 3.5-2.5 6.5-5.5 7.5-3-1-5.5-4-5.5-7.5V3.5L8 1.5z"/></svg> Tích hợp Adblock</div>
                    <div class="pill"><svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M13.5 2.5a6.5 6.5 0 0 0-9.2 0L2 4.8l2.2 2.2L11 3.5m-6.8 3.5l-1.7 1.7 2 2 1.7-1.7m-2 2l-2.2 4.5 4.5-2.2"/></svg> Bộ nhớ: &lt; 40MB</div>
                  </div>
                </div>
              </div>

              <!-- Content 2: YouTube Demo -->
              <div v-show="activeMockTab === 'youtube'" class="mock-page-content active">
                <div class="video-demo">
                  <div class="video-screen">
                    <div class="video-tag"><svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-6"/></svg> ĐÃ CHẶN QUẢNG CÁO &amp; FAST-SKIP</div>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
                    <p>Video chạy mượt mà ngay lập tức, không chờ 5s-15s quảng cáo!</p>
                  </div>
                  <h4>Tận hưởng trải nghiệm xem video không bị ngắt quãng</h4>
                  <p class="desc">Cơ chế Fast-Skip Native tự động tăng tốc và bỏ qua quảng cáo trong tích tắc mà không tiêu hao CPU.</p>
                </div>
              </div>

              <!-- Content 3: Settings -->
              <div v-show="activeMockTab === 'settings'" class="mock-page-content active">
                <div class="settings-demo">
                  <h3>Bảng điều khiển &amp; Bảo mật</h3>
                  <div class="settings-grid">
                    <div class="setting-card">
                      <div class="title">Chặn quảng cáo &amp; Trình theo dõi</div>
                      <p>Đang kích hoạt bộ lọc Brave/EasyList native với hơn 3,000 quy tắc cập nhật.</p>
                      <span class="status-active">● Đang bảo vệ</span>
                    </div>
                    <div class="setting-card">
                      <div class="title">Đặt làm Trình duyệt Mặc định</div>
                      <p>Đăng ký chuẩn Windows 10/11 Default App qua HKCU StartMenuInternet.</p>
                      <button class="btn btn-secondary btn-sm" style="margin-top:8px;">Đặt mặc định</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="stats-bar">
          <div class="stat-item">
            <h3>~4.4 MB</h3>
            <p>Dung lượng chạy Portable</p>
          </div>
          <div class="stat-item">
            <h3>&lt; 0.2s</h3>
            <p>Tốc độ mở cửa sổ tức thì</p>
          </div>
          <div class="stat-item">
            <h3>100% Rust</h3>
            <p>An toàn bộ nhớ, không rò rỉ RAM</p>
          </div>
          <div class="stat-item">
            <h3>270/270</h3>
            <p>Kiểm thử tự động nghiêm ngặt</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="section" id="features">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Tiêu chí thiết kế đỉnh cao</span>
          <h2 class="section-title">Trình duyệt được tinh giản đến từng dòng lệnh</h2>
          <p class="section-desc">Không cồng kềnh, không dư thừa. Mỗi tính năng trên Papyrus đều sinh ra để phục vụ trải nghiệm duyệt web thuần khiết nhất.</p>
        </div>

        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </div>
            <h3>Bộ chặn quảng cáo Native</h3>
            <p>Tích hợp bộ lọc quy tắc của Brave &amp; EasyList biên dịch trực tiếp sang engine Rust. Chặn đứng trình đào tiền ảo, pop-up phiền toái và bộ đếm theo dõi của bên thứ ba.</p>
            <span class="badge">Brave Engine + Fast-Skip</span>
          </div>

          <div class="feature-card">
            <div class="feature-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
            </div>
            <h3>Windows 11 Snap Layouts</h3>
            <p>Tương thích hoàn hảo với hệ điều hành Windows 11. Đưa chuột lên nút Phóng to để hiển thị Snap Flyout trực quan: chia đôi màn hình, 3 cột hoặc 4 góc làm việc dễ dàng.</p>
            <span class="badge">Win32 Native API</span>
          </div>

          <div class="feature-card">
            <div class="feature-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
            <h3>Quản lý Tab toàn diện</h3>
            <p>Đính ghim tab quan trọng, tắt tiếng từng tab khi phát nhạc, nhân bản tab đang xem, và khôi phục tab vừa vô tình đóng nhanh chóng bằng phím tắt <kbd>Ctrl+Shift+T</kbd>.</p>
            <span class="badge">Menu ngữ cảnh 10 lệnh</span>
          </div>

          <div class="feature-card">
            <div class="feature-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            </div>
            <h3>Mở trực tiếp File cục bộ</h3>
            <p>Kéo và thả bất kỳ tệp PDF, SVG, hình ảnh (PNG, WebP), tệp văn bản hoặc mã nguồn vào thanh địa chỉ để xem tức thì qua giao thức <code>file:///</code> với hiệu năng mượt mà.</p>
            <span class="badge">Xem PDF, Markdown &amp; SVG</span>
          </div>

          <div class="feature-card">
            <div class="feature-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>
            </div>
            <h3>Két mật khẩu Offline an toàn</h3>
            <p>Lưu trữ thông tin tài khoản hoàn toàn trên thiết bị của bạn với mã hóa an toàn. Không phụ thuộc đám mây, không lo rò rỉ dữ liệu máy chủ hay bị quét dữ liệu trái phép.</p>
            <span class="badge">Zero Cloud Telemetry</span>
          </div>

          <div class="feature-card">
            <div class="feature-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            </div>
            <h3>Khôi phục phiên duyệt tự động</h3>
            <p>Nếu máy tính đột ngột mất điện hoặc tắt máy không đúng cách, Papyrus sẽ tự động phát hiện cờ báo và hỗ trợ người dùng phục hồi nguyên vẹn các tab làm việc trước đó.</p>
            <span class="badge">Crash Recovery Isolation</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Architecture Section -->
    <section class="section arch-section" id="architecture">
      <div class="container">
        <div class="arch-grid">
          <div>
            <span class="section-tag">Kiến trúc hệ thống</span>
            <h2 class="section-title">Sức mạnh từ Rust &amp; Win32 API nguyên bản</h2>
            <p class="section-desc">
              Khác với hầu hết trình duyệt hiện nay được đóng gói kèm Chromium cồng kềnh hàng trăm megabyte, Papyrus sử dụng thư viện <code>windows-rs</code> và <code>tao/wry</code> để kết nối trực tiếp với nhân WebView2 có sẵn trên Windows.
            </p>
            <ul class="arch-checklist">
              <li><svg class="arch-check-icon" width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="#2E7D32" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-6"/></svg> <span><strong>Không bộ nạp Electron/Node.js:</strong> Khởi chạy tức thời, không lãng phí tài nguyên máy tính.</span></li>
              <li><svg class="arch-check-icon" width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="#2E7D32" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-6"/></svg> <span><strong>COM Handling &amp; Per-Monitor DPI v2:</strong> Đảm bảo văn bản luôn sắc nét ngay cả khi bạn cắm laptop vào màn hình 4K.</span></li>
              <li><svg class="arch-check-icon" width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="#2E7D32" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-6"/></svg> <span><strong>Chế độ tối DWM Immersive Dark:</strong> Khung cửa sổ tự động đồng bộ màu theo cài đặt giao diện của Windows.</span></li>
              <li><svg class="arch-check-icon" width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="#2E7D32" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-6"/></svg> <span><strong>Đóng gói Installer MSI thông minh:</strong> Tự động kiểm tra Evergreen Runtime và thiết lập sẵn sàng chỉ trong 3 giây.</span></li>
            </ul>
          </div>

          <div class="code-box">
            <div class="cmt">// Tối ưu hóa bộ nhớ và điều hướng an toàn trong Papyrus Core</div>
            <span class="kw">impl</span> Browser {<br>
            &nbsp;&nbsp;<span class="kw">pub fn</span> <span class="fn">new_tab</span>(&amp;<span class="kw">mut self</span>, url: &amp;<span class="kw">str</span>, active: <span class="kw">bool</span>) -&gt; Result&lt;u64, String&gt; {<br>
            &nbsp;&nbsp;&nbsp;&nbsp;<span class="kw">let</span> id = <span class="kw">self</span>.next_tab_id();<br>
            &nbsp;&nbsp;&nbsp;&nbsp;<span class="cmt">// WebView2 COM Controller gắn trực tiếp vào Win32 HWND</span><br>
            &nbsp;&nbsp;&nbsp;&nbsp;<span class="kw">let</span> view = <span class="kw">self</span>.create_isolated_view(id)?;<br>
            &nbsp;&nbsp;&nbsp;&nbsp;<span class="cmt">// Gắn bộ lọc chặn quảng cáo Brave Native</span><br>
            &nbsp;&nbsp;&nbsp;&nbsp;native::attach_filter(&amp;view, <span class="kw">self</span>.preferences.clone())?;<br>
            &nbsp;&nbsp;&nbsp;&nbsp;<span class="kw">self</span>.tabs.push(Tab::new(id, url, view));<br>
            &nbsp;&nbsp;&nbsp;&nbsp;<span class="kw">self</span>.layout()?;&nbsp;&nbsp;<span class="cmt">// Căn chỉnh tọa độ pixel chính xác</span><br>
            &nbsp;&nbsp;&nbsp;&nbsp;Ok(id)<br>
            &nbsp;&nbsp;}<br>
            }
          </div>
        </div>
      </div>
    </section>

    <!-- Comparison Section -->
    <section class="section" id="comparison">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Bảng đối chiếu thông số</span>
          <h2 class="section-title">Papyrus so với các trình duyệt thông thường</h2>
          <p class="section-desc">Cùng so sánh các yếu tố cốt lõi về độ tiêu hao tài nguyên và tính riêng tư của bạn.</p>
        </div>

        <div class="comparison-wrapper">
          <table class="comp-table">
            <thead>
              <tr>
                <th>Tiêu chí so sánh</th>
                <th class="highlight">Papyrus Browser</th>
                <th>Google Chrome</th>
                <th>Microsoft Edge</th>
                <th>Brave Browser</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Dung lượng bộ cài đặt</td>
                <td class="highlight"><span class="comp-check">~3.5 MB (MSI)</span></td>
                <td>~90 MB</td>
                <td>~120 MB</td>
                <td>~110 MB</td>
              </tr>
              <tr>
                <td>Bản Portable chạy ngay</td>
                <td class="highlight"><span class="comp-check">Có (~4.4MB EXE)</span></td>
                <td><span class="comp-cross">Không chính thức</span></td>
                <td><span class="comp-cross">Không có</span></td>
                <td><span class="comp-cross">Cồng kềnh</span></td>
              </tr>
              <tr>
                <td>Ngôn ngữ lõi quản trị</td>
                <td class="highlight"><span class="comp-check">100% Rust &amp; Win32</span></td>
                <td>C++ / Chromium</td>
                <td>C++ / Chromium</td>
                <td>C++ / Chromium</td>
              </tr>
              <tr>
                <td>Chặn quảng cáo tích hợp sẵn</td>
                <td class="highlight"><span class="comp-check"><svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-6"/></svg> Native Engine</span></td>
                <td><span class="comp-cross"><svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="3.5" y1="3.5" x2="12.5" y2="12.5"/><line x1="12.5" y1="3.5" x2="3.5" y2="12.5"/></svg> Không (chặn extension)</span></td>
                <td><span class="comp-cross"><svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="3.5" y1="3.5" x2="12.5" y2="12.5"/><line x1="12.5" y1="3.5" x2="3.5" y2="12.5"/></svg> Giới hạn</span></td>
                <td><span class="comp-check"><svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-6"/></svg> Có</span></td>
              </tr>
              <tr>
                <td>Hỗ trợ Snap Layouts native Win11</td>
                <td class="highlight"><span class="comp-check"><svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-6"/></svg> Tích hợp sẵn</span></td>
                <td><span class="comp-check"><svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-6"/></svg> Có</span></td>
                <td><span class="comp-check"><svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-6"/></svg> Có</span></td>
                <td><span class="comp-check"><svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-6"/></svg> Có</span></td>
              </tr>
              <tr>
                <td>Thu thập dữ liệu Telemetry</td>
                <td class="highlight"><span class="comp-check"><svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-6"/></svg> Tuyệt đối không</span></td>
                <td>Nhiều</td>
                <td>Nhiều</td>
                <td>Ít</td>
              </tr>
              <tr>
                <td>Bộ nhớ RAM tiêu hao khi khởi động</td>
                <td class="highlight"><span class="comp-check">&lt; 40 MB</span></td>
                <td>~200 MB+</td>
                <td>~250 MB+</td>
                <td>~180 MB+</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- Download Hub -->
    <section class="download-section" id="download">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Trung tâm tải về</span>
          <h2 class="section-title">Trải nghiệm Papyrus ngay hôm nay</h2>
          <p class="section-desc">Miễn phí hoàn toàn, mã nguồn mở, không virus, không phần mềm quảng cáo đi kèm.</p>
        </div>

        <div class="download-cards">
          <!-- MSI Installer -->
          <div class="download-card featured">
            <div class="featured-ribbon">Khuyên dùng</div>
            <h3>Bộ cài đặt Windows</h3>
            <p class="card-desc">Gói cài đặt MSI tiêu chuẩn, tự động cài runtime, tạo shortcut Start Menu &amp; Desktop.</p>
            <ul class="download-meta-list">
              <li><span>Định dạng:</span> <span>Windows Installer (.msi)</span></li>
              <li><span>Dung lượng:</span> <span>3.54 MB</span></li>
              <li><span>Phiên bản:</span> <span>v0.3.7 (x64)</span></li>
              <li><span>Hỗ trợ:</span> <span>Windows 10 / 11</span></li>
            </ul>
            <a href="/Papyrus-v0.3.7-x64.msi" class="btn btn-primary" download>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Tải Papyrus Installer (.msi)
            </a>
          </div>

          <!-- Portable Standalone -->
          <div class="download-card">
            <h3>Bản Portable Xách tay</h3>
            <p class="card-desc">Một tệp thực thi duy nhất. Chạy ngay lập tức không cần quyền Admin, thích hợp bỏ USB.</p>
            <ul class="download-meta-list">
              <li><span>Định dạng:</span> <span>Thực thi (.exe)</span></li>
              <li><span>Dung lượng:</span> <span>4.26 MB</span></li>
              <li><span>Phiên bản:</span> <span>v0.3.7 (x64)</span></li>
              <li><span>Cài đặt:</span> <span>Không cần cài đặt</span></li>
            </ul>
            <a href="/Papyrus.exe" class="btn btn-secondary" download>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Tải Papyrus.exe (Portable)
            </a>
          </div>

          <!-- ZIP Archive -->
          <div class="download-card">
            <h3>Gói Nén Đầy đủ</h3>
            <p class="card-desc">Gói nén ZIP bao gồm tệp thực thi, bộ icon chất lượng cao và tài liệu hướng dẫn.</p>
            <ul class="download-meta-list">
              <li><span>Định dạng:</span> <span>Lưu trữ (.zip)</span></li>
              <li><span>Dung lượng:</span> <span>1.70 MB</span></li>
              <li><span>Bao gồm:</span> <span>Binary + Assets</span></li>
              <li><span>Kiểm tra:</span> <span>Kèm SHA256</span></li>
            </ul>
            <a href="/Papyrus-v0.3.7-windows-x64.zip" class="btn btn-secondary" download>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Tải Gói ZIP (.zip)
            </a>
          </div>
        </div>

        <!-- Checksums Box -->
        <div class="checksums-box">
          <div class="checksums-header">
            <h4>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              Mã băm xác thực tính toàn vẹn (SHA-256 Checksums)
            </h4>
            <span class="checksum-hint">Xác minh tệp chính chủ của nhà phát hành</span>
          </div>

          <div class="checksum-row">
            <span><strong>Papyrus.exe:</strong> CAE7BBF62DDBE091F64C3EBD9937104B43E04949FC655E865D636BF5058ED04A</span>
            <button class="checksum-copy-btn" @click="copyChecksum('CAE7BBF62DDBE091F64C3EBD9937104B43E04949FC655E865D636BF5058ED04A')">Sao chép</button>
          </div>

          <div class="checksum-row">
            <span><strong>Papyrus-v0.3.7-x64.msi:</strong> EC6901381F9DE23D1E5BE6702D3436B4D21D2BD357BFAA51015186DB69E253F9</span>
            <button class="checksum-copy-btn" @click="copyChecksum('EC6901381F9DE23D1E5BE6702D3436B4D21D2BD357BFAA51015186DB69E253F9')">Sao chép</button>
          </div>

          <div class="checksum-row">
            <span><strong>Papyrus-v0.3.7-windows-x64.zip:</strong> E0770CC3787DE2C5C8A45355DAB0213906515692D8A24949EE98DD0648B1A18E</span>
            <button class="checksum-copy-btn" @click="copyChecksum('E0770CC3787DE2C5C8A45355DAB0213906515692D8A24949EE98DD0648B1A18E')">Sao chép</button>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="section" id="faq">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Giải đáp thắc mắc</span>
          <h2 class="section-title">Câu hỏi thường gặp</h2>
          <p class="section-desc">Những điều bạn cần biết trước khi sử dụng Papyrus.</p>
        </div>

        <div class="faq-list">
          <div class="faq-item" :class="{ open: openFaqIndex === 0 }">
            <div class="faq-question" @click="toggleFaq(0)">
              <span>1. Máy tính của tôi cần điều kiện gì để chạy được Papyrus?</span>
              <span class="faq-chevron"><svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6l4 4 4-4"/></svg></span>
            </div>
            <div class="faq-answer">
              Papyrus yêu cầu hệ điều hành Windows 10 (bản 1809 trở lên) hoặc Windows 11 kiến trúc 64-bit. Ngoài ra, máy tính cần có Microsoft Edge WebView2 Evergreen Runtime (đã được cài sẵn trên hầu hết các máy Windows 10/11 hiện nay). Nếu bạn dùng gói cài đặt MSI, trình cài đặt sẽ tự động kiểm tra và hướng dẫn cài đặt nếu máy bạn chưa có.
            </div>
          </div>

          <div class="faq-item" :class="{ open: openFaqIndex === 1 }">
            <div class="faq-question" @click="toggleFaq(1)">
              <span>2. Papyrus có lưu trữ hoặc gửi lịch sử duyệt web của tôi lên mạng không?</span>
              <span class="faq-chevron"><svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6l4 4 4-4"/></svg></span>
            </div>
            <div class="faq-answer">
              Tuyệt đối không! Papyrus hoạt động theo tôn chỉ bảo mật không đám mây (Zero-Cloud). Mọi dữ liệu về mật khẩu, dấu trang, lịch sử duyệt web và cấu hình cá nhân đều được lưu cục bộ trên ổ cứng máy tính của bạn tại thư mục hồ sơ riêng biệt. Không có bất kỳ telemetry hay mã thu thập dữ liệu ngầm nào được nhúng vào ứng dụng.
            </div>
          </div>

          <div class="faq-item" :class="{ open: openFaqIndex === 2 }">
            <div class="faq-question" @click="toggleFaq(2)">
              <span>3. Làm thế nào để đặt Papyrus làm trình duyệt mặc định trên Windows?</span>
              <span class="faq-chevron"><svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6l4 4 4-4"/></svg></span>
            </div>
            <div class="faq-answer">
              Rất đơn giản! Trong giao diện Papyrus, bạn hãy bấm vào nút ba chấm (Cài đặt) &gt; chọn mục <strong>Chung &amp; Khởi động</strong> &gt; nhấn nút <strong>"Đặt làm mặc định"</strong>. Papyrus sẽ tự động đăng ký giao thức hệ thống trong Windows Registry (HKCU StartMenuInternet) và mở trang Windows Default Apps để bạn xác nhận chỉ với 1 cú click.
            </div>
          </div>

          <div class="faq-item" :class="{ open: openFaqIndex === 3 }">
            <div class="faq-question" @click="toggleFaq(3)">
              <span>4. Tôi có thể cài các tiện ích mở rộng (Extensions) như uBlock Origin hay Dark Reader không?</span>
              <span class="faq-chevron"><svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6l4 4 4-4"/></svg></span>
            </div>
            <div class="faq-answer">
              Papyrus đã tích hợp sẵn bộ lọc quy tắc chặn quảng cáo của Brave và EasyList trực tiếp vào lõi xử lý, đồng thời hỗ trợ chế độ nền giấy dịu mắt và chế độ tối (Dark Mode). Trong trang Cài đặt &gt; Tiện ích, Papyrus cung cấp liên kết truy cập nhanh đến Chrome Web Store và Edge Add-ons để bạn tham khảo các tiện ích hữu ích.
            </div>
          </div>

          <div class="faq-item" :class="{ open: openFaqIndex === 4 }">
            <div class="faq-question" @click="toggleFaq(4)">
              <span>5. Papyrus có khôi phục lại các trang khi máy tính bị sập nguồn không?</span>
              <span class="faq-chevron"><svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6l4 4 4-4"/></svg></span>
            </div>
            <div class="faq-answer">
              Có! Papyrus duy trì một cơ chế ghi nhận cờ phiên an toàn. Nếu trình duyệt bị đóng bất thường (do mất điện, tắt nóng hoặc lỗi hệ thống), ở lần khởi động kế tiếp, Papyrus sẽ tự động kích hoạt tính năng khôi phục toàn bộ các địa chỉ trang web đang mở để bạn tiếp tục công việc dở dang.
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-col">
            <div class="brand" style="margin-bottom:14px;">
              <svg class="brand-logo-svg" viewBox="0 0 48 48" fill="none">
                <rect x="2" y="2" width="44" height="44" rx="10" fill="url(#prs_grad_footer)" stroke="#8C6941" stroke-width="2.5"/>
                <text x="24" y="29" font-family="'Playfair Display', serif" font-size="16" font-weight="bold" fill="#2C1708" text-anchor="middle">PRS</text>
                <defs>
                  <linearGradient id="prs_grad_footer" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#FAF6ED"/>
                    <stop offset="100%" stop-color="#E5D6BA"/>
                  </linearGradient>
                </defs>
              </svg>
              <span class="brand-name">Papyrus Browser</span>
            </div>
            <p class="footer-text">
              Dự án trình duyệt web thuần Rust &amp; Win32 Native thế hệ mới. Đem lại sự thanh thoát, tốc độ và quyền riêng tư trọn vẹn cho người dùng Windows.
            </p>
          </div>

          <div class="footer-col">
            <h5>Liên kết nhanh</h5>
            <ul>
              <li><a href="#features">Tính năng chính</a></li>
              <li><a href="#architecture">Kiến trúc Rust</a></li>
              <li><a href="#comparison">Bảng so sánh</a></li>
              <li><a href="#download">Tải bộ cài đặt</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h5>Tài nguyên</h5>
            <ul>
              <li><a href="/SHA256SUMS.txt" target="_blank">Mã SHA-256</a></li>
              <li><a href="https://developer.microsoft.com/microsoft-edge/webview2/" target="_blank" rel="noopener">WebView2 Runtime</a></li>
              <li><a href="#faq">Hỏi đáp (FAQ)</a></li>
              <li><a href="#" @click.prevent="showBlessModal = true">Ban phước / Ủng hộ</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h5>Bảo mật &amp; Pháp lý</h5>
            <ul>
              <li><a href="#features">Chính sách Offline</a></li>
              <li><a href="#features">Zero-Telemetry</a></li>
              <li><a href="#features">Giấy phép mã nguồn</a></li>
              <li><a href="#download">Phiên bản: 0.3.7</a></li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <div>© 2026 Papyrus Project. Bản quyền thuộc về đội ngũ phát triển Papyrus.</div>
          <div>Phát triển với tinh thần Tối giản, Bảo mật &amp; Thuần khiết.</div>
        </div>
      </div>
    </footer>

    <!-- Popup Ban Phước -->
    <transition name="modal-fade">
      <div v-show="showBlessModal" class="modal-backdrop" @click.self="showBlessModal = false" role="dialog" aria-modal="true" aria-labelledby="bless-title">
        <div class="bless-modal">
          <button class="modal-close-btn" @click="showBlessModal = false" aria-label="Đóng">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>

          <div class="bless-modal-header">
            <div class="bless-icon-wrapper">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </div>
            <h3 id="bless-title">Ban Phước & Đồng Hành Cùng Papyrus</h3>
            <p class="bless-subtitle">Sự khích lệ và đồng hành của bạn giúp dự án duy trì độc lập, bảo mật và phát triển hoàn toàn miễn phí cho cộng đồng.</p>
          </div>

          <div class="bless-qr-card">
            <div class="qr-img-box">
              <img
                src="https://img.vietqr.io/image/ACB-16601281-compact2.png?amount=0&addInfo=Ban%20phuoc%20Papyrus&accountName=ACB%2016601281"
                alt="Mã VietQR ACB STK 16601281"
                class="vietqr-img"
                loading="lazy"
              />
            </div>
            <div class="qr-details">
              <div class="detail-item">
                <span class="detail-label">Ngân hàng:</span>
                <span class="detail-value">ACB (Ngân hàng TMCP Á Châu)</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Số tài khoản:</span>
                <span class="detail-value highlight-stk">16601281</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Nội dung chuyển:</span>
                <span class="detail-value">Ban phuoc Papyrus</span>
              </div>
              <button class="btn btn-primary btn-copy-stk" @click="copyStk('16601281')">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                {{ copiedStk ? 'Đã sao chép STK!' : 'Sao chép STK: 16601281' }}
              </button>
            </div>
          </div>

          <div class="bless-modal-footer">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            <span>Mọi sự ủng hộ đều được trân trọng để duy trì máy chủ &amp; phát triển phiên bản mới.</span>
          </div>
        </div>
      </div>
    </transition>

    <!-- Toast Notification -->
    <div class="toast" :class="{ show: toastVisible }">
      {{ toastMessage }}
    </div>
  </div>
</template>

<style>
/* Reset & Tokens */
:root {
  --bg: #FAF6ED;
  --paper: #FFFFFF;
  --card-bg: #F5EFE0;
  --card-hover: #EFE4D0;
  --text: #2C1708;
  --text-muted: #6E5C49;
  --text-dim: #968370;
  --border: #D8CCA8;
  --border-light: #E8DDC2;
  --accent: #8C6941;
  --accent-hover: #735331;
  --accent-glow: rgba(140, 105, 65, 0.2);
  --accent-badge: #EADBC5;
  --shadow-sm: 0 2px 8px rgba(44, 23, 8, 0.05);
  --shadow-md: 0 8px 24px rgba(44, 23, 8, 0.08);
  --shadow-lg: 0 16px 40px rgba(44, 23, 8, 0.12);
  --code-bg: #221D18;
  --code-text: #EFE4D0;
  --tag-green: #2E7D32;
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --font-serif: 'Playfair Display', Georgia, Cambria, serif;
  --font-sans: 'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  --transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

[data-theme="dark"] {
  --bg: #131518;
  --paper: #1B1E23;
  --card-bg: #22262D;
  --card-hover: #292E36;
  --text: #F3EFE6;
  --text-muted: #A39B8E;
  --text-dim: #736C61;
  --border: #363C46;
  --border-light: #2A303A;
  --accent: #C29D70;
  --accent-hover: #D5B48D;
  --accent-glow: rgba(194, 157, 112, 0.25);
  --accent-badge: #352B20;
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.25);
  --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 16px 40px rgba(0, 0, 0, 0.55);
  --code-bg: #0D0F12;
  --code-text: #E8DEC8;
  --tag-green: #81C784;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  background-color: var(--bg);
  color: var(--text);
  font-family: var(--font-sans);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  transition: background-color 0.3s ease, color 0.3s ease;
  overflow-x: hidden;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Navbar */
.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(250, 246, 237, 0.88);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-light);
  transition: var(--transition);
}
[data-theme="dark"] .navbar {
  background: rgba(19, 21, 24, 0.88);
  border-bottom-color: var(--border);
}
.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
}
.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: var(--text);
}
.brand-logo-svg {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
}
.brand-name {
  font-family: var(--font-serif);
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.5px;
}
.brand-version {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  padding: 2px 7px;
  background: var(--accent-badge);
  color: var(--accent);
  border-radius: 12px;
  letter-spacing: 0.5px;
}
.nav-links {
  display: flex;
  align-items: center;
  gap: 28px;
}
.nav-links a {
  text-decoration: none;
  color: var(--text-muted);
  font-size: 14.5px;
  font-weight: 500;
  transition: var(--transition);
}
.nav-links a:hover {
  color: var(--accent);
}
.nav-actions {
  display: flex;
  align-items: center;
  gap: 14px;
}
.theme-toggle {
  background: var(--card-bg);
  border: 1px solid var(--border);
  color: var(--text);
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
}
.theme-toggle:hover {
  background: var(--card-hover);
  transform: rotate(15deg);
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 22px;
  font-size: 14.5px;
  font-weight: 600;
  border-radius: var(--radius-sm);
  text-decoration: none;
  cursor: pointer;
  transition: var(--transition);
  border: none;
}
.btn-primary {
  background: var(--accent);
  color: #FFFFFF;
  box-shadow: 0 4px 14px var(--accent-glow);
}
.btn-primary:hover {
  background: var(--accent-hover);
  box-shadow: 0 6px 20px var(--accent-glow);
  transform: translateY(-1px);
}
.btn-secondary {
  background: var(--paper);
  color: var(--text);
  border: 1px solid var(--border);
}
.btn-secondary:hover {
  background: var(--card-bg);
  border-color: var(--accent);
  transform: translateY(-1px);
}
.btn-sm {
  padding: 7px 15px;
  font-size: 13px;
}

/* Hero */
.hero {
  padding: 75px 0 55px;
  text-align: center;
}
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  color: var(--accent);
  margin-bottom: 24px;
  box-shadow: var(--shadow-sm);
}
.hero-badge svg {
  width: 16px;
  height: 16px;
}
.hero h1 {
  font-family: var(--font-serif);
  font-size: 52px;
  line-height: 1.18;
  font-weight: 800;
  letter-spacing: -0.5px;
  margin-bottom: 20px;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}
.gradient-text {
  background: linear-gradient(135deg, var(--accent) 0%, #B85D19 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.hero p.lead {
  font-size: 19px;
  color: var(--text-muted);
  max-width: 740px;
  margin: 0 auto 36px;
  font-weight: 400;
  line-height: 1.6;
}
.hero-cta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}
.hero-cta .btn {
  padding: 14px 28px;
  font-size: 16px;
  border-radius: 8px;
}
.hero-meta {
  font-size: 13px;
  color: var(--text-dim);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 50px;
}

/* Browser Mockup */
.preview-wrapper {
  max-width: 1040px;
  margin: 0 auto;
}
.browser-frame {
  background: var(--paper);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: var(--shadow-lg), 0 0 0 1px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  text-align: left;
}
.mock-topbar {
  display: flex;
  align-items: flex-end;
  height: 42px;
  gap: 6px;
  background: var(--card-bg);
  padding: 4px 8px 0;
  border-bottom: 1px solid var(--border);
  user-select: none;
}
.mock-brand {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: bold;
  font-size: 12px;
  color: var(--text);
  padding: 0 6px 8px 4px;
}
.mock-tabs {
  display: flex;
  gap: 3px;
  flex: 0 1 auto;
  max-width: calc(100% - 240px);
}
.mock-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  height: 34px;
  background: transparent;
  border-radius: 8px 8px 0 0;
  font-size: 12px;
  color: var(--text-muted);
  cursor: pointer;
  transition: var(--transition);
  white-space: nowrap;
}
.mock-tab:hover {
  background: rgba(0,0,0,0.04);
  color: var(--text);
}
.mock-tab.active {
  background: var(--paper);
  color: var(--text);
  font-weight: 600;
  box-shadow: 0 -1px 3px rgba(0,0,0,0.06);
}
.mock-tab-close {
  opacity: 0.6;
  border-radius: 50%;
  padding: 2px;
}
.mock-tab-close:hover {
  opacity: 1;
  background: rgba(0,0,0,0.1);
}
.mock-plus {
  width: 28px;
  height: 28px;
  margin-bottom: 3px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--text);
  cursor: pointer;
  opacity: 0.8;
  transition: var(--transition);
}
.mock-plus:hover {
  background: rgba(0,0,0,0.08);
  opacity: 1;
}
.mock-drag {
  flex: 1;
  height: 38px;
}
.mock-window-btns {
  display: flex;
  gap: 0;
  margin-top: -4px;
  margin-right: -8px;
}
.mock-win-btn {
  width: 44px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--text);
}
.mock-win-btn.close:hover {
  background: #E81123;
  color: #FFFFFF;
}

.mock-toolbar {
  height: 44px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  background: var(--paper);
  border-bottom: 1px solid var(--border-light);
}
.mock-tool-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 4px;
  color: var(--text-muted);
  cursor: pointer;
}
.mock-tool-btn:hover {
  background: var(--card-bg);
  color: var(--text);
}
.mock-omnibox {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 30px;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 15px;
  padding: 0 12px;
  font-size: 13px;
  color: var(--text);
}
.mock-url-text {
  flex: 1;
  font-family: monospace;
  font-size: 12.5px;
}
.mock-omnibox-badge {
  font-size: 11px;
  color: var(--accent);
  font-weight: 600;
  background: var(--accent-badge);
  padding: 1px 6px;
  border-radius: 10px;
}
.mock-shield-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: var(--accent-badge);
  color: var(--accent);
  border: none;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}
.mock-content-viewport {
  height: 420px;
  background: var(--paper);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.mock-page-content {
  padding: 36px;
  flex: 1;
  overflow-y: auto;
}

/* Mockup Content Styling */
.newtab-center {
  text-align: center;
  padding: 24px 16px;
}
.newtab-center h2 {
  font-family: var(--font-serif);
  font-size: 26px;
  margin-bottom: 8px;
}
.newtab-center p.sub {
  color: var(--text-muted);
  font-size: 14px;
  margin-bottom: 24px;
}
.newtab-search {
  max-width: 480px;
  margin: 0 auto;
  display: flex;
  gap: 8px;
}
.newtab-search input {
  flex: 1;
  height: 40px;
  padding: 0 16px;
  border-radius: 20px;
  border: 1px solid var(--border);
  background: var(--card-bg);
  color: var(--text);
  outline: none;
}
.newtab-features {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 36px;
  flex-wrap: wrap;
}
.newtab-features .pill {
  background: var(--card-bg);
  padding: 10px 18px;
  border-radius: 8px;
  border: 1px solid var(--border);
  font-size: 13px;
  font-weight: 600;
}

.video-demo {
  padding: 8px;
}
.video-screen {
  background: #000;
  border-radius: 8px;
  height: 240px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  position: relative;
}
.video-tag {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(46, 125, 50, 0.9);
  color: #fff;
  font-size: 12px;
  font-weight: bold;
  padding: 4px 10px;
  border-radius: 4px;
}
.video-screen p {
  margin-top: 12px;
  font-size: 14px;
  opacity: 0.85;
}
.video-demo h4 {
  margin-top: 16px;
  font-size: 16px;
}
.video-demo p.desc {
  color: var(--text-muted);
  font-size: 13.5px;
  margin-top: 4px;
}

.settings-demo h3 {
  font-family: var(--font-serif);
  font-size: 20px;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--border);
  padding-bottom: 8px;
}
.settings-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.setting-card {
  background: var(--card-bg);
  padding: 16px;
  border-radius: 8px;
  border: 1px solid var(--border);
}
.setting-card .title {
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 4px;
}
.setting-card p {
  font-size: 12.5px;
  color: var(--text-muted);
}
.status-active {
  display: inline-block;
  margin-top: 8px;
  color: var(--tag-green);
  font-size: 12px;
  font-weight: bold;
}

/* Stats */
.stats-bar {
  margin-top: 65px;
  background: var(--paper);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 30px;
  box-shadow: var(--shadow-sm);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  text-align: center;
}
.stat-item h3 {
  font-family: var(--font-serif);
  font-size: 38px;
  font-weight: 800;
  color: var(--accent);
  margin-bottom: 4px;
}
.stat-item p {
  font-size: 14px;
  color: var(--text-muted);
  font-weight: 500;
}

/* Sections */
.section {
  padding: 90px 0;
}
.section-header {
  text-align: center;
  max-width: 720px;
  margin: 0 auto 60px;
}
.section-tag {
  font-size: 12.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--accent);
  margin-bottom: 12px;
  display: block;
}
.section-title {
  font-family: var(--font-serif);
  font-size: 38px;
  line-height: 1.25;
  font-weight: 700;
  margin-bottom: 16px;
}
.section-desc {
  font-size: 17px;
  color: var(--text-muted);
}

/* Features Grid */
.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.feature-card {
  background: var(--paper);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 32px 28px;
  transition: var(--transition);
}
.feature-card:hover {
  border-color: var(--accent);
  box-shadow: var(--shadow-md);
  transform: translateY(-3px);
}
.feature-icon-wrapper {
  width: 48px;
  height: 48px;
  background: var(--card-bg);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent);
  margin-bottom: 20px;
}
.feature-card h3 {
  font-size: 19px;
  font-weight: 700;
  margin-bottom: 10px;
  color: var(--text);
}
.feature-card p {
  font-size: 14.5px;
  color: var(--text-muted);
  line-height: 1.6;
}
.feature-card .badge {
  display: inline-block;
  margin-top: 16px;
  font-size: 11.5px;
  font-weight: 600;
  padding: 3px 10px;
  background: var(--card-bg);
  border-radius: 6px;
  color: var(--accent);
}

/* Architecture */
.arch-section {
  background: var(--paper);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}
.arch-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 36px;
  align-items: center;
}
.arch-checklist {
  list-style: none;
  font-size: 14.5px;
  color: var(--text-muted);
  line-height: 1.8;
  margin-top: 16px;
}
.code-box {
  background: var(--code-bg);
  color: var(--code-text);
  border-radius: var(--radius-md);
  padding: 24px;
  font-family: Consolas, "Courier New", monospace;
  font-size: 13.5px;
  line-height: 1.65;
  overflow-x: auto;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: var(--shadow-md);
}
.code-box .kw { color: #E5C07B; }
.code-box .cmt { color: #5C6370; font-style: italic; }
.code-box .fn { color: #61AFEF; }

/* Comparison Table */
.comparison-wrapper {
  background: var(--paper);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow-x: auto;
  box-shadow: var(--shadow-sm);
}
.comp-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 14.5px;
}
.comp-table th, .comp-table td {
  padding: 16px 22px;
  border-bottom: 1px solid var(--border-light);
}
.comp-table th {
  background: var(--card-bg);
  font-weight: 700;
  color: var(--text);
}
.comp-table th.highlight, .comp-table td.highlight {
  background: rgba(140, 105, 65, 0.05);
  font-weight: 600;
  color: var(--accent);
  border-left: 1px solid var(--border);
  border-right: 1px solid var(--border);
}
.comp-check {
  color: var(--tag-green);
  font-weight: bold;
}
.comp-cross {
  color: #D32F2F;
  font-weight: bold;
}

/* Download Hub */
.download-section {
  background: var(--card-bg);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  padding: 90px 0;
}
.download-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 48px;
}
.download-card {
  background: var(--paper);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 36px 28px;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: var(--transition);
  box-shadow: var(--shadow-sm);
}
.download-card.featured {
  border: 2px solid var(--accent);
  box-shadow: var(--shadow-md);
  transform: scale(1.02);
}
.featured-ribbon {
  position: absolute;
  top: -12px;
  right: 24px;
  background: var(--accent);
  color: #FFFFFF;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 3px 12px;
  border-radius: 12px;
  letter-spacing: 0.5px;
}
.download-card h3 {
  font-family: var(--font-serif);
  font-size: 24px;
  margin-bottom: 8px;
}
.download-card p.card-desc {
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 24px;
  min-height: 42px;
}
.download-meta-list {
  list-style: none;
  margin-bottom: 28px;
  font-size: 13.5px;
  color: var(--text-muted);
}
.download-meta-list li {
  padding: 6px 0;
  border-bottom: 1px dashed var(--border-light);
  display: flex;
  justify-content: space-between;
}
.download-meta-list li span:last-child {
  font-weight: 600;
  color: var(--text);
}
.download-card .btn {
  margin-top: auto;
  width: 100%;
}

/* Checksums Box */
.checksums-box {
  background: var(--paper);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 24px 28px;
}
.checksums-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}
.checksums-header h4 {
  font-size: 15px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
}
.checksum-hint {
  font-size: 12px;
  color: var(--text-dim);
}
.checksum-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: var(--card-bg);
  border: 1px solid var(--border-light);
  padding: 10px 16px;
  border-radius: var(--radius-sm);
  margin-bottom: 8px;
  font-family: monospace;
  font-size: 12.5px;
  word-break: break-all;
}
.checksum-copy-btn {
  background: transparent;
  border: none;
  color: var(--accent);
  cursor: pointer;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 4px;
  transition: var(--transition);
  white-space: nowrap;
}
.checksum-copy-btn:hover {
  background: var(--accent-glow);
}

/* FAQ */
.faq-list {
  max-width: 820px;
  margin: 0 auto;
}
.faq-item {
  background: var(--paper);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  margin-bottom: 14px;
  overflow: hidden;
  transition: var(--transition);
}
.faq-question {
  padding: 18px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
}
.faq-question:hover {
  color: var(--accent);
}
.faq-chevron {
  transition: transform 0.25s ease;
}
.faq-item.open .faq-chevron {
  transform: rotate(180deg);
}
.faq-answer {
  padding: 0 24px 20px;
  font-size: 14.5px;
  color: var(--text-muted);
  line-height: 1.65;
}

/* Footer */
.footer {
  background: var(--paper);
  border-top: 1px solid var(--border);
  padding: 60px 0 30px;
  font-size: 14px;
  color: var(--text-muted);
}
.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 36px;
  margin-bottom: 40px;
}
.footer-text {
  font-size: 13.5px;
  color: var(--text-muted);
  max-width: 320px;
  line-height: 1.6;
}
.footer-col h5 {
  color: var(--text);
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 16px;
}
.footer-col ul {
  list-style: none;
}
.footer-col ul li {
  margin-bottom: 10px;
}
.footer-col ul a {
  color: var(--text-muted);
  text-decoration: none;
  transition: var(--transition);
}
.footer-col ul a:hover {
  color: var(--accent);
}
.footer-bottom {
  border-top: 1px solid var(--border-light);
  padding-top: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  color: var(--text-dim);
}

/* Toast */
.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: var(--code-bg);
  color: var(--code-text);
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 13.5px;
  font-weight: 500;
  box-shadow: var(--shadow-lg);
  z-index: 9999;
  opacity: 0;
  transform: translateY(12px);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;
}
.toast.show {
  opacity: 1;
  transform: translateY(0);
}

/* Responsive */
@media (max-width: 992px) {
  .hero h1 { font-size: 42px; }
  .features-grid, .download-cards { grid-template-columns: repeat(2, 1fr); }
  .stats-bar { grid-template-columns: repeat(2, 1fr); gap: 24px; }
  .arch-grid { grid-template-columns: 1fr; }
  .footer-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 768px) {
  .hero h1 { font-size: 34px; }
  .nav-links { display: none; }
  .features-grid, .download-cards { grid-template-columns: 1fr; }
  .download-card.featured { transform: none; }
  .mock-tabs { max-width: calc(100% - 140px); }
  .footer-grid { grid-template-columns: 1fr; }
  .footer-bottom { flex-direction: column; gap: 12px; text-align: center; }
}

.meta-check-icon {
  color: #2E7D32;
  flex-shrink: 0;
  vertical-align: middle;
}

.arch-check-icon {
  color: #2E7D32;
  flex-shrink: 0;
  margin-top: 3px;
}

.arch-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.pill svg {
  display: inline-block;
  vertical-align: -2px;
  margin-right: 5px;
}

.video-tag svg {
  display: inline-block;
  vertical-align: -1px;
  margin-right: 4px;
}

.comp-check svg, .comp-cross svg {
  display: inline-block;
  vertical-align: -1px;
  margin-right: 4px;
}

.faq-chevron {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.25s ease;
  color: var(--accent);
}

.faq-item.open .faq-chevron {
  transform: rotate(180deg);
}


/* Bless Modal & Button Styles */
.btn-outline-bless {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  color: var(--accent);
  border: 1.5px solid var(--accent);
  padding: 6px 14px;
  border-radius: var(--radius-sm);
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-outline-bless:hover {
  background: var(--accent);
  color: #fff;
  transform: translateY(-1px);
}
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(4px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.bless-modal {
  position: relative;
  background: var(--paper);
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  max-width: 520px;
  width: 100%;
  padding: 32px 28px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
  box-sizing: border-box;
}
.modal-close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.modal-close-btn:hover {
  background: var(--border-light);
  color: var(--text);
}
.bless-modal-header {
  text-align: center;
  margin-bottom: 24px;
}
.bless-icon-wrapper {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: rgba(140, 105, 65, 0.12);
  color: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
}
.bless-modal-header h3 {
  font-family: var(--font-serif);
  font-size: 22px;
  color: var(--text);
  margin-bottom: 8px;
}
.bless-subtitle {
  font-size: 13.5px;
  line-height: 1.5;
  color: var(--text-muted);
  margin: 0 auto;
  max-width: 440px;
}
.bless-qr-card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 20px;
  display: flex;
  gap: 20px;
  align-items: center;
  margin-bottom: 20px;
}
.qr-img-box {
  flex-shrink: 0;
  width: 140px;
  height: 140px;
  background: #fff;
  border-radius: 8px;
  padding: 6px;
  border: 1px solid var(--border-light);
  display: flex;
  align-items: center;
  justify-content: center;
}
.vietqr-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.qr-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.detail-item {
  display: flex;
  flex-direction: column;
  font-size: 13px;
}
.detail-label {
  color: var(--text-muted);
  font-size: 12px;
}
.detail-value {
  color: var(--text);
  font-weight: 500;
}
.detail-value.highlight-stk {
  font-family: var(--font-mono);
  font-size: 18px;
  font-weight: 700;
  color: var(--accent);
  letter-spacing: 0.5px;
}
.btn-copy-stk {
  margin-top: 6px;
  padding: 8px 14px;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-radius: var(--radius-sm);
}
.bless-modal-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.4;
  border-top: 1px dashed var(--border-light);
  padding-top: 14px;
}
.bless-modal-footer svg {
  flex-shrink: 0;
  color: var(--accent);
}
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.25s ease;
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}
@media (max-width: 600px) {
  .bless-qr-card {
    flex-direction: column;
    text-align: center;
  }
  .qr-img-box {
    margin: 0 auto;
    width: 150px;
    height: 150px;
  }
  .btn-copy-stk {
    width: 100%;
  }
}
</style>
