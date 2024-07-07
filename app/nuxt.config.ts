// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "nuxt-icon",
    '@nuxt/test-utils/module',
    "@sidebase/nuxt-auth",
    "@formkit/nuxt",
    "@vueuse/nuxt",
    "@jcsj/daisyui-nuxt",
    "nuxt-typed-router",
    "dayjs-nuxt",
  ],
  devServer: {
    port: 3000,
  },
  auth: {
    // Forces the user to be logged in before they can see any page, unless opted out
    globalAppMiddleware: true
  },
  vue: {
    propsDestructure: true,
  },
  formkit: {
    configFile: 'formkit.config.ts',
  },
  tailwindcss: {
    config: {
      content: [
        'formkit.theme.ts'
      ]
    }
  },
  nitro: {
    esbuild: {
        options: {
          // Need TOP LEVEL AWAIT
          target: "ES2022",
          minify: false,
          legalComments: "none",
        },
    },
    preset: "vercel"
  },
  devtools: { enabled: false },
})
