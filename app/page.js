'use client'

import { useState, useEffect } from 'react'
import {firestore} from '../firebase' 
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
import { pink } from '@mui/material/colors';
import { Box, Stack, Typography, Button, TextField, Container, Paper } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

// Add Inter font from Google Fonts
const interFontLink = (
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
  />
);

// Create a custom dark theme
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

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(0);
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

  const openCamera = async () => {
    console.log("Camera loading...")
  };

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

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        {interFontLink}
        {/* <Paper elevation={3} sx={{ p: 4 }}> */}
          <Typography variant="h4" align="center" gutterBottom>
            Stay Shelf-Aware
          </Typography>
          {/* <Stack spacing={2} sx={{ mb: 2 }}> */}
          <Stack direction={isMobile ? 'column' : 'row'} spacing={2} sx={{ mb: 2, marginTop:6, alignItems: 'center' }}>

          {/* <Stack direction="row" spacing={2} sx={{ mb: 6, marginTop:6, alignItems: 'center' }}> */}

            <TextField
              id="item-input"
              label="Item Name"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <TextField
              id="quantity-input"
              label="Quantity"
              variant="outlined"
              type="number"
              fullWidth
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
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
            <Button
              variant="contained"
              color="primary"
              onClick={addItem}
            >
              Add+
            </Button>
            <CameraAltIcon fontSize= "large" onClick={() => openCamera()} sx={{ color: "primary" }} />

          </Stack>

          <TextField
            id="search-input"
            label="Search in your Shelf"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={handleSearch}
            sx={{ mb: 2 }}
          />

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

// const style = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: 400,
//   bgcolor: 'white',
//   border: '2px solid #000',
//   boxShadow: 24,
//   p: 4,
//   display: 'flex',
//   flexDirection: 'column',
//   gap: 3,
// }

// export default function Home() {
//   const [inventory, setInventory] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [itemName, setItemName] = useState('');

//   const updateInventory = async () => {
//     const snapshot = await getDocs(query(collection(firestore, 'inventory')));
//     const inventoryList = snapshot.docs.map(doc => ({ 
//       name: doc.id, 
//       ...doc.data() 
//     }));
//     setInventory(inventoryList);
//   };

//   useEffect(() => {
//     updateInventory();
//   }, []);

//   const addItem = async (item) => {
//     try {
//       const docRef = doc(collection(firestore, 'inventory'), item);
//       const docSnap = await getDoc(docRef);
//       if (docSnap.exists()) {
//         const { quantity } = docSnap.data();
//         await setDoc(docRef, { quantity: quantity + 1 });
//       } else {
//         await setDoc(docRef, { quantity: 1 });
//       }
//       await updateInventory();
//     } catch (error) {
//       console.error("Error adding item: ", error);
//       console.error("Error details:", error.code, error.message);
//       // You could also show this error to the user
//       alert(`Failed to add item: ${error.message}`);
//     }
//   };

//   const removeItem = async (item) => {
//     try {
//       const docRef = doc(collection(firestore, 'inventory'), item);
//       const docSnap = await getDoc(docRef);
//       if (docSnap.exists()) {
//         const { quantity } = docSnap.data();
//         if (quantity === 1) {
//           await deleteDoc(docRef);
//         } else {
//           await setDoc(docRef, { quantity: quantity - 1 });
//         }
//       }
//       await updateInventory();
//     } catch (error) {
//       console.error("Error removing item: ", error);
//     }
//   };

//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);


//   return (
//     <Box
//       width="100vw"
//       height="100vh"
//       display={'flex'}
//       justifyContent={'center'}
//       flexDirection={'column'}
//       alignItems={'center'}
//       gap={2}
//     >
//       <Modal
//         open={open}
//         onClose={handleClose}
//         aria-labelledby="modal-modal-title"
//         aria-describedby="modal-modal-description"
//       >
//         <Box sx={style}>
//           <Typography id="modal-modal-title" variant="h6" component="h2">
//             Add Item
//           </Typography>
//           <Stack width="100%" direction={'row'} spacing={2}>
//             <TextField
//               id="outlined-basic"
//               label="Item"
//               variant="outlined"
//               fullWidth
//               value={itemName}
//               onChange={(e) => setItemName(e.target.value)}
//             />
//             <Button
//               variant="outlined"
//               onClick={() => {
//                 addItem(itemName)
//                 setItemName('')
//                 handleClose()
//               }}
//             >
//               Add
//             </Button>
//           </Stack>
//         </Box>
//       </Modal>
//       <Button variant="contained" onClick={handleOpen}>
//         Add New Item
//       </Button>
//       <Box border={'1px solid #333'}>
//         <Box
//           width="800px"
//           height="100px"
//           bgcolor={'#ADD8E6'}
//           display={'flex'}
//           justifyContent={'center'}
//           alignItems={'center'}
//         >
//           <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
//             Inventory Items
//           </Typography>
//         </Box>
//         <Stack width="800px" height="300px" spacing={2} overflow={'auto'}>
//           {inventory.map(({name, quantity}) => (
//             <Box
//               key={name}
//               width="100%"
//               minHeight="150px"
//               display={'flex'}
//               justifyContent={'space-between'}
//               alignItems={'center'}
//               bgcolor={'#f0f0f0'}
//               paddingX={5}
//             >
//               <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
//                 {name.charAt(0).toUpperCase() + name.slice(1)}
//               </Typography>
//               <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
//                 Quantity: {quantity}
//               </Typography>
//               <Button variant="contained" onClick={() => removeItem(name)}>
//                 Remove
//               </Button>
//             </Box>
//           ))}
//         </Stack>
//       </Box>
//     </Box>
//   )
// }
