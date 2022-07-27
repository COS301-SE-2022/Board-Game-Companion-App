
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
        choices =[]
        for(let i = 0;i<this.Actions;i++)
        {
            if(considerations(i) == [])
            {
                if(this.isActionLegal(i, []))
                {
                    choices.push(i)

                }
                else
                {
                    for(let j = 0;j<considerations(i);j++)
                    {
                        if(this.isActionLegal(i, considerations(i)[j]))
                        {
                            choices.push(i)

                        }
                    }
                }
            }
            else
            {

            }
        }
        
        
    }