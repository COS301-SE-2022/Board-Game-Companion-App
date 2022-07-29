let hiddenValue = false;
let hiddenInputValue = 0;


function clickButtonForInput()
{
	hiddenValue = true;
	let inputElement = document.getElementById("inputBox");
    if(inputElement)
    {
        hiddenInputValue = inputElement.value
    }
}


function input(message)
{
    
    output(message)
	hiddenValue = false;

    let inputElement = document.getElementById("inputBox");
    let button = document.getElementById("EnterButton");

    if(inputElement)
    {
        
        //Eventlistener
        button.addEventListener("click", clickButtonForInput)
        //wait
        while(!hiddenValue)
		{
			sleep(1000);
		}
        button.removeEventListener("click", clickButtonForInput);
        hiddenValue = false;
        return hiddenInputValue

    }
    else
    {
        return console_Input(message)
    }
    
}