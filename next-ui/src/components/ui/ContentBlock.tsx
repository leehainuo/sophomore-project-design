import { codeToHtml } from 'shiki'
import type { BundledLanguage } from 'shiki'

const CodeBlock = async ({ children, className }: { children: string, className?: string }) => {
  // 从 className 中提取语言 (format: language-xxx)
  const lang = className?.replace('language-', '') as BundledLanguage || 'text'

  try {
    const html = await codeToHtml(children, {
      lang,
      theme: 'one-dark-pro'
    })
    return <div dangerouslySetInnerHTML={{ __html: html }} />
  } catch (e) {
    console.log(e)
    return <code>{children}</code>
  }
}

export default CodeBlock