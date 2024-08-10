// 'use client'

import { useState, useEffect, useRef } from 'react'
import {firestore, app, storage} from '../firebase'
import Link from 'next/link';
import { useRouter } from 'next/router';


import {
  collection,
  getFirestore,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'

import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { pink } from '@mui/material/colors';
import { Box, Stack, Typography, Button, TextField, Container, Paper } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
// import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import RecipeSuggestions from './recipeSuggestions';
import {Camera} from "react-camera-pro";

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

const style = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '16px',
  marginTop: '16px',
};


const App = () => {

  const router = useRouter();


    const goToRecipeSuggestions = () => {
      navigate('/recipeSuggestions');
    };

  const [inventory, setInventory] = useState([]);
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState();
  const [expirationDate, setExpirationDate] = useState('');
  const [notes, setNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredInventory, setFilteredInventory] = useState([]);


  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({ id: doc.id, ...doc.data() });
    });
    setInventory(inventoryList);
    setFilteredInventory(inventoryList);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const addItem = async () => {
    // Check if itemName and quantity are provided
    if (!itemName.trim()) {
      alert('Item name is required.');
      return;
    }
    if (!quantity || quantity <= 0) {
      alert('Quantity is required and must be greater than 0.');
      return;
    }
  
    const docRef = doc(collection(firestore, 'inventory'), itemName);
    await setDoc(docRef, { quantity, expirationDate, notes });
    setItemName(''); // Clear input after adding
    setQuantity(0);
    setExpirationDate('');
    setNotes('');
    await updateInventory();
  };
  

  const removeItem = async (id) => {
    const docRef = doc(collection(firestore, 'inventory'), id);
    await deleteDoc(docRef);
    await updateInventory();
  };

  const [showCamera, setShowCamera] = useState(false);
  const [image, setImage] = useState(null);
  const camera = useRef(null);
  const [facingMode, setFacingMode] = useState('environment');


  const openCamera = () => {
    setShowCamera(true);
  };

  const closeCamera = () => {
    setShowCamera(false);
  };
  // const openCamera = async () => {
  //   const camera = useRef(null);
  //   const [image, setImage] = useState(null);
  //   console.log("Camera loading...")
  //   setImage(camera.current.takePhoto())
  //   };

  const handleSearch = (e) => {
    console.log("search query");
    console.log(e);
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = inventory.filter(item =>
      item.id.toLowerCase().includes(term) ||
      item.notes.toLowerCase().includes(term)
    );
    console.log(filtered);
    // setInventory(filtered);
    setFilteredInventory(filtered);

  };

  const recognizeImage = async (imageData) => {
    try {

      const response = await fetch('/api/recognize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageData }),
      });
      // console.log("client recognize");
  
      if (!response.ok) {
        throw new Error('Image recognition failed');
      }
  
      const data = await response.json();
      // console.log(data)
      if (data.labels && data.labels.length > 0) {
        setItemName(data.labels[0]);
      }
    } catch (error) {
      console.error('Error recognizing image:', error);
    }
  };


  const handleTakePhoto = async () => {
    const imageData = camera.current.takePhoto();
    setImage(imageData);
    closeCamera();
    // console.log('%c ', `font-size: 100px; background: url(${imageData}) no-repeat; background-size: contain;`);
    console.log("clicked pic")

    await recognizeImage(imageData);

    console.log('Image processed successfully');

    setImage();
  }

  const handleRecipes = () => {
    router.push({
      pathname: '/recipeSuggestions',
      query: { inventory: JSON.stringify(inventory) },
    });
  };

  console.log(inventory);

  
  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {interFontLink}
        {/* <Paper elevation={3} sx={{ p: 4 }}> */}
        <Box textAlign="center" mb={5}>
          <Typography variant="h4" component="h1" gutterBottom>
            Your <Box 
              component="span" 
              sx={{ 
                color: '#87CEFA',
                fontWeight: 'bold',
                // textDecoration: 'underline',
                // textUnderlineOffset: '3px'
              }}
            >
              shelf
            </Box>, yourself, made simple.
          </Typography>
          <Typography variant="h5" color="text.secondary">
            {/* made simple. */}
          </Typography>
        </Box>
          {/* <Typography variant="h5" align="center" gutterBottom>
            Your <span style={{ color: '#87CEFA' }}>shelf</span>, yourself, made simple!
          </Typography> */}
          {/* <Stack spacing={2} sx={{ mb: 2 }}> */}
          <Stack direction={isMobile ? 'column' : 'row'} spacing={2} sx={{ mb: 2, mt:10, alignItems: 'center' }}>

          {/* <Stack direction="row" spacing={2} sx={{ mb: 6, marginTop:6, alignItems: 'center' }}> */}

            <TextField
              id="item-input"
              label="Item Name"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              inputProps={{
                autoCapitalize: 'words',
                autoCorrect: 'on'
              }}
            />
            <TextField
              id="quantity-input"
              label="Quantity"
              variant="outlined"
              type="number"
              fullWidth
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              inputProps={{
                style: { 
                  WebkitAppearance: 'none',
                  MozAppearance: 'textfield'
                }
              }}
              sx={{
                '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                  WebkitAppearance: 'none',
                  margin: 0,
                },
              }}
            />
            <TextField
              id="expiration-date-input"
              label="Expiration Date"
              variant="outlined"
              type="date"
              fullWidth
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              id="notes-input"
              label="Notes"
              variant="outlined"
              fullWidth
              // multiline
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={addItem}
              sx={{ mr: 2 }}
            >
              Add+
            </Button>
            <CameraAltIcon fontSize="large" onClick={openCamera} sx={{ color: "primary" }} />
            </Box>
      </Stack>

      {showCamera && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
          <Camera ref={camera} facingMode={facingMode} aspectRatio={16 / 9} onError={(error) => {
          if (error === 'noCameraAccessible' && facingMode === 'environment') {
            setFacingMode('user'); }}// Fallback to front camera
          }/>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleTakePhoto}

            // onClick={() => {
            //   setImage(camera.current.takePhoto());
            //   closeCamera();
            // }}
            sx={{ mt: 2, mb:2 }}
          >
            Take Photo
          </Button>
        </Box>
      )}

      {image && (
        <Box sx={{ mt: 2, mb:2, textAlign: 'center' }}>
          <Typography variant="h6">Taken Photo:</Typography>
          <img src={image} alt="Taken photo" style={{ maxWidth: '100%', height: 'auto' }} />
        </Box>
      )}
    {/* </div> */}
          <TextField
            id="search-input"
            label="Search in your Shelf"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={handleSearch}
            // sx={{ mb: 2 }}
          />

          {/* <Link href={`/recipeSuggestions?inventoryItems=${inventory}`} passHref> */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4, mt:4 }}>

            <Button variant="contained" color="primary" onClick={handleRecipes}>
              View Recipe Suggestions
            </Button>
            </Box>
          {/* </Link> */}
           {/* <Button variant="contained" color="primary" onClick={goToRecipeSuggestions}> */}
        {/* View Recipe Suggestions */}
      {/* </Button> */}
          {/* <RecipeSuggestions inventoryItems={inventory} /> */}


          <Box sx={style}>
            <Typography variant="h5" color="text.primary" textAlign="center" gutterBottom>
              Inventory Items
            </Typography>
            <Stack spacing={2} sx={{ maxHeight: 300, overflow: 'auto' }}>
              {filteredInventory.map(({ id, quantity, expirationDate, notes }) => (
                <Box
                  key={id}
                  sx={{
                    width: '100%',
                    minHeight: 80,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    bgcolor: '#1e1e1e',
                    p: 2,
                    borderRadius: 1,
                    boxShadow: 1,
                  }}
                >
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" color="text.primary">
                      {id.charAt(0).toUpperCase() + id.slice(1)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Quantity: {quantity} | Expiration: {expirationDate} | Notes: {notes}
                    </Typography>
                  </Box>
                  <DeleteOutlined fontSize='medium' onClick={() => removeItem(id)} sx={{ color: pink[500] }} />

                  {/* <Button variant="contained" color="secondary" onClick={() => removeItem(id)}> */}
                    {/* Remove */}
                  {/* </Button> */}
                </Box>
              ))}
            </Stack>
          </Box>
        {/* </Paper> */}
      </Container>
    </ThemeProvider>
  );
}

export default App;
