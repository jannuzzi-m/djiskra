const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const verticeButton = document.getElementById('vertice-button');
const edgeButton = document.getElementById('edge-button');
const undoButton = document.getElementById('undo');
const edgeWeightForm = document.getElementById('edgeWeight');

let edgeStart = null;
let edgeEnd = null;
let x = 0;
let y = 0;
const verticeRadio = 40;
const vertices = [];

let verticeName = 65;


canvas.addEventListener("mousemove", function(evt) { 
    var rect = canvas.getBoundingClientRect(),
    scaleX = canvas.width / rect.width,
    scaleY = canvas.height / rect.height


    x = (evt.clientX - rect.left) * scaleX,
    y = (evt.clientY - rect.top) * scaleY 
});


const handleCLick = () => {
    clickFunction()
}

const addVertice = e => {

    const vertice = new Path2D();
    vertice.arc(x, y, verticeRadio, 0, 2 * Math.PI);
    ctx.stroke(vertice);

    ctx.textAlign = "center";
    ctx.font = "30px Arial";
    const label = String.fromCharCode(verticeName);
    ctx.fillText(String.fromCharCode(verticeName), x, y);
    verticeName++;

    vertices.push({x, y, vertice, label});
}
let clickFunction = addVertice;


const addEdge = () => {
    const nearest = findHoveredVertice();
    if (nearest == null) return;
    if (edgeStart ==  null) {
        edgeStart = nearest;
        return;
    }
    if (edgeEnd ==  null) {
        edgeEnd = nearest;
    }
    ctx.beginPath();
    ctx.moveTo(edgeStart.x, edgeStart.y);
    ctx.lineTo(edgeEnd.x, edgeEnd.y);
    ctx.stroke();

    var midX=edgeStart.x+(edgeEnd.x-edgeStart.x)*0.50;
    var midY=edgeStart.y+(edgeEnd.y-edgeStart.y)*0.50;
    
    ctx.fillText(edgeWeightForm.value, midX, midY + 25);
    verticeName++;

    edgeStart = edgeEnd =null;
    ctx.save();
}

const findHoveredVertice = () => {
    const nearest = vertices.filter(v => ctx.isPointInPath(v.vertice, x, y));
    return nearest[0];
};

canvas.addEventListener("click", handleCLick);
verticeButton.addEventListener('click', () => clickFunction = addVertice);
edgeButton.addEventListener('click', () => clickFunction = addEdge);
undoButton.addEventListener('click', () => ctx.restore());
