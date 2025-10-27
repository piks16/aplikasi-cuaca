console.log("Client side javascript file diproses")

const weatherForm = document.querySelector('form')
const search = document.querySelector('input')
const pesanSatu = document.querySelector('#pesan-1')
const pesanDua = document.querySelector('#pesan-2')

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault()
    
    const location = search.value

    pesanSatu.textContent = 'Sedang mencari lokasi...'
    pesanDua.textContent = ''

    fetch('/infocuaca?address=' + location).then((response) => {
        response.json().then((data) => {
            if (data.error) {
                pesanSatu.textContent = data.error
                pesanDua.textContent = ''
            } else {
                pesanSatu.textContent = data.lokasi
                pesanDua.textContent = data.prediksiCuaca
            }
        })
    })
})