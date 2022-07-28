
    Actions = [
        //actionnums
    ]

    //actions

    //actioncond


    params = []
    chooseAction(choice, p)
    {
        switch(choice)
        {
            //action cases
        }
        
        
    }
    isActionLegal(choice, p)
    {
        switch(choice)
        {
            //condition cases
            
        }
        
        return false;
    }

    considerations(choice)
    {
        
        switch(choice)
        {
            //considerations cases
        }
        
        return [];
    }
    generateChoices()
    {
        this.params = []
        let choices =[]
        
        for(let i = 0;i<this.Actions.length;i++)
        {
            

            if(this.considerations(i) == [])
            {
                if(this.isActionLegal(i, []))
                {
                    choices.push(i)
                    this.params.push([])
                }
            }
            else
            {
                
                for(let j = 0;j<this.considerations(i).length;j++)
                {
                    
                    
                    if(this.isActionLegal(i, this.considerations(i)[j]))
                    {
                        choices.push(i)
                        this.params.push(this.considerations(i)[j])

                    }
                }
            }
        }
        
        return choices
    }