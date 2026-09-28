# P5.js: Comfy Flux Lora

[English](readme.md)

Schickt einen Text-Prompt an einen ComfyUI-Server, führt einen
Flux-Workflow mit einer LoRA aus und zeigt das generierte Bild auf einer
1024 × 1024 grossen Zeichenfläche. Ein Ausgangspunkt, um eigene
ComfyUI-Workflows (mit eigenen Modellen und LoRAs) aus einem Sketch
anzusteuern.

## Installation

Voraussetzungen: eine ComfyUI-Instanz, die vom eigenen Computer aus
erreichbar ist (meist im lokalen Netz, mit GPU). Der Workflow
`workflows/Flux-Lora-Simple-Beocom2000.ai.json` erwartet:

- UNet `FLUX1/flux_dev_fp8_scaled_diffusion_model.safetensors`
- VAE `FLUX1/diffusion_pytorch_model.safetensors`
- CLIP `t5/t5xxl_fp8_e4m3fn.safetensors` und `clip_l.safetensors`
- LoRA `AI-Toolkit/beocom_2000_v.1/beocom_2000_v.1.safetensors`
- den Custom Node **CR SDXL Aspect Ratio** (ComfyUI Comfyroll Nodes)
- den Node **SaveImageWebsocket** (in ComfyUI enthalten)

Die Adresse des ComfyUI-Servers in der Konstante `instance` oben in
`sketch.js` eintragen (Standard `http://192.168.2.8:8188`).

Bibliotheken (in `libraries/`): p5.js 1.10.0, p5.sound 1.0.1 (eingebunden,
nicht verwendet), [p5.comfyui-helper](https://github.com/gohai/p5.comfyui-helper)
von Gottfried Haider.

## Ausführen

1. Den Ordner in Visual Studio Code öffnen und Live Server starten (in der
   Statusleiste auf **Go Live** klicken).
2. Der Browser greift Cross-Origin auf ComfyUI zu. Entweder ComfyUI mit
   `--enable-cors-header` starten oder die Debugger-Konfiguration
   **Launch Chrome (no Security)** verwenden (Panel Run and Debug).
3. Den Prompt im Textfeld anpassen und auf **generate** klicken. Während
   das Bild generiert wird, pulsiert ein roter Punkt.

## Coding-Hilfe

- **Konfiguration oben in `sketch.js`**: `instance` (ComfyUI-URL),
  `workflowfile` (Dateiname in `workflows/`) und `defaultPrompt`.
- **`preload()`**: lädt das Workflow-JSON. Es muss im API-Format von
  ComfyUI exportiert sein (**Save (API)**); die Schlüssel sind die
  Node-Nummern.
- **`setup()`**: erstellt die Zeichenfläche, den `ComfyUiP5Helper` (öffnet
  einen WebSocket zu ComfyUI), das Prompt-Textfeld und den Knopf
  **generate**.
- **`requestImage()`**: schreibt einen zufälligen Seed in Node `25`
  (RandomNoise) und den Prompt in Node `6` (CLIPTextEncode) und ruft dann
  `await comfy.run(workflow, gotImage)` auf. Schlägt die Anfrage fehl (z. B.
  Server nicht erreichbar), wird der Fehler geloggt und `running`
  zurückgesetzt, sodass man es erneut versuchen kann. Andere Nodes lassen
  sich hier gleich ändern, z. B. die Steps in Node `17`, die LoRA-Stärke in
  Node `72`, die Bildgrösse in Node `85` (`width`/`height`; `aspect_ratio`
  steht auf `custom`, damit diese Werte gelten – die Standardgrösse
  1024 × 1024 passt zur quadratischen Zeichenfläche). Bei einem eigenen
  Workflow die Node-Nummern anpassen.
- **`libraries/p5.comfyui-helper.js`**: ersetzt `SaveImage` durch
  `SaveImageWebsocket`, stellt den Workflow über `/prompt` in die
  Warteschlange und sammelt die Ergebnisbilder aus dem WebSocket als
  Blob-URLs.
- **`gotImage(results, err)`**: lädt das erste Ergebnis in `resImg` (falls
  vorhanden; bei einem Fehler ist `results` leer und `err` wird geloggt). Wer
  `requestImage()` am Ende einkommentiert, generiert Bilder in einer
  Schleife.
- **`draw()`**: zeichnet `resImg` skaliert auf die Zeichenfläche und den
  pulsierenden Punkt, solange `running` true ist.
