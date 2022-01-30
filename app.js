require("dotenv").config()
require("express-async-errors")

// extra security packages
const helmet = require("helmet")
const cors = require("cors")
const xss = require("xss-clean")

// Swagger
const swaggerUI = require("swagger-ui-express")
const YAML = require("yamljs")
const swaggerDocument = YAML.load("./swagger.yaml")

const express = require("express")
const app = express()

const connectDB = require("./db/connect")
const productsRouter = require("./routes/products")

const notFoundMiddleware = require("./middleware/not-found")
const errorMiddleware = require("./middleware/error-handler")

//middleware
app.use(express.json())
app.use(helmet())
app.use(cors())
app.use(xss())

//routes
app.get("/", (req, res) => {
  res.send(
    "<h1>Store API</h1><a href='/api/v1/products'>Products route</a><a href='/api-docs'> Documentation</a>"
  )
})

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument))
app.use("/api/v1/products", productsRouter)

//product routes

app.use(notFoundMiddleware)
app.use(errorMiddleware)

const port = process.env.PORT || 3000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, console.log(`Server is listening to port ${port}...`))
  } catch (error) {
    console.log(error)
  }
}

start()
