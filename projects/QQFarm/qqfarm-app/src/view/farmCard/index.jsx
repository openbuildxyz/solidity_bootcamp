import * as React from 'react';
import Card from '@mui/joy/Card';
import CardCover from '@mui/joy/CardCover';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import { Pets } from '@mui/icons-material';

export default function FarmCard() {
  return (
    <Card sx={{ minHeight: '140px', width: 160 }}>
      <CardCover>
        <img
          src="pics/dog.png"
          loading="lazy"
          alt=""
        />
      </CardCover>
      <CardCover
        sx={{
          background:
            'linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0) 200px), linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0) 300px)',
        }}
      />
      <CardContent sx={{ justifyContent: 'flex-end' }}>
        <Typography level="title-lg" textColor="#fff">
          小汪汪
        </Typography>
        <Typography
          startDecorator={<Pets />}
          textColor="neutral.300"
        >
          心情不好,需要摸摸
        </Typography>
      </CardContent>
    </Card>
  );
}
