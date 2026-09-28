// Run after npm run build: node tests/i18n.mjs
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { stripTypeScriptTypes } from 'node:module'
import vm from 'node:vm'

const dictionarySource = stripTypeScriptTypes(readFileSync(new URL('../src/i18n/ui.ts', import.meta.url), 'utf8'))
const dictionaryUrl = `data:text/javascript;base64,${Buffer.from(dictionarySource).toString('base64')}`
const { ui } = await import(dictionaryUrl)
const utilsSource = stripTypeScriptTypes(readFileSync(new URL('../src/i18n/utils.ts', import.meta.url), 'utf8'))
  .replace("'./ui'", JSON.stringify(dictionaryUrl))
const { getLangFromUrl, useTranslations, useTranslatedPath } = await import(`data:text/javascript;base64,${Buffer.from(utilsSource).toString('base64')}`)

for (const [path, lang] of [['/', 'en'], ['/ja/', 'ja'], ['/ja/about/', 'ja'], ['/fr/', 'en'], ['/constructor/', 'en']]) {
  assert.equal(getLangFromUrl(new URL(path, 'https://example.com')), lang)
}
assert.equal(useTranslations('ja')('language'), '言語')
assert.equal(useTranslations('ja')('legendLanguage'), '', 'Empty translations do not fall back')
const original = ui.ja.tagline
try {
  delete ui.ja.tagline
  assert.equal(useTranslations('ja')('tagline'), ui.en.tagline, 'Missing translations fall back to English')
} finally { ui.ja.tagline = original }
assert.equal(useTranslatedPath('en')('/'), '/')
assert.equal(useTranslatedPath('ja')('/'), '/ja/')
assert.equal(useTranslatedPath('ja')('/about/', 'en'), '/about/')
assert.equal(useTranslatedPath('en')('/about/', 'ja'), '/ja/about/')

const english = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8')
const japanese = readFileSync(new URL('../dist/ja/index.html', import.meta.url), 'utf8')
const redirect = english.match(/<script id="language-redirect">([\s\S]*?)<\/script>/)[1]
assert.ok(!japanese.includes('id="language-redirect"'), 'Japanese pages never redirect back')

for (const [languages, saved, expected] of [
  [['ja-JP', 'en-US'], null, '/ja/?place=tokyo#map'],
  [['ja'], null, '/ja/?place=tokyo#map'],
  [['en-US', 'ja'], null, undefined],
  [['fr', 'ja-JP'], null, '/ja/?place=tokyo#map'],
  [['fr'], null, undefined],
  [['ja-JP'], 'en', undefined],
  [['en-US'], 'ja', '/ja/?place=tokyo#map'],
  [['ja-JP'], 'invalid', '/ja/?place=tokyo#map'],
  [undefined, null, '/ja/?place=tokyo#map'],
]) {
  let destination
  vm.runInNewContext(redirect, {
    navigator: { languages, language: 'ja-JP' },
    localStorage: { getItem: () => saved },
    window: { location: { search: '?place=tokyo', hash: '#map', replace: url => destination = url } },
  })
  assert.equal(destination, expected)
}

let destination
vm.runInNewContext(redirect, {
  navigator: { languages: ['ja-JP'] },
  localStorage: { getItem() { throw new Error('Storage blocked') } },
  window: { location: { search: '', hash: '', replace: url => destination = url } },
})
assert.equal(destination, '/ja/')

const picker = readFileSync(new URL('../src/components/LanguagePicker.astro', import.meta.url), 'utf8')
  .split('<script>')[1].split('</script>')[0]
for (const [lang, value] of [['en', '/'], ['ja', '/ja/']]) {
  let change, saved
  const select = { value, selectedOptions: [{ lang }], addEventListener: (_, fn) => change = fn }
  vm.runInNewContext(stripTypeScriptTypes(picker), {
    document: { querySelector: () => select },
    localStorage: { setItem: (key, language) => { assert.equal(key, 'bousai-language'); saved = language } },
    window: { location: { assign: url => destination = url } },
  })
  change()
  assert.equal(saved, lang)
  assert.equal(destination, value)
}
console.log('Passed: URL locales, translated paths, translation fallback, language detection, saved choices, storage fallback, query/hash preservation and dropdown navigation.')
