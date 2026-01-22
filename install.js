module.exports = {
  run: [
    {
      method: "shell.run",
      params: {
        message: [
          "git clone https://github.com/GVCLab/PersonaLive.git app"
        ],
        when: "{{!exists('app')}}"
      }
    },
    {
      "method": "shell.run",
      "params": {
        "message": [
          "{{platform === 'win32' ? 'if exist ..\\\\requirements.txt copy /y ..\\\\requirements.txt requirements.txt' : 'if [ -f ../requirements.txt ]; then cp ../requirements.txt requirements.txt; fi'}}",
          "{{platform === 'win32' ? 'if exist ..\\\\app.py copy /y ..\\\\app.py inference_online.py' : 'if [ -f ../app.py ]; then cp ../app.py inference_online.py; fi'}}"
        ],
        "path": "app"
      }
    },
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "app",
        message: [
          "uv pip install pip",
          "uv pip install cmake ninja",
          "uv pip install numpy==1.26.4 pydantic==2.12.5",
          "uv pip install fastapi==0.117.1 uvicorn[standard] huggingface_hub==0.25.1",
          "uv pip install onnxruntime-gpu==1.16.3 pycuda==2024.1.2",
          "uv pip install -r requirements.txt --prerelease=allow"
        ]
      }
    },
    {
      method: "script.start",
      params: {
        uri: "torch.js",
        params: {
          venv: "env",
          path: "app",
          xformers: true,
          triton: true,
          sageattention: true,
          flashattention: true
        }
      }
    },
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "app",
        message: [
          "python tools/download_weights.py"
        ]
      }
    }
  ]
}