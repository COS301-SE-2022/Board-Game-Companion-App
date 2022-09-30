let block = true;

setTimeout(()=>{
    block = false;
},3000);

const input = new Promise((resolve,reject)=>{
    
    let interval = setInterval(()=>{
        if(!block){
            clearInterval(interval);
            resolve("Okay");
        }
    },10);
});

async function start(){
    console.log(await input);
    console.log("exit");
}

start();