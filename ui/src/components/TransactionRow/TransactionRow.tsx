import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import { Avatar, CardActionArea } from "@mui/material";


import { userContext } from "../../App";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  quantity: {
    marginRight: theme.spacing(1),
  },
  button: {
    marginLeft: theme.spacing(1),
  },
  buttonText: {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
  textContainer: {
    overflow: 'hidden', 
    whiteSpace: 'nowrap',
    maxWidth: '200px'
  }
}));

interface AssetAccountRowProps {
  symbol: string;
  quantity?: number;
  isIssuer?: boolean;
  issuer: string;
  isShareable?: boolean;
  isFungible?: boolean;
  isAirdroppable?: boolean;
  contractId: string;
  reference: string | null;
  transferType: string;
  owner:string;
  from :string;
  to:string;
  timeStamp:string
}
export const TransferRow: React.FC<AssetAccountRowProps> = React.memo(({
  reference,
  contractId,
  isFungible,
  issuer,
  symbol,
  owner,
  isShareable,
  isAirdroppable,
  transferType,
  from,
  to,
  quantity,
  timeStamp
}) => {
  const classes = useStyles();
  const myPartyId = userContext.useParty();

  

 
  

const formattedDate= new Date(timeStamp).toLocaleString()


  return (
    <>
      <Card sx={{ marginBottom: 1 ,width:700}}>
        <CardActionArea >
          <CardContent className={classes.root}>
            <Avatar sx={{ marginRight: 1 }}>{symbol[0]}</Avatar>
            <div 
            >
              <Typography
                sx={{ fontSize: 14, marginRight: 1, fontWeight: "500", textOverflow: 'ellipsis' }}
                color="text.primary"
              >
                {symbol}
              </Typography>
              
              {transferType==="Airdrop" && from===myPartyId?
              <>
                <Typography
                    
                    sx={{ fontSize: 14 }}
                    color="text.secondary"
                  >
                      
                   You have airdropped {quantity} of {symbol} to:
                  </Typography>
                  <Typography>
                  {to}
                  </Typography>
                  <Typography
                    
                    sx={{ fontSize: 14 }}
                    color="text.secondary"
                  >
                      
                  {formattedDate}
                  </Typography>
              </>
                  :null
                  
                } { to===myPartyId?
                <>
                  <Typography
                     
                      sx={{ fontSize: 14}}
                      color="text.secondary"
                    >
                        
                     You have received {quantity} of {symbol} from:
                    </Typography>
                    <Typography>
                    {to}
                    </Typography>
                    <Typography
                    
                    sx={{ fontSize: 14 }}
                    color="text.secondary"
                  >
                      
                      {formattedDate}
                  </Typography>
              
                </>
                    :null
                    
                  }
                  
                   {transferType==="Send" && from===myPartyId?
                <>
                  <Typography
                      
                      sx={{ fontSize: 14 }}
                      color="text.secondary"
                    >
                        
                     You have sent {quantity} of {symbol} to:
                    </Typography>
                    <Typography>
                    {to}
                    </Typography>
                    <Typography
                    
                    sx={{ fontSize: 14 }}
                    color="text.secondary"
                  >
                      
                      {formattedDate}
                  </Typography>
              </>
                    :null
                    
                  }
            
            </div>
           
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  );
})