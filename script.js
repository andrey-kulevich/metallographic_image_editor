import { Action, Editor, ScaleLabel, Label } from './model.js'

var canvas = document.getElementById('cv')
var editor = new Editor('cv')

$('#upload').click(() => { $('#file-input').trigger('click') })
$('#file-input').change((event) => { 
    editor.loadPhotos(event.target.files) 
    $('.filename').text(editor.getActivePhoto().name)
})

var isScaleEnglish = false

$('a[name=scaleLang]').click(() => { 
    isScaleEnglish = !isScaleEnglish 
    if (isScaleEnglish) $('a[name=scaleLang]').css('background-color', '#edeff3')
    else $('a[name=scaleLang]').css('background-color', '#fff')
})

$('#labelColorButton').click(() => {
    if ($('#labelColorButton').text() === 'Цвет: черный') {
        $('#labelColorButton').removeClass('active')
        $('#labelColorButton').text('Цвет: белый')
    } else {
        $('#labelColorButton').addClass('active')
        $('#labelColorButton').text('Цвет: черный')
    }
    editor.switchLabelsColor()
})

$('a[name=x50scale]').click(() => { isScaleEnglish ? 
    editor.drawScaleLabel(ScaleLabel.Type.EN.x50) : editor.drawScaleLabel(ScaleLabel.Type.RU.x50) })
$('a[name=x100scale]').click(() => { isScaleEnglish ? 
    editor.drawScaleLabel(ScaleLabel.Type.EN.x100) : editor.drawScaleLabel(ScaleLabel.Type.RU.x100) })
$('a[name=x200scale]').click(() => { isScaleEnglish ? 
    editor.drawScaleLabel(ScaleLabel.Type.EN.x200) : editor.drawScaleLabel(ScaleLabel.Type.RU.x200) })
$('a[name=x500scale]').click(() => { isScaleEnglish ? 
    editor.drawScaleLabel(ScaleLabel.Type.EN.x500) : editor.drawScaleLabel(ScaleLabel.Type.RU.x500) })
$('a[name=x1000scale]').click(() => { isScaleEnglish ? 
    editor.drawScaleLabel(ScaleLabel.Type.EN.x1000) : editor.drawScaleLabel(ScaleLabel.Type.RU.x1000) })

$('a[name=leftTopLabel]').click(() => { $('#labelInput').attr('placeholder', 'Левая верхняя метка') })
$('a[name=leftBottomLabel]').click(() => { $('#labelInput').attr('placeholder', 'Левая нижняя метка') })
$('a[name=rightTopLabel]').click(() => { $('#labelInput').attr('placeholder', 'Правая верхняя метка') })
$('a[name=randomLabel]').click(() => { $('#labelInput').attr('placeholder', 'Произвольная метка') })

$('#labelButton').click(() => { 
    const text = $('#labelInput').val()
    switch($('#labelInput').attr('placeholder')) {
        case 'Левая верхняя метка':
            editor.drawLabel(Action.type.LEFT_TOP_LABEL, text) 
            break;
        case 'Левая нижняя метка':
            editor.drawLabel(Action.type.LEFT_BOTTOM_LABEL, text) 
            break;
        case 'Правая верхняя метка':
            editor.drawLabel(Action.type.RIGHT_TOP_LABEL, text) 
            break;
        default:
            break;
    }
})

$('#save').click((e) => {
    e.target.setAttribute('download', editor.getActivePhoto().name)
    e.target.setAttribute('href', canvas.toDataURL("image/jpg").replace("image/jpg", "image/octet-stream"))
})