const express = require('express'), 
bodyParser = require('body-parser'),
{MongoClient} = require('mongodb'),
ObjectId = require('mongodb').ObjectId

const app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

const client = new MongoClient('mongodb+srv://rauatorres:instagramclone123@instagram-clone.mcqkwwi.mongodb.net/?retryWrites=true&w=majority')

async function conectarAoBancodeDados(){
  await client.connect()
  const db = client.db('instagram-clone'),
            postagens = db.collection('postagens')
  
  app.get('/', (req, res)=>{
    res.send({msg: 'Olá!'})
  })
  
  app.post('/api', async (req, res)=>{
    let dados = req.body
    try{
      let postagemInserir = await postagens.insertOne(req.body)
      res.json(postagemInserir)
    }catch (err){
      console.error(err)
      res.status(500).json({error: "erro ao inserir postagem"})
    }
  })
  
  app.get('/api', async (req, res)=>{
    try{
      let postagensRes = await postagens.find().toArray()
      res.json(postagensRes)
    }catch (err){
      console.error(err)
      res.status(500).json({error: "erro ao retornar postagens"})
    }
  })
  
  app.get('/api/:id', async (req, res)=>{
    try{
      let postagemRes = await postagens.find({_id: new ObjectId(req.params.id)}).toArray()
      res.json(postagemRes)
    }catch (err){
      console.error(err)
      res.status(500).json({error: "erro ao retornar postagem"})
    }
  })
  
  app.put('/api/:id', async (req, res)=>{
    try{
      let postagensAtt = await postagens.updateMany({_id: new ObjectId(req.params.id)}, {$set: req.body})
      res.json(postagensAtt)
    }catch (err){
      console.error(err)
      res.status(500).json({error: "erro ao atualizar postagem"})
    }
  })
  
  app.delete('/api/:id', async (req, res)=>{
    try{
      let postagemDel = await postagens.deleteMany({_id: new ObjectId(req.params.id)})
      res.json(postagemDel)
    }catch (err){
      console.error(err)
      res.status(500).json({error: "erro ao deletar postagem"})
    }
  })
  
  app.listen(3000)
  console.log('Server iniciado com sucesso')
}

conectarAoBancodeDados()
process.on('SIGINT', async ()=>{
  await client.close()
  process.exit()
})