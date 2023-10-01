const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const canvas2 = document.getElementById("canvas2");
const ctx2 = canvas2.getContext("2d");

ctx2.fillStyle = "#fffaff";
ctx2.fillRect(0, 0, canvas2.width, canvas2.height);

const verticeButton = document.getElementById('vertice-button');
const edgeButton = document.getElementById('edge-button');
const edgeWeightForm = document.getElementById('edgeWeight');
const findShortestPathButton = document.getElementById('find-shortest-path');

const startVertex = document.getElementById('startVertex');
const endVertex = document.getElementById('endVertex');
const cost = document.getElementById('cost');

const vertexFrom = document.getElementById('vertexFrom');
const vertexTo = document.getElementById('vertexTo');

const vertexSelectionMessage = document.getElementById('vertice-selection-message')

let originVertice = null;
let destinyVertice = null;
let isSelectingVertices = false;


let edgeStart = null;
let edgeEnd = null;
let x = 0;
let y = 0;
const verticeRadio = 40;
const vertices = [];

let verticeName = 65;
const graph = {};


canvas.addEventListener("mousemove", function(evt) { 
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;


    x = (evt.clientX - rect.left) * scaleX,
    y = (evt.clientY - rect.top) * scaleY 
});


const handleCLick = () => {
    clickFunction()
}

const addVertice = e => {

    const vertice = new Path2D();
    vertice.arc(x, y, verticeRadio, 0, 2 * Math.PI);
    ctx.fillStyle = '#fffaff'
    ctx.fill(vertice);
    ctx.strokeStyle = '#003a44'
    ctx.stroke(vertice);
    

    ctx.textAlign = "center";
    ctx.textBaseline = 'middle'; 
    ctx.font = "30px Arial";
    ctx2.font = "30px Arial";
    const label = String.fromCharCode(verticeName);
    ctx.fillStyle = 'black'
    ctx.fillText(String.fromCharCode(verticeName), x, y);
    verticeName++;

    vertices.push({x, y, vertice, label});
}
let clickFunction = addVertice;


const addEdge = () => {
    const nearest = findHoveredVertice();
    ctx.lineWidth = 5;
    if (nearest == null) return;
    ctx.stroke(nearest.vertice)

    if (edgeStart ==  null) {
        edgeStart = nearest;
        return;
    }
    if (edgeEnd ==  null) {
        edgeEnd = nearest;
    }
    ctx.lineWidth = 1;

    const edge = new Path2D();
    ctx2.beginPath();
    edge.moveTo(edgeStart.x, edgeStart.y);
    edge.lineTo(edgeEnd.x, edgeEnd.y);
    ctx2.stroke(edge);

    edgeStart[edgeEnd.label] = edge;
    edgeEnd[edgeStart.label] = edge;

    const midX=edgeStart.x+(edgeEnd.x-edgeStart.x)*0.50;
    const midY=edgeStart.y+(edgeEnd.y-edgeStart.y)*0.50;
    const edgeWeigth = edgeWeightForm.value;
    
    ctx.fillText(edgeWeightForm.value, midX, midY + 25);
    verticeName++;

    if(!graph.hasOwnProperty(edgeStart.label)){
        graph[edgeStart.label] = {};
    }
    if(!graph.hasOwnProperty(edgeEnd.label)){
        graph[edgeEnd.label] = {};
    }
    graph[edgeStart.label][edgeEnd.label] = parseInt(edgeWeigth);
    graph[edgeEnd.label][edgeStart.label] = parseInt(edgeWeigth);
    edgeStart = edgeEnd = null;

    console.log(graph)
}

const findHoveredVertice = () => {
    const nearest = vertices.filter(v => ctx.isPointInPath(v.vertice, x, y));
    return nearest[0];
};

const resolveAlgorithm = () => {
    const startPath = originVertice.label;
    const endPath = destinyVertice.label;
    vertexTo.innerHTML = `Destino: ${destinyVertice.label}`;
    console.log(findShortestPath(graph, startPath, endPath));
    resolution = findShortestPath(graph, startPath, endPath);
    visualFeedback(resolution);
}

const selectVertice = () => {
    const nearest = findHoveredVertice();
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#227877';
    if (originVertice ==  null) {
        originVertice = nearest;
        vertexFrom.innerHTML = `Origem: ${originVertice.label}`;
        ctx.stroke(nearest.vertice);
        vertexSelectionMessage.innerHTML = 'Selecione o vertice de destino';
        return;
    }
    if (destinyVertice ==  null) {
        vertexTo.innerHTML = nearest.label;
        destinyVertice = nearest;
        isSelectingVertices = false;
        resolveAlgorithm();
    }

}

canvas.addEventListener("click", handleCLick);
verticeButton.addEventListener('click', () => {
    clickFunction = addVertice;
    verticeButton.classList.add('selected-button');
    edgeButton.classList.remove('selected-button');
});
edgeButton.addEventListener('click', () => {
    clickFunction = addEdge
    edgeButton.classList.add('selected-button');
    verticeButton.classList.remove('selected-button');
});
findShortestPathButton.addEventListener('click', () => {
    clickFunction = selectVertice;
    findShortestPathButton.classList.add('selected-button');
    edgeButton.classList.remove('selected-button')
    verticeButton.classList.remove('selected-button')
    findShortestPathButton.disabled = true;
    vertexSelectionMessage.innerHTML = 'Selecione o vertice de origem';
})


const visualFeedback = (resolution) => {
    cost.innerHTML = `Custo: ${resolution.distance}`;
    ctx.strokeStyle = '#a5b452';
    ctx.lineWidth = 10;

    ctx2.strokeStyle = '#a5b452';
    ctx2.lineWidth = 10;
    resolution.path.forEach((node, index) => {
        const currentVertice = vertices.filter(v => v.label == node)[0]
        if (resolution.path[index + 1]){
            
            ctx2.stroke(currentVertice[resolution.path[index + 1]])
        };
    ctx.strokeStyle = '#a5b452';

        ctx.stroke(currentVertice.vertice)

    })
    
}