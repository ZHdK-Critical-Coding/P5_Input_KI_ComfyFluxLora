# P5.js: Comfy Flux Lora

[Deutsch](README_DE.md)

Sends a text prompt to a ComfyUI server, runs a Flux workflow with a LoRA
and shows the generated image on a 1024 × 1024 canvas. A starting point for
driving your own ComfyUI workflows (with custom models and LoRAs) from a
sketch.

## Installation

Requirements: a running ComfyUI server (see Server).

Libraries (in `libraries/`): p5.js 1.10.0, p5.sound 1.0.1 (included, not
used), [p5.comfyui-helper](https://github.com/gohai/p5.comfyui-helper) by
Gottfried Haider.

## Server

Needs a [ComfyUI](https://github.com/comfyanonymous/ComfyUI) server on port
8188, usually on a machine with a GPU — on the same computer or on another
machine in the network. Start it before the sketch; to allow access from
other machines and from the browser, start it with
`python main.py --listen --enable-cors-header`. The workflow
`workflows/Flux-Lora-Simple-Beocom2000.ai.json` expects:

- UNet `FLUX1/flux_dev_fp8_scaled_diffusion_model.safetensors`
- VAE `FLUX1/diffusion_pytorch_model.safetensors`
- CLIP `t5/t5xxl_fp8_e4m3fn.safetensors` and `clip_l.safetensors`
- LoRA `AI-Toolkit/beocom_2000_v.1/beocom_2000_v.1.safetensors`
- the custom node **CR SDXL Aspect Ratio** (ComfyUI Comfyroll nodes)
- the **SaveImageWebsocket** node (included with ComfyUI)

Set the server address in the `instance` constant at the top of
`sketch.js` (default `http://192.168.2.8:8188`).

## How to Run

1. Open the folder in Visual Studio Code and start Live Server (click
   **Go Live** in the status bar).
2. The browser calls ComfyUI cross-origin. If ComfyUI isn't started with
   `--enable-cors-header` (see Server), use the debugger configuration
   **Launch Chrome (no Security)** (Run and Debug panel).
3. Edit the prompt in the text field and press **generate**. A pulsing red
   dot is shown while the image is being generated.

## Coding Help

- **Config at the top of `sketch.js`**: `instance` (ComfyUI URL),
  `workflowfile` (file name in `workflows/`) and `defaultPrompt`.
- **`preload()`**: loads the workflow JSON. It must be exported in ComfyUI's
  API format (**Save (API)**); the keys are the node numbers.
- **`setup()`**: creates the canvas, the `ComfyUiP5Helper` (opens a
  WebSocket to ComfyUI), the prompt textarea and the **generate** button.
- **`requestImage()`**: writes a random seed into node `25` (RandomNoise)
  and the prompt into node `6` (CLIPTextEncode), then calls
  `await comfy.run(workflow, gotImage)`. If the request fails (e.g. server
  not reachable), the error is logged and `running` is reset so you can try
  again. Change other nodes here the same way, e.g. steps in node `17`, LoRA
  strength in node `72`, image size in node `85` (`width`/`height`; its
  `aspect_ratio` is set to `custom` so these values apply – the default
  1024 × 1024 matches the square canvas). If you use your own workflow,
  adapt the node numbers.
- **`libraries/p5.comfyui-helper.js`**: replaces `SaveImage` with
  `SaveImageWebsocket`, queues the workflow via `/prompt` and collects the
  result images from the WebSocket as blob URLs.
- **`gotImage(results, err)`**: loads the first result into `resImg` (if
  there is one; on an error `results` is empty and `err` is logged).
  Uncomment `requestImage()` at the end to generate images in a loop.
- **`draw()`**: draws `resImg` scaled to the canvas and the pulsing dot
  while `running` is true.
