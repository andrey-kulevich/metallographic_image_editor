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

$('#save').click((e) => {
    e.target.setAttribute('download', 'img.jpg')
    e.target.setAttribute('href', canvas.toDataURL("image/jpg").replace("image/jpg", "image/octet-stream"))
})

function drawScaleText(text) {
    $('canvas').drawText({
        layer: true,
        fillStyle: '#000',
        x: canvas.width - 90, y: canvas.height - 50,
        fontSize: 40,
        fontFamily: 'Times New Roman',
        text: text
    }).drawLine({
        layer: true,
        strokeStyle: '#000',
        strokeWidth: 10,
        x1: canvas.width - 90, y1: canvas.height - 50
    });
}

$('a[name=x20scale]').click(() => { drawScaleText('1 мкм') })
$('a[name=x50scale]').click(() => { drawScaleText('2 мкм') })
$('a[name=x100scale]').click(() => { drawScaleText('3 мкм') })
$('a[name=x200scale]').click(() => { drawScaleText('4 мкм') })


