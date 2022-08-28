
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
            let gcCond = await this.considerations(i);

            if( gcCond.length == 0)
            {
                if(await this.isActionLegal(this.Actions[i], []))
                {
                    choices.push(this.Actions[i])
                    this.params.push([])
                }
            }
            else
            {
                
                for(let j = 0;j<gcCond.length;j++)
                {
                    
                    let isLegal = await this.isActionLegal(this.Actions[i], gcCond[j]);
                    if(isLegal)
                    {
                        choices.push(this.Actions[i])
                        this.params.push(gcCond[j])

                    }
                }
            }
        }
        
        return choices
    }