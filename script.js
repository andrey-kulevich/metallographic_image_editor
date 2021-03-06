var canvas = document.getElementById("cv")
var ctx = canvas.getContext("2d")
var files = []
var images = []
var img = new Image()

$('#upload').click(() => {
    $('#file-input').trigger('click')
})

$('#file-input').change((event) => {
    files.push(event.target.files)
    let reader = new FileReader()
    reader.readAsDataURL(event.target.files[0])
    reader.onload = (e) => {
        if (e.target.readyState == FileReader.DONE) {
            img.src = e.target.result
            img.onload = () => ctx.drawImage(img, 0, 0)
        }
    }
})


