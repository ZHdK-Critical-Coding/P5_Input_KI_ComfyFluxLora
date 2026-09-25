# P5 -> Comfy Flux Lora

A p5.js sketch that sends a text prompt to a ComfyUI server, runs a Flux
workflow with a LoRA and shows the generated image on a 1024 x 1024 canvas.

## How to Use

1. Run a ComfyUI instance that is reachable from your computer. The workflow
   `workflows/Flux-Lora-Simple-Beocom2000.ai.json` expects:
   - UNet `FLUX1/flux_dev_fp8_scaled_diffusion_model.safetensors`
   - VAE `FLUX1/diffusion_pytorch_model.safetensors`
   - CLIP `t5/t5xxl_fp8_e4m3fn.safetensors` and `clip_l.safetensors`
   - LoRA `AI-Toolkit/beocom_2000_v.1/beocom_2000_v.1.safetensors`
   - the custom node **CR SDXL Aspect Ratio** (ComfyUI Comfyroll nodes)
   - the **SaveImageWebsocket** node (included with ComfyUI)
2. Set the address of your ComfyUI server in the `instance` constant at the
   top of `sketch.js`.
3. Start Live Server (click **Go Live** in the VS Code status bar).
4. The browser calls ComfyUI cross-origin. Either start ComfyUI with
   `--enable-cors-header`, or use the debugger configuration
   **Launch Chrome (no Security)** (Run and Debug panel).
5. Edit the prompt in the text field and press **generate**. A pulsing red
   dot is shown while the image is being generated.

## How it Works

The workflow (exported in ComfyUI's API format) is loaded as JSON. Before each
run the sketch writes the prompt into node `6` and a random seed into node
`25`. The p5.comfyui-helper replaces `SaveImage` with `SaveImageWebsocket`,
queues the workflow via `/prompt` and receives the result image over the
WebSocket.

## Libraries

- p5.js 1.10.0, p5.sound 1.0.1 (in `libraries/`)
- [p5.comfyui-helper](https://github.com/gohai/p5.comfyui-helper) by Gottfried Haider
