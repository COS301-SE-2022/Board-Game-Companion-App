
    Actions = [
        //actionnums
    ]

    //actions

    //actioncond


    params = []
    async chooseAction(choice, p)
    {
        switch(choice)
        {
            //action cases
        }
        
        
    }
    async isActionLegal(choice, p)
    {
        switch(choice)
        {
            //condition cases
            
        }
        
        return false;
    }

    async considerations(choice)
    {
        
        switch(choice)
        {
            //considerations cases
        }
        
        return [];
    }
    async generateChoices()
    {
        this.params = []
        let choices =[]
        
        for(let i = 0;i<this.Actions.length;i++)
        {
            

            if(await this.considerations(i) == [])
            {
                if(await this.isActionLegal(Actions[i], []))
                {
                    choices.push(Actions[i])
                    this.params.push([])
                }
            }
            else
            {
                
                for(let j = 0;j<await this.considerations(i).length;j++)
                {
                    
                    
                    if(await this.isActionLegal(Actions[i], await this.considerations(i)[j]))
                    {
                        choices.push(Actions[i])
                        this.params.push(await this.considerations(i)[j])

                    }
                }
            }
        }
        
        return choices
    }