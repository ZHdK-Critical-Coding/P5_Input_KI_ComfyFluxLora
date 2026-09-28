# P5.js: Comfy Flux Lora

[Deutsch](README_DE.md)

Sends a text prompt to a ComfyUI server, runs a Flux workflow with a LoRA
and shows the generated image on a 1024 × 1024 canvas. A starting point for
driving your own ComfyUI workflows (with custom models and LoRAs) from a
sketch.

## Installation

Requirements: a ComfyUI instance reachable from your computer (usually on
the local network, with a GPU). The workflow
`workflows/Flux-Lora-Simple-Beocom2000.ai.json` expects:

- UNet `FLUX1/flux_dev_fp8_scaled_diffusion_model.safetensors`
- VAE `FLUX1/diffusion_pytorch_model.safetensors`
- CLIP `t5/t5xxl_fp8_e4m3fn.safetensors` and `clip_l.safetensors`
- LoRA `AI-Toolkit/beocom_2000_v.1/beocom_2000_v.1.safetensors`
- the custom node **CR SDXL Aspect Ratio** (ComfyUI Comfyroll nodes)
- the **SaveImageWebsocket** node (included with ComfyUI)

1. Set the address of your ComfyUI server in the `instance` constant at the
   top of `sketch.js` (default `http://192.168.2.8:8188`).
2. Open the folder in Visual Studio Code and start Live Server (click
   **Go Live** in the status bar).
3. The browser calls ComfyUI cross-origin. Either start ComfyUI with
   `--enable-cors-header`, or use the debugger configuration
   **Launch Chrome (no Security)** (Run and Debug panel).
4. Edit the prompt in the text field and press **generate**. A pulsing red
   dot is shown while the image is being generated.

Libraries (in `libraries/`): p5.js 1.10.0, p5.sound 1.0.1 (included, not
used), [p5.comfyui-helper](https://github.com/gohai/p5.comfyui-helper) by
Gottfried Haider.

## Coding Help

- **Config at the top of `sketch.js`**: `instance` (ComfyUI URL),
  `workflowfile` (file name in `workflows/`) and `defaultPrompt`.
- **`preload()`**: loads the workflow JSON. It must be exported in ComfyUI's
  API format (**Save (API)**); the keys are the node numbers.
- **`setup()`**: creates the canvas, the `ComfyUiP5Helper` (opens a
  WebSocket to ComfyUI), the prompt textarea and the **generate** button.
- **`requestImage()`**: writes a random seed into node `25` (RandomNoise)
  and the prompt into node `6` (CLIPTextEncode), then calls
  `comfy.run(workflow, gotImage)`. Change other nodes here the same way, e.g.
  steps in node `17`, LoRA strength in node `72`, image size in node `85`.
  If you use your own workflow, adapt the node numbers.
- **`libraries/p5.comfyui-helper.js`**: replaces `SaveImage` with
  `SaveImageWebsocket`, queues the workflow via `/prompt` and collects the
  result images from the WebSocket as blob URLs.
- **`gotImage(results, err)`**: loads the first result into `resImg`.
  Uncomment `requestImage()` at the end to generate images in a loop.
- **`draw()`**: draws `resImg` scaled to the canvas and the pulsing dot
  while `running` is true.
