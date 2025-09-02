export function formatPrice(num: number) {
  return num.toLocaleString('uk-UA') + ' ₴'
}

export default formatPrice
