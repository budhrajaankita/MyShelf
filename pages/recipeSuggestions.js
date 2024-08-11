import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Button, Typography, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';

const RecipeSuggestions = () => {
  const router = useRouter();
  const [inventoryItems, setInventoryItems] = useState([]);
  const [suggestedRecipes, setSuggestedRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (router.query.inventory) {
      const inventory = JSON.parse(router.query.inventory);
      setInventoryItems(inventory);
    }
  }, [router.query.inventory]);

  const fetchRecipes = async () => {
    setLoading(true);
    const ingredients = inventoryItems.map(item => item.id).join(', ');
    const prompt = `Given these ingredients: ${ingredients}, suggest 5-10 recipes I can make. Only list the recipe names and a desccription of how to make it. Exclue all special characters except :.`;

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
          "HTTP-Referer": `${process.env.NEXT_PUBLIC_YOUR_SITE_URL}`,
          "X-Title": `${process.env.NEXT_PUBLIC_YOUR_SITE_NAME}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "meta-llama/llama-3.1-8b-instruct:free",
          "messages": [
            {"role": "user", "content": prompt},
          ],
        })
      });

      const data = await response.json();
      const recipes = data.choices[0].message.content.split('\n').filter(recipe => recipe.trim() !== '');
      setSuggestedRecipes(recipes);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setSuggestedRecipes(['Error fetching recipes. Please try again.']);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (inventoryItems.length > 0) {
      fetchRecipes();
    }
  }, [inventoryItems]);

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Card sx={{ marginTop: 2 }}>
          <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                Suggested Recipes
              </Typography>
            </Box>
            {suggestedRecipes.length > 0 ? (
              <List>
                {suggestedRecipes.map((recipe, index) => (
                  <ListItem key={index} sx={{ borderBottom: '1px solid #ddd' }}>
                    <ListItemText primary={recipe} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body1">No recipes available. Please try again later.</Typography>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

    // <div>
    //   {loading && <CircularProgress sx={{ display: 'block', margin: 'auto' }} />}

    //   {!loading && suggestedRecipes.length > 0 && (
    //     <>
    //       <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Suggested Recipes</Typography>
    //       <List>
    //         {suggestedRecipes.map((recipe, index) => (
    //           <ListItem key={index}>
    //             <ListItemText primary={recipe} />
    //           </ListItem>
    //         ))}
    //       </List>
    //     </>
    //   )}
    // </div>
  // );
// };

export default RecipeSuggestions;