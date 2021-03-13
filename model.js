export class Action {
    static type = Object.freeze({IMAGE_LOAD: 0, SCALE_LABEL: 1, LEFT_TOP_LABEL: 2, LEFT_BOTTOM_LABEL: 3, RANDOM_LABEL: 4, ARROW: 5})
    constructor(actionType, params) {
        this.actionType = actionType,
        this.params = params
    }
}

export class Editor {

    actionsList = []
    scale = null
    photos = []
    activePhoto = 0

    constructor(canvasId) {
        this.canvasId = canvasId
        this.canvas = document.getElementById(canvasId)
        this.ctx = this.canvas.getContext("2d")
        this.scale = new Scale(canvasId)
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

    addAction(actionType, args) { this.actionsList.push(new Action(actionType, args)) }
    
    redraw() { 
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.actionsList.forEach(elem => {
            switch(elem.actionType) {
                case Action.type.IMAGE_LOAD:
                    this.getActivePhoto().draw()
                    break;
                case Action.type.SCALE_LABEL:
                    this.scale.draw(...elem.params)
                    break;
                default:
                    break;
            }
        }) 
    }

    drawScaleLabel(type) {
        this.removeScaleLabel()
        this.addAction(Action.type.SCALE_LABEL, type)
        this.redraw()
    }

    removeScaleLabel() {
        let index = this.actionsList.indexOf(this.actionsList.find(elem => elem.actionType === Action.type.SCALE_LABEL))
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

export class Scale {

    static Color = Object.freeze({WHITE: 0, BLACK: 1})
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

    color = Scale.Color.BLACK

    constructor(canvasId) { 
        this.canvasId = '#' + canvasId 
        this.canvas = document.getElementById(canvasId)
    }

    draw(text, lineWidth) {
        const width = this.canvas.width
        const height = this.canvas.height

        $(this.canvasId).drawText({
            fillStyle: this.color === Scale.Color.BLACK ? '#000' : '#fff',
            strokeStyle: '#000',
            strokeWidth: this.color === Scale.Color.BLACK ? 0 : 1,
            x: width - 195, y: height - 50,
            fontSize: 75,
            fontFamily: 'Times New Roman',
            text: text
        }).drawRect({
            fillStyle: this.color === Scale.Color.BLACK ? '#000' : '#fff',
            strokeStyle: '#000',
            strokeWidth: 1,
            x: width - 200, y: height - 20,
            width: lineWidth - 2,
            height: 6
          });
    }
}