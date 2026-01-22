module.exports = {
  daemon: true,
  run: [
    {
      method: "shell.run",
      params: {
        path: "app/webcam/frontend",
        message: "npm install",
        when: "{{!exists('app/webcam/frontend/node_modules')}}"
      }
    },
    {
      method: "shell.run",
      params: {
        path: "app/webcam/frontend",
        message: "npm run build",
        when: "{{!exists('app/webcam/frontend/dist')}}"
      }
    },
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "app",
        message: [
          "python inference_online.py --host 127.0.0.1 --acceleration {{gpu === 'nvidia' ? 'xformers' : 'none'}} --port {{port}}"
        ],
        on: [{
          "event": "/(http:\\/\\/[0-9.:]+)/",
          "done": true
        }]
      }
    },
    {
      method: "local.set",
      params: {
        url: "{{input.event[1]}}"
      }
    }
  ]
}