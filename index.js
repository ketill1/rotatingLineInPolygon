const canvas = document.getElementById("canvas"); // Get the canvas element from the DOM
const ctx = canvas.getContext("2d"); // Get the 2D rendering context for the canvas
const offset = {
  // Define an offset for the polygon
  x: 250,
  y: 250,
};

const lineDistance = 10; // Define the distance between lines in the generated path
let polygon = [
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

// Add the offset to the polygon points
function addOffset(points, offset) {
  return points.map((point) => {
    const x = point[0];
    const y = point[1];
    const offsetX = x + offset.x;
    const offsetY = y + offset.y;
    return [offsetX, offsetY];
  });
}
polygon = addOffset(polygon, offset);

// Define a function to generate a 2D rotation matrix
function rotationMatrix(angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [
    [cos, -sin],
    [sin, cos],
  ];
}

// Rotate a polygon by a given angle using a rotation matrix
function rotatePolygon(points, angle) {
  const matrix = rotationMatrix(angle);
  return points.map((point) => {
    const x = point[0];
    const y = point[1];
    const rotatedX = matrix[0][0] * x + matrix[0][1] * y;
    const rotatedY = matrix[1][0] * x + matrix[1][1] * y;
    return [rotatedX, rotatedY];
  });
}

let angle = 0; // Initialize the angle of rotation
function animate() {
  // Define the animation function
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  let rotSpeed = 0.5; // Define the rotation speed
  polygon = rotatePolygon(polygon, angle); // Rotate the polygon
  const lines = generatePath(polygon, lineDistance, angle); // Generate the path
  polygon = rotatePolygon(polygon, -angle); // Rotate the polygon back to its original position

  // Draw the polygon
  ctx.beginPath();
  ctx.moveTo(polygon[0][0], polygon[0][1]);
  for (let i = 1; i < polygon.length; i++) {
    ctx.lineTo(polygon[i][0], polygon[i][1]);
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
animate(); // Call the animation function

function generatePath(polygon, lineDistance, angle) {
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
    let intersections = [];
    // Find the intersections of the line with each edge of the polygon
    for (let i = 0; i < polygon.length; i++) {
      let j = (i + 1) % polygon.length;
      let x1 = polygon[i][0],
        y1 = polygon[i][1];
      let x2 = polygon[j][0],
        y2 = polygon[j][1];
      if ((y1 < y && y2 >= y) || (y2 < y && y1 >= y)) {
        let x = ((y - y1) / (y2 - y1)) * (x2 - x1) + x1;
        intersections.push([x, y]);
      }
    }
    // Sort the intersections by x-coordinate
    intersections.sort((a, b) => a[0] - b[0]);
    // Add the line
    intersections = rotatePolygon(intersections, -angle);
    if (intersections.length >= 2) {
      for (let i = 0; i < intersections.length - 1; i += 2) {
        pathLines.push({
          start: intersections[i],
          end: intersections[i + 1],
          yawStart: 0,
          yawEnd: 0,
        });
        alternateSides = false;
      }
    }
  }
  pathGenerated = true;
  return pathLines;
}
