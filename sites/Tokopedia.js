const TOKOPEDIA = {
  parsePrice: (price_in_string) => Number(price_in_string.replace(/[^0-9]/g,"")),
  getItemPrice: 'document.querySelector(".price").innerText',
  getItemName: 'document.querySelector(".price").parentElement.previousElementSibling.previousSibling.innerText',
  isOutOfStock: 'document.querySelector(".price").parentElement.parentElement.parentElement.parentElement.innerText.includes("Stok habis")',
  isUnavailable: 'document.querySelector(".price").parentElement.parentElement.parentElement.parentElement.innerText.includes("Barang Tidak Tersedia")'
}

module.exports = TOKOPEDIA;