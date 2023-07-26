const { age, date } = require('../../lib/utils')

module.exports = {
    index(req, res){
        return res.render('members/index' )
    },
    create(req, res){
        return res.render('members/create')
    },
    post(req, res){
        //realizando uma estrutura de validação
        const keys = Object.keys(req.body)//o keys criou um array com as chaves dos objetos

        for(key of keys){
            if (req.body[key] == ""){
                return res.send('Please, fill all fields') 
            }
        }


        return
        
    },
    show(req, res){
        return
    },
    edit(req, res){
        return
    },
    put(req, res){
        const keys = Object.keys(req.body)

        for(key of keys){
            if (req.body[key] == ""){
                return res.send('Please, fill all fields') 
            }
        }

        return
    },
    delete(req, res){
        return
    },
}