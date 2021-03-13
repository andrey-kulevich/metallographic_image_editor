import { Editor, Scale } from './model.js'

var canvas = document.getElementById('cv')
var editor = new Editor('cv')

$('#upload').click(() => { $('#file-input').trigger('click') })
$('#file-input').change((event) => { 
    editor.loadPhotos(event.target.files) 
})
$('a[name=x50scale]').click(() => { editor.drawScaleLabel(Scale.Type.RU.x50) })
$('a[name=x100scale]').click(() => { editor.drawScaleLabel(Scale.Type.RU.x100) })
$('a[name=x200scale]').click(() => { editor.drawScaleLabel(Scale.Type.RU.x200) })
$('a[name=x500scale]').click(() => { editor.drawScaleLabel(Scale.Type.RU.x500) })
$('a[name=x1000scale]').click(() => { editor.drawScaleLabel(Scale.Type.RU.x1000) })

$('#save').click((e) => {
    e.target.setAttribute('download', 'img.jpg')
    e.target.setAttribute('href', canvas.toDataURL("image/jpg").replace("image/jpg", "image/octet-stream"))
})