import { Editor, Scale } from './model.js'

var canvas = document.getElementById('cv')
var editor = new Editor('cv')

$('#upload').click(() => { $('#file-input').trigger('click') })
$('#file-input').change((event) => { 
    editor.loadPhotos(event.target.files) 
})

var isEnglish = false

$('a[name=scaleLang]').click(() => { 
    isEnglish = !isEnglish 
    if (isEnglish) $('a[name=scaleLang]').css('background-color', '#edeff3')
    else $('a[name=scaleLang]').css('background-color', '#fff')
})

$('a[name=scaleColor]').click(() => { 
    if (editor.scale.color === Scale.Color.BLACK) {
        editor.scale.color = Scale.Color.WHITE
        $('a[name=scaleColor]').css('background-color', '#edeff3')
    } else {
        editor.scale.color = Scale.Color.BLACK
        $('a[name=scaleColor]').css('background-color', '#fff')
    }
})

$('a[name=x50scale]').click(() => { isEnglish ? editor.drawScaleLabel(Scale.Type.EN.x50) : editor.drawScaleLabel(Scale.Type.RU.x50) })
$('a[name=x100scale]').click(() => { isEnglish ? editor.drawScaleLabel(Scale.Type.EN.x100) : editor.drawScaleLabel(Scale.Type.RU.x100) })
$('a[name=x200scale]').click(() => { isEnglish ? editor.drawScaleLabel(Scale.Type.EN.x200) : editor.drawScaleLabel(Scale.Type.RU.x200) })
$('a[name=x500scale]').click(() => { isEnglish ? editor.drawScaleLabel(Scale.Type.EN.x500) : editor.drawScaleLabel(Scale.Type.RU.x500) })
$('a[name=x1000scale]').click(() => { isEnglish ? editor.drawScaleLabel(Scale.Type.EN.x1000) : editor.drawScaleLabel(Scale.Type.RU.x1000) })

$('#save').click((e) => {
    e.target.setAttribute('download', 'img.jpg')
    e.target.setAttribute('href', canvas.toDataURL("image/jpg").replace("image/jpg", "image/octet-stream"))
})