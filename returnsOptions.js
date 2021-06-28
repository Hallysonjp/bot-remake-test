
function returnsOptions(client,message,empresa){
    /****** */     
    
    if(instantiated_user[message.from].option_stage){
      if(instantiated_user[message.from].option_stage.bot[message.body].id){
       instantiated_user[message.from].father = instantiated_user[message.from].option_stage.bot[message.body].id;
  
       // Verificando se propriedade de opção selecionada existe
       if(!instantiated_user[message.from].option_selected) {
        instantiated_user[message.from].option_selected = [];
       }
  
       // Adicioando opções selecionadas no objeto 
       instantiated_user[message.from].option_selected.push({
             father: instantiated_user[message.from].father,
             selected: message.body,
             id_product: instantiated_user[message.from].option_stage.bot[message.body].id_product
       });
  
       if(instantiated_user[message.from].option_stage.bot[message.body].id_product != '0'){
        instantiated_user[message.from].stage = '2';
       }
  
  
       console.log(instantiated_user[message.from].option_selected);
  
  
  
  
  
  
  
  
  
      }  
     }
  
   /*
    if(!!Object.values(jsonArr).length){
     if(jsonArr.bot[message.body].id){
      console.log(jsonArr.bot[message.body].id);
      instantiated_user[message.from].father = jsonArr.bot[message.body].id;
     }  
    }*/  
  
    const request = require('request');           
    const options = {
      url: 'http://127.0.0.1/vamoscontrolar/cafeapi/bot/'+empresa+'/'+instantiated_user[message.from].father,
      headers: {
        'email': 'thyagopabloa@gmail.com',
        'password': '12345678',
        'token' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJsb2NhbGhvc3QiLCJuYW1lIjoiVGh5YWdvIiwiZW1haWwiOiJ0aHlhZ28ucGFibG9AcmVtYWtlc2lzdGVtYXMuY29tLmJyIn0=.PtFGrq5NL1L2A80aj4h6lNCK8n+7jp2k9YDhFQNWgnM='
      }
    };
    
    function callback(error, response, body) {
      if (!error && response.statusCode == 200) {       
       jsonArr = JSON.parse(body); 
       instantiated_user[message.from].option_stage = jsonArr;
       //instantiated_user[message.from].opcoes_atual = jsonArr; 
          
       var qtdMsgs = jsonArr.bot.length;      
      
       var i = 0;
       var retornoMsg = '';
       for (; i < qtdMsgs; ++i) {
         
         retornoMsg = retornoMsg + '' + jsonArr.bot[i].descr + "\n";      
       }       
       client.sendText(message.from, retornoMsg) ;   
      }else{
        console.log('retornou erro do banco !');
       client.sendText(message.from, error) ;
      }
    }            
    request(options, callback);
  /****** */
  }