import { defineConfig } from 'histoire'
import { HstVue } from '@histoire/plugin-vue'
import { HstNuxt } from '@histoire/plugin-nuxt'

export default defineConfig({
  plugins: [HstVue(), HstNuxt()],
  vite: {
    plugins: [
      {
        // Workaround for https://github.com/histoire-dev/histoire/issues/779#issuecomment-2636808805
        // TODO: after Historie upgrade see if this plugin is still necessary
        name: 'layer-histoire-styles',
        apply: () => true,
        transform: (src, id) => {
          if (id.endsWith('app/dist/style.css')) {
            return {
              code: `@layer components {${src}}`,
              map: null
            }
          }
        }
      }
    ]
  }
})
