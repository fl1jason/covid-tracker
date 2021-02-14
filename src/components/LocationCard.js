import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const LocationCard = (props) =>{

  const { location } = props;

  const useStyles = makeStyles((theme) => ({
    container:{
      width: 600,
    },
    root: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      margin: 'auto',
    },
    paper: {
      padding: theme.spacing(1),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    options: {
      padding: theme.spacing(1),
      textAlign: 'left',
      height:40,
      color: theme.palette.text.secondary,
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
  }));

    const classes = useStyles();
    const bull = <span className={classes.bullet}>•</span>;
    
    return (
    <Card className={classes.root}>
      <CardContent>
        <Typography variant="h5" component="h2">
          {location.msoaName}, {location.regionName}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          NHS Trust: {location.nhsTrustName}
        </Typography>
      </CardContent>
    </Card>
    )
}

export default LocationCard;