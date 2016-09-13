express = require('express')
app = express()

app.get '/', (req, res) ->
  res.send (JSON.stringify {
    name: "Friendathlon"
    })

app.listen 3000, ->
  console.log 'Example app listening on port 3000!'
