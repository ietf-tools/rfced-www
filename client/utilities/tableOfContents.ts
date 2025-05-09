import type { Toc as NuxtContentToc } from '@nuxt/content'
import type { InjectionKey } from 'vue'

type Section = {
  id: string
  title: string
  sections?: Section[]
}

export type RfcEditorToc = {
  title: string
  sections: Section[]
}

export const nuxtContentTocToRfcEditorToc = (
  nuxtContentToc: NuxtContentToc
): RfcEditorToc => {
  return {
    title: nuxtContentToc.title,
    sections: nuxtContentToc.links.map((link) => ({
      id: link.id,
      title: link.text,
      sections: link.children?.map((child) => ({
        id: child.id,
        title: child.text
      }))
    }))
  }
}

export const tocKey = Symbol() as InjectionKey<{
  showToc?: boolean
  toc?: RfcEditorToc
}>
