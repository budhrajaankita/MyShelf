// pages/index.js
import React from 'react';
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link';
import { Button, Box, Typography, Container, Card, CardContent } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import '../styles/globals.css';

// import * as THREE from "three";
// import BIRDS from "vanta/dist/vanta.birds.min.js";

const interFontLink = (
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
  />
);

const theme = createTheme({
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0bec5',
    },
  },
});

const LandingPage = () => {

  // const [vantaEffect, setVantaEffect] = useState(0);
  // const vantaRef = useRef(null);

  // useEffect(() => {
  //   if (!vantaEffect) {
  //     setVantaEffect(
  //       BIRDS({
  //         el: vantaRef.current,
  //         THREE: THREE,
  //         mouseControls: true,
  //         touchControls: true,
  //         gyroControls: false,
  //         minHeight: 200.00,
  //         minWidth: 200.00,
  //         scale: 1.00,
  //         scaleMobile: 1.00,
  //         color1: 0xe0e1e5,
  //         birdSize: 0.90
  // //         mouseControls: true,
  // //         touchControls: true,
  // //         gyroControls: false,
  // //         minHeight: 200.00,
  // //         minWidth: 200.00,
  // //         scale: 1.00,
  // //         scaleMobile: 1.00,
  // //         points: 12.00,
  // //         maxDistance: 18.00,
  // //         showDots: false,
  // //         color: 0xbbcad0,
  // // backgroundColor: 0x0,
  //       })
  //     );
  //   } 
  
    
  //   return () => {
  //     if (vantaEffect) vantaEffect.destroy();
  //   };
  // }, [vantaEffect]);

  return (
    <ThemeProvider theme={theme}>
      {interFontLink}
      {/* ref={vantaRef} */}
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
      <Container maxWidth="md" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <Typography variant="h2" sx={{ color: 'primary.main', fontStyle: 'bold',mb: 4 }}>
          Welcome to MyShelf
        </Typography>
        <Typography variant="h5" sx={{ color: 'text.secondary', mb: 4 }}>
          Your smart inventory management solution.
        </Typography>
        <Card sx={{ bgcolor: 'background.paper', p: 3, mb: 4, width: '100%' }}>
          <CardContent>
            <Typography variant="body1" sx={{ mb: 2 }}>
            Effortlessly keep track of your inventory and receive personalized recipe suggestions. Join the movement to reduce food waste by making the most of your groceries before they expire. With MyShelf, you will never run out of essentials again!
            </Typography>
            <Link href="/app" passHref>
              <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                Get Started
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Box sx={{ mt: 20 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            © 2024 MyShelf. All rights reserved.
          </Typography>
        </Box>
      </Container>
      </Box>
    </ThemeProvider>
  );
};

export default LandingPage;
// // pages/index.js
// import React from 'react';
// import Link from 'next/link';
// import { Button, Box } from '@mui/material';
// import { createTheme, ThemeProvider } from '@mui/material/styles';
// import '../styles/globals.css';

// const interFontLink = (
//   <link
//     rel="stylesheet"
//     href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
//   />
// );


// const theme = createTheme({
//   typography: {
//     fontFamily: 'Inter, sans-serif',
//   },
//   palette: {
//     mode: 'dark',
//     primary: {
//       main: '#1976d2',
//     },
//     secondary: {
//       main: '#f50057',
//     },
//     background: {
//       default: '#121212',
//       paper: '#1e1e1e',
//     },
//     text: {
//       primary: '#ffffff',
//       secondary: '#b0bec5',
//     },
//   },
// });

// const style = {
//   border: '1px solid #ddd',
//   borderRadius: '8px',
//   padding: '16px',
//   marginTop: '16px',
// };

// const LandingPage = () => {
//   return (
//     <ThemeProvider theme={theme}>
//       <Box sx={{ 
//         bgcolor: 'background.default', 
//         minHeight: '100vh', 
//         display: 'flex', 
//         flexDirection: 'column', 
//         alignItems: 'center', 
//         justifyContent: 'center'
//       }}>
//         <Link href="/app" passHref>
//           <Button variant="contained" color="primary">
//             Get Started
//           </Button>
//         </Link>
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default LandingPage;
