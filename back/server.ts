import express from 'express'
import cors from 'cors'
import multer from 'multer'
import csvToJson from 'convert-csv-to-json'

const app = express()
const port = process.env.PORT ?? 3000

const storage = multer.memoryStorage()
const upload = multer({storage})

let userData: Array<Record<string, string>> = []


app.use(cors())

app.post('/api/files', upload.single('file'), async (req,res) => {
    const {file} = req
    
    if (!file) {
        return res.status(500).json({ message: 'Debes añadir un archivo'})
    }
    
    if(file.mimetype !== 'text/csv') {
        return res.status(500).json({message: 'Debe ser la extensión .csv'})
    }
    
    let json: Array<Record<string, string>> = []
    try{
        const rawCsv = Buffer.from(file.buffer).toString('utf-8')
        console.log(rawCsv)

        json = csvToJson.fieldDelimiter(',').csvStringToJson(rawCsv)
    } catch (error) {
        return res.status(500).json({message: 'Error al formatear el archivo'})
    }

    userData = json
    return res.status(200).json({ data: [], message: 'El archivo se cargó correctamente'})
})

app.get('/api/users', async (req,res) => {
    const { q } = req.query

    if(!q) {
        return res.status(500).json({
            message: 'Necesita llevar la q'
        })
    }

    const search = q.toString().toLowerCase()
    const filterData = userData.filter((row => {
        return Object
            .values(row)
            .some(value => value.toLowerCase().includes(search))
    }))

    return res.status(200).json({ data: filterData})
})

app.listen(port, () => {
    console.log(`Server runing at ${port} port`)
})