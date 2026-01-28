// JavaScript Example: Reading Entities
// Filterable fields: name, type, country, year, denomination, currency, condition, purchase_price, current_value, purchase_date, front_image, back_image, description, description_en, notes, tags, category_id, material, weight, diameter, mint, catalog_number, is_favorite, status
async function fetchCollectibleEntities() {
    const response = await fetch(`https://app.base44.com/api/apps/6979c67072406431bb978653/entities/Collectible`, {
        headers: {
            'api_key': 'ae69e1521ecc4957ae64787f750505b5', // or use await User.me() to get the API key
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    console.log(data);
}

// JavaScript Example: Updating an Entity
// Filterable fields: name, type, country, year, denomination, currency, condition, purchase_price, current_value, purchase_date, front_image, back_image, description, description_en, notes, tags, category_id, material, weight, diameter, mint, catalog_number, is_favorite, status
async function updateCollectibleEntity(entityId, updateData) {
    const response = await fetch(`https://app.base44.com/api/apps/6979c67072406431bb978653/entities/Collectible/${entityId}`, {
        method: 'PUT',
        headers: {
            'api_key': 'ae69e1521ecc4957ae64787f750505b5', // or use await User.me() to get the API key
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
    });
    const data = await response.json();
    console.log(data);
}