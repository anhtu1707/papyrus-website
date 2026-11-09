// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  ssr: true,
  app: {
    head: {
      htmlAttrs: {
        lang: 'vi'
      },
      title: 'Papyrus Browser — Trình duyệt web siêu nhẹ thuần Rust & Win32 Native',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Papyrus Browser — Trình duyệt Windows 10/11 siêu nhẹ, tốc độ cao, 100% Rust & Win32 Native, tích hợp bộ chặn quảng cáo Brave/EasyList và Snap Layouts.'
        },
        { name: 'theme-color', content: '#FAF6ED' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&display=swap'
        }
      ]
    }
  }
})
