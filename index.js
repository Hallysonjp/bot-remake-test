
const venom = require('venom-bot');
venom
  .create().then((client) => start(client)).catch((erro) => {
    console.log(erro);
  });
var instantiated_user = {};  
var jsonArr = {};
var jsonMsgStages = {
                      '0':'inicio.',
                      '1':'marcacao_exames',                      
                      '2':'resultado_exames',
                      '3':'cancelamento_exames',
                      '4':'acompanhamento_de_solicitacao',
                      '5':'alterar_dados_cadastrais',
                      '6':'sugestao',
                      '7':'confirma_sugestao',
                      '8':'sugestao_confirmada',
                      '9':'reclamacao',
                      '10':'confirma_reclamacao',
                      '11':'denunciar_fraude',
                      '12':'confirmar_fraude',
                      '13':'nota_atendimento',
                      '14':'confirmar_nota_atendimento'
                    };

                    /**s
                     * 1 = Inicio do Pedido 
                     * 2 = Novo item no pedido
                     */
function showSummary(client,message){
  
  if(instantiated_user[message.from]){
  var resumo = 'Resumo do pedido:\n';
   resumo = resumo + 'Produto(s):\n';


   var qtdMsgs = instantiated_user[message.from].option_selected.length;      
     
      var i = 0;
      for (; i < qtdMsgs; ++i) {
        if(instantiated_user[message.from].option_selected[i].id_product != '0'){
         var item = instantiated_user[message.from].option_selected[i].father;          
          resumo = resumo + '*'+item.substring(5) +'\n';
        }else if(instantiated_user[message.from].option_selected[i].father == 'endereco'){
            var endereco = instantiated_user[message.from].option_selected[i].selected;
        }else if(instantiated_user[message.from].option_selected[i].father == 'forma_pgto'){          
          var pagamento = instantiated_user[message.from].option_selected[i].selected;
        }else if(instantiated_user[message.from].option_selected[i].father == 'troco'){          
          var troco = instantiated_user[message.from].option_selected[i].selected;
        }            
      }       
      resumo = resumo + 'Endereço para entrega\n';
      resumo = resumo + '*'+endereco+'*' +'\n';

      resumo = resumo + 'Forma de Pagamento\n';
      resumo = resumo + '*'+pagamento+'*' +'\n';
      if(troco){
        resumo = resumo + 'Valor para troco\n';
        resumo = resumo + '*'+troco+'*' +'\n';
      }
      resumo = resumo + ' \nConfirma o pedido *S* ou *N*?';
      
     

  //produtosResumo = (produtosResumo +"\n*" +value.produto.slice(5));

  console.log(instantiated_user[message.from].option_selected);
  client.sendText(message.from, resumo) ; 
  }
   
  
}                    

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
     if(retornoMsg != 'undefined'){
      client.sendText(message.from, retornoMsg) ;   
     }
     
    }else{
      console.log('retornou erro do banco !');
     client.sendText(message.from, error) ;
    }
  }            
  request(options, callback);
/****** */
}
function setStage(user,stage) { 
  if (instantiated_user[user]) {
    instantiated_user[user] = {
      stage: stage
   };
  }
}
function getStage(user,stage) { 
  if (instantiated_user[user]) {
      //Se existir esse numero no banco de dados
      if(!stage){
        stage = 0;
      }
   
      instantiated_user[user].stage = stage;

      return instantiated_user[user].stage;
  } else {
      //Se for a primeira vez que entra e contato
      instantiated_user[user] = {
        user: user,
        stage: 0,
        father: 0
    };      
      return instantiated_user[user].stage;
  }
}

function start(client) {
  
  client.onMessage((message) => {

    if (message.body.toUpperCase() === 'SAIR' && message.isGroupMsg === false) {
      client.sendText(message.from, 'Foi um *prazer* falar com vc, estou aqui a sua disposição *:)*');     
      
      instantiated_user[message.from].stage = '0';
      instantiated_user[message.from].father = '0';
      instantiated_user[message.from].option_stage = '';              
      instantiated_user[message.from].option_selected = '';              
    }else{ 
      if (typeof instantiated_user[message.from] == "undefined") {
        getStage([message.from]); 
      }
      if(instantiated_user[message.from].stage == '0'){  
       // returnsOptions(client,message,'13');
       client.sendText(message.from, "Seja Bem Vindo(a) ao sistema SAUDE ON da *PREFEITURA* . Será um prazer atendê-lo(a)\n\nCom qual destas opções eu posso te ajudar?\n1 - Marcação de Exames\n2 - Resultado de Exames\n3- Cancelamento de Exames\n4- Acompanhamento de solicitação\n5- Alterar dados cadastrais\n6- Sugestão\n7- Reclamação\n8- Denunciar fraude\n9- Nota do atendimento\n\nPor favor digite somente o número referente a opção desejada.");          
        instantiated_user[message.from].stage = '1';  
      }else if(instantiated_user[message.from].stage == '1'){
        
        if(message.body.toUpperCase() === '6' && message.isGroupMsg === false) {
          client.sendText(message.from, 'Tudo bem, informe por favor *sua sugestão!*');
          instantiated_user[message.from].stage = '6'; 
        }else if(message.body.toUpperCase() === '7' && message.isGroupMsg === false) {
          client.sendText(message.from, 'Tudo bem, informe por favor *sua reclamação!*');
          instantiated_user[message.from].stage = '9'; 
        }else if(message.body.toUpperCase() === '8' && message.isGroupMsg === false) {
          client.sendText(message.from, 'Tudo bem, informe por favor a *fraude* que deseja denunciar.');
          instantiated_user[message.from].stage = '11'; 
        }else if(message.body.toUpperCase() === '9' && message.isGroupMsg === false) {
          client.sendText(message.from, 'Tudo bem, informe por favor sua *nota de atendimento*.');
          instantiated_user[message.from].stage = '13'; 
        }else if(message.body.toUpperCase() === '2' && message.isGroupMsg === false) {
          client.sendText(message.from, 'Tudo bem, informe *seu CPF* por favor:');
          instantiated_user[message.from].stage = '15'; 
        }


      }else if(instantiated_user[message.from].stage == '2'){
      }else if(instantiated_user[message.from].stage == '3'){  
        if(message.body.toUpperCase() === 'S' && message.isGroupMsg === false) {
          client.sendText(message.from, 'Tudo bem, pode informar o *código do produto*:');
          instantiated_user[message.from].stage = '2'; 
        }else if(message.body.toUpperCase() === 'N' && message.isGroupMsg === false) {
          client.sendText(message.from, 'Certo, informe agora o seu *endereço de entrega* 📌 por favor:');
          instantiated_user[message.from].stage = '4'; 
        }else{
          client.sendText(message.from, "Ops, não entendi sua opção selecionada 😅\nSelecione uma das opções (*S ou N*)");
        }
      }else if(instantiated_user[message.from].stage == '4'){ 
        if (message.body != '' && message.isGroupMsg === false) {
          endereco = message.body;
          client.sendText(message.from, '*'+message.body+'*'+'\nConfirma o endereço informado *S* ou *N*?');
          instantiated_user[message.from].endereco = endereco; 
          instantiated_user[message.from].stage = '5'; 
        }
      }else if(instantiated_user[message.from].stage == '5'){ 

      }else if(instantiated_user[message.from].stage == '6'){ 

        if (message.body != '' && message.isGroupMsg === false) {
          endereco = message.body;
          client.sendText(message.from, 'Sugestão:\n*'+message.body+'*'+'\nConfirma o texto como sua sugestão *S* ou *N*?');          
          instantiated_user[message.from].stage = '7'; 
        }

      }else if(instantiated_user[message.from].stage == '7'){         
        
        if(message.body.toUpperCase() === 'S' && message.isGroupMsg === false) {
          client.sendText(message.from, 'Certo, vou enviar sua sugestão para o setor responsável\n *obrigado*');
          instantiated_user[message.from].stage = '8'; 
        }else if(message.body.toUpperCase() === 'N' && message.isGroupMsg === false) {
          client.sendText(message.from, 'Certo, informe novamente *sua sugestão* por favor:');
          instantiated_user[message.from].stage = '7'; 
        }

      }else if(instantiated_user[message.from].stage == '8'){ 
        client.sendText(message.from, 'Sugestão enviada, caso precise de mais algum serviço basta falar comigo que *estou aqui a sua disposição* *:)*');         
        instantiated_user[message.from].stage = '0';
        instantiated_user[message.from].father = '0';
        instantiated_user[message.from].option_stage = '';              
        instantiated_user[message.from].option_selected = '';

      }else if(instantiated_user[message.from].stage == '9'){ 
        if (message.body != '' && message.isGroupMsg === false) {
          endereco = message.body;
          client.sendText(message.from, 'Reclamação:\n*'+message.body+'*'+'\nConfirma o texto como sua reclamação *S* ou *N*?');          
          instantiated_user[message.from].stage = '10'; 
        }
      }else if(instantiated_user[message.from].stage == '10'){         
        
        if(message.body.toUpperCase() === 'S' && message.isGroupMsg === false) {
          client.sendText(message.from, 'Certo, sua *reclamação* foi enviada para o setor responsável.\nCaso precise de mais algum serviço basta falar comigo que *estou aqui a sua disposição* *:)*');
          instantiated_user[message.from].stage = '0';
          instantiated_user[message.from].father = '0';
          instantiated_user[message.from].option_stage = '';              
          instantiated_user[message.from].option_selected = '';
        }else if(message.body.toUpperCase() === 'N' && message.isGroupMsg === false) {
          client.sendText(message.from, 'Certo, informe novamente *sua reclamação* por favor:');
          instantiated_user[message.from].stage = '9'; 
        }

      }else if(instantiated_user[message.from].stage == '11'){ 

        if (message.body != '' && message.isGroupMsg === false) {
          endereco = message.body;
          client.sendText(message.from, 'Fraude:\n*'+message.body+'*'+'\nConfirma o texto como sua *denuncia de fraude* *S* ou *N*?');          
          instantiated_user[message.from].stage = '12'; 
        }

      }else if(instantiated_user[message.from].stage == '12'){         
        
        if(message.body.toUpperCase() === 'S' && message.isGroupMsg === false) {
          client.sendText(message.from, 'Certo, sua *denuncia de faude* foi enviada para o setor responsável.\nCaso precise de mais algum serviço basta falar comigo que *estou aqui a sua disposição* *:)*');
          instantiated_user[message.from].stage = '0';
          instantiated_user[message.from].father = '0';
          instantiated_user[message.from].option_stage = '';              
          instantiated_user[message.from].option_selected = '';
        }else if(message.body.toUpperCase() === 'N' && message.isGroupMsg === false) {
          client.sendText(message.from, 'Certo, informe novamente *sua denuncia de faude* por favor:');
          instantiated_user[message.from].stage = '11'; 
        }

      }else if(instantiated_user[message.from].stage == '13'){ 

        if (message.body != '' && message.isGroupMsg === false) {
          endereco = message.body;
          client.sendText(message.from, 'Nota:\n*'+message.body+'*'+'\nConfirma sua *nota*\n *S* ou *N*?');          
          instantiated_user[message.from].stage = '14'; 
        }

      }else if(instantiated_user[message.from].stage == '14'){         
        
        if(message.body.toUpperCase() === 'S' && message.isGroupMsg === false) {
          client.sendText(message.from, 'Certo, sua *nota* foi enviada para o setor responsável.\nCaso precise de mais algum serviço basta falar comigo que *estou aqui a sua disposição* *:)*');
          instantiated_user[message.from].stage = '0';
          instantiated_user[message.from].father = '0';
          instantiated_user[message.from].option_stage = '';              
          instantiated_user[message.from].option_selected = '';
        }else if(message.body.toUpperCase() === 'N' && message.isGroupMsg === false) {
          client.sendText(message.from, 'Certo, informe novamente *sua nota* por favor:');
          instantiated_user[message.from].stage = '13'; 
        }

      }else if(instantiated_user[message.from].stage == '15'){    

        if(message.body.toUpperCase() === '04627211406' && message.isGroupMsg === false) {
          client.sendText(message.from, '*Cadastro Localizado :)*\n Olá Tiago Wanderley, segue a lista dos exames disponíveis:\n\n*1* - ULTRASSONOGRAFIA DA PRÓSTATA\n\nDigite o número do exame que deseja.');
          instantiated_user[message.from].stage = '16'; 
        }else{
          client.sendText(message.from, "Ops, *não localizei* seu cadastro 😅\ninforme seu cpf!");
        }

      }else if(instantiated_user[message.from].stage == '16'){    

        if(message.body.toUpperCase() === '1' && message.isGroupMsg === false) {
          client.sendText(message.from, '*Segue o exame*');
         // client.sendFileFromBase64(message.from,base64PDF,'./ultrasom_tiago.pdf');
         client.sendFile(message.from,'./ultrasom_tiago.pdf','Ultrassom Tiago Wanderley','ultrassom');
         client.sendText(message.from, 'Espero te ajudado, qualquer coisa, estamos a sua disposição 👍');
         instantiated_user[message.from].stage = '0';
         instantiated_user[message.from].father = '0';
         instantiated_user[message.from].option_stage = '';              
         instantiated_user[message.from].option_selected = ''; 
          
        }else{
          client.sendText(message.from, "Ops, não localizei seu cadastro 😅\nVerifique se digitou corretamente *seu CPF*");
        }
      
        

      }
    }    
   
  });
}