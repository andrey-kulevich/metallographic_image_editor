export class Action {
    
    static type = Object.freeze({
        IMAGE_LOAD: 0, 
        SCALE_LABEL: 1, 
        LEFT_TOP_LABEL: 2, 
        LEFT_BOTTOM_LABEL: 3,
        RIGHT_TOP_LABEL: 4, 
        RANDOM_LABEL: 5, 
        ARROW: 6
    })

    constructor(actionType, params, actionIndex=-1) {
        console.log(actionIndex)
        this.actionType = actionType,
        this.params = params,
        this.actionIndex = actionIndex // index of element to iterate through arrays of identical actions
    }
}

export class Editor {

    actionsList = []
    labels = []
    photos = []
    activePhoto = 0

    constructor(canvasId) {
        this.canvasId = canvasId
        this.canvas = document.getElementById(canvasId)
        this.ctx = this.canvas.getContext("2d")
        this.labels.push(new ScaleLabel(canvasId))
        this.labels.push(new FixedLabel(canvasId, Action.type.LEFT_TOP_LABEL))
        this.labels.push(new FixedLabel(canvasId, Action.type.LEFT_BOTTOM_LABEL))
        this.labels.push(new FixedLabel(canvasId, Action.type.RIGHT_TOP_LABEL))
    }

    addAction(actionType, args, actionIndex=-1) { this.actionsList.push(new Action(actionType, args, actionIndex)) }
    
    redraw() { 
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.actionsList.forEach(elem => {
            switch(elem.actionType) {
                case Action.type.IMAGE_LOAD:
                    this.getActivePhoto().draw()
                    break;
                case Action.type.SCALE_LABEL:
                    this.scaleLabel().draw(...elem.params)
                    break;
                case Action.type.LEFT_TOP_LABEL:
                    this.fixedLabel(Action.type.LEFT_TOP_LABEL).draw(...elem.params)
                    break;
                case Action.type.LEFT_BOTTOM_LABEL:
                    this.fixedLabel(Action.type.LEFT_BOTTOM_LABEL).draw(...elem.params)
                    break;
                case Action.type.RIGHT_TOP_LABEL:
                    this.fixedLabel(Action.type.RIGHT_TOP_LABEL).draw(...elem.params)
                    break;
                // case Action.type.RANDOM_LABEL:
                //     this.labels[elem.actionIndex].draw(...elem.params)
                //     break;
            }
        }) 
    }

    loadPhotos(files) {
        Array.from(files).forEach(file => {
            let photo = new Photo(this.canvasId)
            photo.load(file)
            this.photos.push(photo)
        })
        this.getActivePhoto().img.onload = () => this.getActivePhoto().draw()
        this.addAction(Action.type.IMAGE_LOAD, [])
    }

    setActivePhoto(index) { this.activePhoto = index }
    
    getActivePhoto() { return this.photos[this.activePhoto] }

    switchLabelsColor() { this.labels.forEach(elem => elem.switchColor()) }

    scaleLabel() { return this.labels.find(elem => elem instanceof ScaleLabel) }

    fixedLabel(type) { return this.labels.find(elem => elem.type === type) }

    drawLabel(type, text) {
        this.removeLabel(type)
        this.addAction(type, [text])
        this.redraw()
    }

    drawScaleLabel(type) {
        this.removeLabel(Action.type.SCALE_LABEL)
        this.addAction(Action.type.SCALE_LABEL, type)
        this.redraw()
    }

    drawFloatingLabel(text) {
        this.labels.push(new FloatingLabel(this.canvasId))
        this.labels[this.labels.length - 1].draw(text)
        //this.addAction(Action.type.RANDOM_LABEL, [text], this.labels.length - 1)
        //this.redraw()
    }

    removeLabel(type) {
        let index = this.actionsList.indexOf(this.actionsList.find(elem => elem.actionType === type))
        if (index > -1) this.actionsList.splice(index, 1)
    }

    undoLastAction() { 
        this.actionsList.splice(this.actionsList.length - 1, 1) 
        this.redraw()
    }
}

export class Photo {
    
    name = ''
    img = new Image()

    constructor(canvasId) { 
        this.canvasId = canvasId 
        this.canvas = document.getElementById(canvasId)
        this.ctx = this.canvas.getContext("2d") 
    }

    load(file) {
        this.name = file.name
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = (e) => {
            if (e.target.readyState == FileReader.DONE) {
                this.img.src = e.target.result
            }
        }
    }

    draw() { this.ctx.drawImage(this.img, 0, 0) }
}

export class Label {

    static Color = Object.freeze({WHITE: 0, BLACK: 1})
    color = Label.Color.BLACK

    constructor(canvasId) { 
        this.canvasId = '#' + canvasId 
        this.canvas = document.getElementById(canvasId)
    }

    switchColor() {
        if (this.color === Label.Color.BLACK) this.color = Label.Color.WHITE
        else this.color = Label.Color.BLACK
    }
}

export class ScaleLabel extends Label {

    static Type = Object.freeze({
        RU: {
            x50: ['500 мкм', 183],
            x100: ['500 мкм', 365],
            x200: ['200 мкм', 291],
            x500: ['100 мкм', 369],
            x1000: ['50 мкм', 372],
        }, 
        EN: {
            x50: ['500 um', 183],
            x100: ['500 um', 365],
            x200: ['200 um', 291],
            x500: ['100 um', 369],
            x1000: ['50 um', 372],
        }
    })

    constructor(canvasId) { super(canvasId) }

    draw(text, lineWidth) {
        const width = this.canvas.width
        const height = this.canvas.height

        $(this.canvasId).drawText({
            fillStyle: this.color === Label.Color.BLACK ? '#000' : '#fff',
            strokeStyle: '#000',
            strokeWidth: this.color === Label.Color.BLACK ? 0 : 1,
            x: width - 195, y: height - 50,
            fontSize: 75,
            fontFamily: 'Times New Roman',
            text: text
        }).drawRect({
            fillStyle: this.color === Label.Color.BLACK ? '#000' : '#fff',
            strokeStyle: '#000',
            strokeWidth: 1,
            x: width - 200, y: height - 20,
            width: lineWidth - 2,
            height: 6
          });
    }
}

export class FixedLabel extends Label {

    constructor(canvasId, actionType) { 
        super(canvasId) 
        this.type = actionType
    }

    draw(text) {
        const width = this.canvas.width
        const height = this.canvas.height
        let posX = 0
        let posY = 0

        switch(this.type) {
            case Action.type.LEFT_TOP_LABEL:
                posX = 25
                posY = 10
                break;
            case Action.type.LEFT_BOTTOM_LABEL:
                posX = 25
                posY = height - 70
                break;
            default:
                posX = width - (40 * text.length + 5),
                posY = 10
                break;
        }

        $(this.canvasId).drawText({
            fillStyle: this.color === Label.Color.BLACK ? '#000' : '#fff',
            strokeStyle: '#000',
            strokeWidth: this.color === Label.Color.BLACK ? 0 : 1,
            x: posX, y: posY,
            fontSize: 75,
            fontFamily: 'Times New Roman',
            text: text,
            fromCenter: false
        })
    }
}

export class FloatingLabel extends Label {

    constructor(canvasId) { 
        super(canvasId) 
    }

    draw(text) {
        $(this.canvasId).drawText({
            fillStyle: this.color === Label.Color.BLACK ? '#000' : '#fff',
            strokeStyle: '#000',
            strokeWidth: this.color === Label.Color.BLACK ? 0 : 1,
            x: 100, y: 100,
            fontSize: 75,
            fontFamily: 'Times New Roman',
            text: text,
            fromCenter: false,
            layer: true,
            draggable: true,
            bringToFront: true
        })
    }
}

export class Arrow {

}