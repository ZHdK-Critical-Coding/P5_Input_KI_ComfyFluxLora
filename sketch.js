// ============================================
// ComfyUI Workflow Example with p5.js
// ============================================

// NOTE: This example expects the checkpoint `flux_dev_fp8_scaled_diffusion_model` to be installed on your comfy instance

// URL of the ComfyUI instance running on local network
const instance = "http://192.168.2.8:8188";

// The workflow JSON file to use
const workflowfile = "Flux-Lora-Simple-Beocom2000.ai.json";

// Default prompt for image generation
const defaultPrompt = "a robot consisting of plastic black holder parts and small circuit boards and large circuit boards mainboards and plastic bottom case parts lower side and plastic red phones and black spiral cables and one plastic multicolor upper cases on the floor of a clean gallery space.";

// Variables to hold workflow, helper, generated image, and prompt
let workflow;
let comfy;   // ComfyUI helper instance
let resImg;  // Generated image
let prompt;  // User-editable prompt
let running = false; // Flag to prevent multiple simultaneous runs

// ============================================
// Preload function (p5.js)
// ============================================
function preload() {
  // Load the workflow JSON file before setup
  workflow = loadJSON(`./workflows/${workflowfile}`);
}

// ============================================
// Setup function (p5.js)
// ============================================
function setup() {
  createCanvas(1024, 1024); // Create a large canvas
  comfy = new ComfyUiP5Helper(instance); // Initialize helper with instance URL
  console.log("workflow is", workflow);

  // Create a textarea for user input prompt
  prompt = createElement('textarea', defaultPrompt);

  // Create a button to trigger image generation
  let button = createButton('generate');
  button.mousePressed(requestImage); // Call requestImage when pressed
}

// ============================================
// Function to request image generation
// ============================================
function requestImage() {
  if (running) return; // Prevent multiple runs at the same time

  // Workflow can be modified before running
  // For example: updating prompt text or randomizing seed
  running = true;
  try {
    // Randomize noise seed to get variation
    workflow[25].inputs.noise_seed = random(9999999);

    // Update the prompt in the workflow
    workflow[6].inputs.text = prompt.value();

    // Run the workflow via ComfyUI helper
    comfy.run(workflow, gotImage);

  } catch (err) {
    // If there’s an error, reset running flag
    running = false;
  }
}

// ============================================
// Callback function when image generation is done
// ============================================
function gotImage(results, err) {
  running = false; // Reset running flag

  // `results` is an array of outputs from the workflow
  console.log("gotImage", results);

  // Load the first generated image to display on canvas
  if (results.length > 0) {
    resImg = loadImage(results[0].src);
  }

  // Optional: automatically run again
  // requestImage();
}

// ============================================
// Draw function (p5.js)
// ============================================
function draw() {
  background(128); // Gray background

  // Display the generated image if available
  if (resImg) {
    image(resImg, 0, 0, width, height);
  }

  // Display a flashing red circle in the corner when running
  if (running) {
    noStroke();
    fill(255, 0, 0, frameCount % 128); // Alpha pulsates
    circle(40, 40, 20);
  }
}