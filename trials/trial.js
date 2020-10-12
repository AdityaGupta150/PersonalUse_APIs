// const axios = document.createElement('script')
// axios.setAttribute('src', 'https://unpkg.com/axios/dist/axios.min.js')

axios('http://localhost:3000/ps/getAll').then( (res) => {
    console.log(res);
})
