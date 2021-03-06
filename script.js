var canvas = document.getElementById("cv")
var ctx = canvas.getContext("2d")

var files = []
//var images = []
var img = new Image()

var actionsList = []
class Action {
    static type = Object.freeze({IMAGE_LOAD: 0, SCALE_LABEL: 1, LEFT_TOP_LABEL: 2, LEFT_BOTTOM_LABEL: 3, RANDOM_LABEL: 4, ARROW: 5})
    constructor(actionType, action, params) {
        this.actionType = actionType,
        this.action = action,
        this.params = params
    }
    execute() { this.action(...this.params) }
}

function redraw() { 
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    actionsList.forEach(elem => { elem.execute() }) 
}

function drawImage() { ctx.drawImage(img, 0, 0) }

function drawScaleLabel(text, lineWidth) {
    let leftOffset = 0
    let rightOffset = 0
    if (lineWidth % 2 == 0) {
        leftOffset = lineWidth / 2
        rightOffset = lineWidth / 2
    } else {
        leftOffset = Math.floor(lineWidth / 2)
        rightOffset = leftOffset + 1
    }
    
    $('canvas').drawText({
        fillStyle: '#000',
        x: canvas.width - 195, y: canvas.height - 50,
        fontSize: 75,
        fontFamily: 'Times New Roman',
        text: text
    }).drawLine({
        strokeStyle: '#000',
        strokeWidth: 8,
        x1: canvas.width - 200 - leftOffset, y1: canvas.height - 20,
        x2: canvas.width - 200 + rightOffset, y2: canvas.height - 20
    });
}

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
            img.onload = () => drawImage()
            actionsList.push(new Action(Action.type.IMAGE_LOAD, drawImage, []))
        }
    }
})

$('#save').click((e) => {
    e.target.setAttribute('download', 'img.jpg')
    e.target.setAttribute('href', canvas.toDataURL("image/jpg").replace("image/jpg", "image/octet-stream"))
})

function removeScaleLabel() {
    let index = actionsList.indexOf(actionsList.find(elem => elem.actionType === Action.type.SCALE_LABEL))
    if (index > -1) actionsList.splice(index, 1)
}

$('a[name=x50scale]').click(() => { 
    removeScaleLabel()
    actionsList.push(new Action(Action.type.SCALE_LABEL, drawScaleLabel, ['500 мкм', 183])) 
    redraw()
})
$('a[name=x100scale]').click(() => { 
    removeScaleLabel() 
    actionsList.push(new Action(Action.type.SCALE_LABEL, drawScaleLabel, ['500 мкм', 365])) 
    redraw()
})
$('a[name=x200scale]').click(() => { 
    removeScaleLabel()
    actionsList.push(new Action(Action.type.SCALE_LABEL, drawScaleLabel, ['200 мкм', 291])) 
    redraw()
})
$('a[name=x500scale]').click(() => { 
    removeScaleLabel()
    actionsList.push(new Action(Action.type.SCALE_LABEL, drawScaleLabel, ['100 мкм', 369])) 
    redraw()
})
$('a[name=x1000scale]').click(() => { 
    removeScaleLabel()
    actionsList.push(new Action(Action.type.SCALE_LABEL, drawScaleLabel, ['50 мкм', 372])) 
    redraw()
})


