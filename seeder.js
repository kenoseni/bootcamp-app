const fs = require('fs');
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const colors = require('colors')

// Load env vars
dotenv.config({ path: './config/config.env' })

// Load models
const Bootcamp = require('./models/Bootcamp')

// Connect to DB
const conn = mongoose.connect(process.env.MONGO_URL, { 
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false 
})

// Read JSON files
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`,'utf-8')
)

// Import into DB

const importData = async () => {
  try {
    await Bootcamp.create(bootcamps)

    console.log('Data Imported...'.green.inverse)
    process.exit()
  } catch (err) {
    console.error(err)
  }
}

// Delete Data
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany()

    console.log('Data Destroyed...'.red.inverse)
    process.exit()
  } catch (err) {
    console.error(err)
  }
}

if (process.argv[2] === '-i') {
  importData()
}else if (process.argv[2] === '-d') {
  deleteData()
}
