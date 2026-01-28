# Python Example: Reading Entities
# Filterable fields: name, type, country, year, denomination, currency, condition, purchase_price, current_value, purchase_date, front_image, back_image, description, description_en, notes, tags, category_id, material, weight, diameter, mint, catalog_number, is_favorite, status
import requests

def make_api_request(api_path, method='GET', data=None):
    url = f'https://app.base44.com/api/{api_path}'
    headers = {
        'api_key': 'ae69e1521ecc4957ae64787f750505b5',
        'Content-Type': 'application/json'
    }
    if method.upper() == 'GET':
        response = requests.request(method, url, headers=headers, params=data)
    else:
        response = requests.request(method, url, headers=headers, json=data)
    response.raise_for_status()
    return response.json()

entities = make_api_request(f'apps/6979c67072406431bb978653/entities/Collectible')
print(entities)

# Python Example: Updating an Entity
# Filterable fields: name, type, country, year, denomination, currency, condition, purchase_price, current_value, purchase_date, front_image, back_image, description, description_en, notes, tags, category_id, material, weight, diameter, mint, catalog_number, is_favorite, status
def update_entity(entity_id, update_data):
    response = requests.put(
        f'https://app.base44.com/api/apps/6979c67072406431bb978653/entities/Collectible/{entity_id}',
        headers={
            'api_key': 'ae69e1521ecc4957ae64787f750505b5',
            'Content-Type': 'application/json'
        },
        json=update_data
    )
    response.raise_for_status()
    return response.json()