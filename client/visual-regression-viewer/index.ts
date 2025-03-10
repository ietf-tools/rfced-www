const id = 'ietf-images-diff'
const ietfImagesDiffScript = document.getElementById(id)
if (!ietfImagesDiffScript) {
  throw Error(`Unable to find ${id}`)
}
type ImagesDiff = {
  differences: string[]
  dataUrls: Record<string, string>
}
const ietfImagesDiff: ImagesDiff = JSON.parse(
  ietfImagesDiffScript.textContent ?? ''
)

function getImage(
  mode: 'baseline' | 'current' | 'difference',
  filename: string
) {
  const img = document.createElement('img')
  img.src = ietfImagesDiff.dataUrls[`${mode}/${filename}`]
  return img
}

const p = document.createElement('p')
p.innerText = 'Click on screenshots to see the regressions.'
document.body.append(p)

const list = document.createElement('ul')
document.body.append(list)

ietfImagesDiff.differences.forEach((difference) => {
  const listItem = document.createElement('li')
  const listLink = document.createElement('a')
  listLink.setAttribute('href', `#${difference}`)
  listLink.textContent = difference
  listItem.append(listLink)
  list.append(listItem)
  const button = document.createElement('button')
  button.id = difference
  const h2 = document.createElement('h2')
  h2.textContent = difference
  document.body.append(h2)

  const modeSpan = document.createElement('span')
  modeSpan.setAttribute('aria-live', 'polite')
  modeSpan.setAttribute('aria-atomic', 'true')

  const baselineImg = getImage('baseline', difference)
  const currentImg = getImage('current', difference)
  const differenceImg = getImage('difference', difference)

  let mode = 0
  function updateMode() {
    const mod = mode % 3
    switch (mod) {
      case 0:
        modeSpan.textContent = 'baseline'
        baselineImg.style.display = 'block'
        currentImg.style.display = 'none'
        differenceImg.style.display = 'none'
        break
      case 1:
        modeSpan.textContent = 'current'
        baselineImg.style.display = 'none'
        currentImg.style.display = 'block'
        differenceImg.style.display = 'none'
        break
      case 2:
        modeSpan.textContent = 'diff'
        baselineImg.style.display = 'none'
        currentImg.style.display = 'none'
        differenceImg.style.display = 'block'
        break
    }
  }
  button.append(modeSpan)
  button.addEventListener('click', () => {
    mode++
    updateMode()
  })
  updateMode()
  const div = document.createElement('div')
  div.style.display = 'flex'
  button.appendChild(div)
  div.appendChild(baselineImg)
  div.appendChild(currentImg)
  div.appendChild(differenceImg)
  document.body.append(button)
})
