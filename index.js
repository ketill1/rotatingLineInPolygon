const canvas = document.getElementById("canvas"); // Get the canvas element from the DOM
const ctx = canvas.getContext("2d"); // Get the 2D rendering context for the canvas
const offset = {
  // Define an offset for the polygon
  x: 250,
  y: 250,
};
const polygon = [
  // Define the initial polygon points  [10, 50],
  [10, 50],
  [500, 10],
  [500, 50],
  [100, 100],
  [100, 150],
  [300, 300],
  [350, 500],
  [100, 400],
  [50, 500],
];
const rotSpeed = 0.5; // Define the rotation speed
const lineDistance = 10; // Define the distance between lines in the generated path
let angle = 0; // Initialize the angle of rotation
let pathGenerated = false;

// Add the offset to the polygon points
function addOffset(points) {
  return points.map((point) => {
    const [x, y] = point;
    return [x + offset.x, y + offset.y];
  });
}

// Rotate a polygon by a given angle using a rotation matrix
function rotatePolygon(points, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return points.map(([x, y]) => [cos * x - sin * y, sin * x + cos * y]);
}

function animate(polygon) {
  // Define the animation function
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  const rotatedPolygon = rotatePolygon(offsetPolygon, angle); // Rotate the polygon
  const lines = generatePath(rotatedPolygon, lineDistance); // Generate the path
  const finalPolygon = rotatePolygon(rotatedPolygon, -angle); // Rotate the polygon back to its original position

  // Draw the polygon
  ctx.beginPath();
  ctx.moveTo(finalPolygon[0][0], finalPolygon[0][1]);
  for (let i = 1; i < finalPolygon.length; i++) {
    ctx.lineTo(finalPolygon[i][0], finalPolygon[i][1]);
  }
  ctx.closePath();
  ctx.stroke();

  // Draw the lines of the generated path
  for (const line of lines) {
    ctx.beginPath();
    ctx.moveTo(line.start[0], line.start[1]);
    ctx.lineTo(line.end[0], line.end[1]);
    ctx.stroke();
  }
  angle += (rotSpeed * Math.PI) / 180; // Update the rotation angle
  requestAnimationFrame(animate); // Request another animation frame
}

function findIntersections(polygon, y) {
  const intersections = [];

  for (let i = 0; i < polygon.length; i++) {
    const j = (i + 1) % polygon.length;
    const [x1, y1] = polygon[i];
    const [x2, y2] = polygon[j];

    if ((y1 < y && y2 >= y) || (y2 < y && y1 >= y)) {
      const x = ((y - y1) / (y2 - y1)) * (x2 - x1) + x1;
      intersections.push([x, y]);
    }
  }

  return intersections;
}

function sortIntersections(intersections) {
  return intersections.sort((a, b) => a[0] - b[0]);
}

function generatePath(polygon, lineDistance) {
  // const { minY, maxY } = findMinMaxY(polygon);
  const lines = [];
  const pathLines = [];
  let minY = Number.MAX_VALUE,
    maxY = Number.MIN_VALUE;
  // Find the minimum and maximum y-coordinate of the polygon's vertices
  for (let i = 0; i < polygon.length; i++) {
    minY = Math.min(minY, polygon[i][1]);
    maxY = Math.max(maxY, polygon[i][1]);
  }
  // Generate the lines
  for (let y = minY + lineDistance; y < maxY; y += lineDistance) {
    //let intersections = [];
    // Find the intersections of the line with each edge of the polygon
    const intersections = findIntersections(polygon, y);
    // Sort the intersections by x-coordinate
    const sortedIntersections = sortIntersections(intersections);

    // Add the line
    const rotatedIntersections = rotatePolygon(sortedIntersections, -angle);

    for (let i = 0; i < rotatedIntersections.length - 1; i += 2) {
      const start = rotatedIntersections[i];
      const end = rotatedIntersections[i + 1];
      pathLines.push({ start, end, yawStart: 0, yawEnd: 0 });
      alternateSides = false;
    }
  }
  pathGenerated = true;
  return pathLines;
}

const offsetPolygon = addOffset(polygon);
animate(offsetPolygon); // Call the animation function
