# Documentação da API - Pokedex Backend

Esta documentação descreve os endpoints da API do Pokedex Backend.

## Convenções Gerais

*   **Formato de Dados:** Todas as requisições e respostas são em `application/json`.
*   **Autenticação:** Alguns endpoints (como os de `PokeTeams`, exceto a busca pública) podem requerer um Bearer Token JWT no header `Authorization` após o login.
*   **Respostas de Erro Comuns:**
    *   `400 Bad Request`: Requisição malformada, dados faltando ou inválidos.
    *   `401 Unauthorized`: Autenticação necessária ou falhou (ex: token inválido ou expirado).
    *   `403 Forbidden`: Autenticado, mas sem permissão para acessar o recurso.
    *   `404 Not Found`: Recurso solicitado não encontrado.
    *   `500 Internal Server Error`: Erro inesperado no servidor.

---

## PokeTeams (`pokeTeam.route.js`)

Endpoints para gerenciar equipes Pokémon.

**Prefixo Base:** `/api/poketeams`

### `POST /api/poketeams`

*   **Descrição:** Cria uma nova equipe Pokémon. Requer autenticação.
*   **Controlador:** `createPokeTeam` (de `pokeTeam.controller.js`)
*   **Parâmetros da Requisição:**
    *   **Request Body** (`application/json`):
        *   `UserId` (string, ObjectId, obrigatório): ID do usuário proprietário da equipe (geralmente obtido do token do usuário autenticado).
            *   *Exemplo:* `"60d0fe4f5311236168a109ca"`
        *   `teamName` (string, obrigatório): Nome da equipe Pokémon.
            *   *Exemplo:* `"Equipe Rocket"`
        *   `pokemonNames` (array de strings, obrigatório): Lista dos nomes dos Pokémon na equipe.
            *   *Exemplo:* `["Pikachu", "Charizard", "Bulbasaur"]`
    *   **Exemplo de Corpo da Requisição:**
        ```json
        {
          "UserId": "60d0fe4f5311236168a109ca",
          "teamName": "Equipe Rocket",
          "pokemonNames": ["Pikachu", "Charizard", "Bulbasaur"]
        }
        ```
*   **Respostas:**
    *   **Sucesso (`201 Created`):**
        *   **Descrição:** Equipe Pokémon criada com sucesso. Retorna o objeto da equipe criada.
        *   **Corpo da Resposta (`application/json`):**
            ```json
            {
              "_id": "60d0fe4f5311236168a109cb",
              "UserId": "60d0fe4f5311236168a109ca",
              "teamName": "Equipe Rocket",
              "pokemonNames": ["Pikachu", "Charizard", "Bulbasaur"],
              "createdAt": "2023-10-27T10:00:00.000Z",
              "updatedAt": "2023-10-27T10:00:00.000Z"
            }
            ```
    *   **Erro (`400 Bad Request`):**
        *   **Descrição:** Campos obrigatórios faltando ou dados inválidos (ex: erro de validação do Mongoose).
        *   **Corpo da Resposta (`application/json`):**
            ```json
            {
              "message": "UserId, teamName e pokemonNames são obrigatórios."
            }
            ```
            ou
            ```json
            {
              "message": "Erro de validação: O nome da equipe é muito curto." // Exemplo de erro do Mongoose
            }
            ```
    *   **Erro (`401 Unauthorized`):**
        *   **Descrição:** Usuário não autenticado.
    *   **Erro (`404 Not Found`):**
        *   **Descrição:** Usuário (UserId) fornecido no corpo da requisição não encontrado no banco de dados.
        *   **Corpo da Resposta (`application/json`):**
            ```json
            {
              "message": "Usuário não encontrado."
            }
            ```
    *   **Erro (`500 Internal Server Error`):**
        *   **Descrição:** Erro inesperado no servidor.

### `GET /api/poketeams/user/:userId`

*   **Descrição:** Busca todas as equipes Pokémon de um usuário específico. Pode requerer autenticação se for para buscar apenas as equipes do usuário logado, ou ser público se `userId` for de outro usuário.
*   **Controlador:** `getPokeTeamsByUser` (de `pokeTeam.controller.js`)
*   **Parâmetros da Requisição:**
    *   **Path Parameters:**
        *   `userId` (string, ObjectId, obrigatório): ID do usuário para buscar as equipes.
            *   *Exemplo:* `60d0fe4f5311236168a109ca`
*   **Respostas:**
    *   **Sucesso (`200 OK`):**
        *   **Descrição:** Lista de equipes Pokémon do usuário. O `_id` do MongoDB é mapeado para `id` no retorno.
        *   **Corpo da Resposta (`application/json`):**
            ```json
            [
              {
                "id": "60d0fe4f5311236168a109cb",
                "teamName": "Equipe Rocket",
                "pokemonNames": ["Pikachu", "Charizard"],
                "UserId": "60d0fe4f5311236168a109ca"
              },
              {
                "id": "60d0fe4f5311236168a109cc",
                "teamName": "Equipe Aqua",
                "pokemonNames": ["Squirtle"],
                "UserId": "60d0fe4f5311236168a109ca"
              }
            ]
            ```
    *   **Erro (`404 Not Found`):**
        *   **Descrição:** Nenhuma equipe Pokémon encontrada para este usuário.
        *   **Corpo da Resposta (`application/json`):**
            ```json
            {
              "message": "Nenhuma equipe Pokémon encontrada para este usuário."
            }
            ```
    *   **Erro (`500 Internal Server Error`):**
        *   **Descrição:** Erro inesperado no servidor.

### `GET /api/poketeams/:teamId`

*   **Descrição:** Busca detalhes de uma equipe Pokémon específica pelo ID da equipe.
*   **Controlador:** `getPokeTeamById` (de `pokeTeam.controller.js`)
*   **Parâmetros da Requisição:**
    *   **Path Parameters:**
        *   `teamId` (string, ObjectId, obrigatório): ID da equipe Pokémon.
            *   *Exemplo:* `60d0fe4f5311236168a109cb`
*   **Respostas:**
    *   **Sucesso (`200 OK`):**
        *   **Descrição:** Detalhes da equipe Pokémon.
        *   **Corpo da Resposta (`application/json`):**
            ```json
            {
              "_id": "60d0fe4f5311236168a109cb",
              "UserId": "60d0fe4f5311236168a109ca",
              "teamName": "Equipe Rocket",
              "pokemonNames": ["Pikachu", "Charizard"],
              "createdAt": "2023-10-27T10:00:00.000Z",
              "updatedAt": "2023-10-27T10:00:00.000Z"
            }
            ```
    *   **Erro (`404 Not Found`):**
        *   **Descrição:** Equipe Pokémon não encontrada.
        *   **Corpo da Resposta (`application/json`):**
            ```json
            {
              "message": "Equipe Pokémon não encontrada."
            }
            ```
    *   **Erro (`500 Internal Server Error`):**
        *   **Descrição:** Erro inesperado no servidor.

### `PUT /api/poketeams/:teamId`

*   **Descrição:** Edita uma equipe Pokémon existente. Requer autenticação e autorização (usuário deve ser o dono da equipe).
*   **Controlador:** `updatePokeTeam` (de `pokeTeam.controller.js`)
*   **Parâmetros da Requisição:**
    *   **Path Parameters:**
        *   `teamId` (string, ObjectId, obrigatório): ID da equipe Pokémon a ser atualizada.
            *   *Exemplo:* `60d0fe4f5311236168a109cb`
    *   **Request Body** (`application/json`):
        *   `teamName` (string, opcional): Novo nome da equipe Pokémon.
        *   `pokemonNames` (array de strings, opcional): Nova lista dos nomes dos Pokémon na equipe.
    *   **Exemplo de Corpo da Requisição:**
        ```json
        {
          "teamName": "Nova Equipe Rocket",
          "pokemonNames": ["Meowth", "Arbok", "Weezing"]
        }
        ```
*   **Respostas:**
    *   **Sucesso (`200 OK`):**
        *   **Descrição:** Equipe Pokémon atualizada com sucesso. Retorna o objeto da equipe atualizada.
        *   **Corpo da Resposta (`application/json`):** (Similar ao `POST` e `GET /:teamId`)
    *   **Erro (`400 Bad Request`):**
        *   **Descrição:** Erro de validação dos dados fornecidos.
        *   **Corpo da Resposta (`application/json`):**
            ```json
            {
              "message": "Erro de validação: O nome da equipe é muito curto." // Exemplo
            }
            ```
    *   **Erro (`401 Unauthorized`):**
        *   **Descrição:** Usuário não autenticado.
    *   **Erro (`403 Forbidden`):**
        *   **Descrição:** Usuário não tem permissão para editar esta equipe.
        *   **Corpo da Resposta (`application/json`):**
            ```json
            {
              "message": "Você não tem permissão para editar esta equipe."
            }
            ```
    *   **Erro (`404 Not Found`):**
        *   **Descrição:** Equipe Pokémon não encontrada para atualizar.
        *   **Corpo da Resposta (`application/json`):**
            ```json
            {
              "message": "Equipe Pokémon não encontrada para atualizar."
            }
            ```
    *   **Erro (`500 Internal Server Error`):**
        *   **Descrição:** Erro inesperado no servidor.

### `DELETE /api/poketeams/:teamId`

*   **Descrição:** Apaga uma equipe Pokémon. Requer autenticação e autorização (usuário deve ser o dono da equipe).
*   **Controlador:** `deletePokeTeam` (de `pokeTeam.controller.js`)
*   **Parâmetros da Requisição:**
    *   **Path Parameters:**
        *   `teamId` (string, ObjectId, obrigatório): ID da equipe Pokémon a ser deletada.
            *   *Exemplo:* `60d0fe4f5311236168a109cb`
*   **Respostas:**
    *   **Sucesso (`200 OK`):**
        *   **Descrição:** Equipe Pokémon deletada com sucesso.
        *   **Corpo da Resposta (`application/json`):**
            ```json
            {
              "message": "Equipe Pokémon deletada com sucesso."
            }
            ```
    *   **Erro (`401 Unauthorized`):**
        *   **Descrição:** Usuário não autenticado.
    *   **Erro (`403 Forbidden`):**
        *   **Descrição:** Usuário não tem permissão para deletar esta equipe.
        *   **Corpo da Resposta (`application/json`):**
            ```json
            {
              "message": "Você não tem permissão para deletar esta equipe."
            }
            ```
    *   **Erro (`404 Not Found`):**
        *   **Descrição:** Equipe Pokémon não encontrada para deletar.
        *   **Corpo da Resposta (`application/json`):**
            ```json
            {
              "message": "Equipe Pokémon não encontrada para deletar."
            }
            ```
    *   **Erro (`500 Internal Server Error`):**
        *   **Descrição:** Erro inesperado no servidor.

---

## Cadeias de Evolução (`evolution.route.js`)

Endpoints para gerenciar informações de cadeias de evoluções de Pokémon.

**Prefixo Base:** `/api/evolution-chain`

### `GET /api/evolution-chain/:chainId`

*   **Descrição:** Busca uma cadeia de evolução Pokémon pelo seu ID numérico.
*   **Controlador:** `getEvolutionChainById` (de `evolution.controller.js`)
*   **Parâmetros da Requisição:**
    *   **Path Parameters:**
        *   `chainId` (integer, obrigatório): ID numérico da cadeia de evolução.
            *   *Exemplo:* `1`
*   **Respostas:**
    *   **Sucesso (`200 OK`):**
        *   **Descrição:** Detalhes da cadeia de evolução.
        *   **Corpo da Resposta (`application/json`):** (Estrutura baseada na PokeAPI)
            ```json
            {
              "id": 1,
              "baby_trigger_item": null,
              "chain": {
                "evolution_details": [],
                "evolves_to": [
                  {
                    "evolution_details": [
                      {
                        "min_level": 16,
                        "trigger": { "name": "level-up", "url": "..." }
                        // ... outros detalhes
                      }
                    ],
                    "evolves_to": [ /* ... próximas evoluções ... */ ],
                    "is_baby": false,
                    "species": { "name": "ivysaur", "url": "..." }
                  }
                ],
                "is_baby": false,
                "species": { "name": "bulbasaur", "url": "..." }
              }
            }
            ```
    *   **Erro (`404 Not Found`):**
        *   **Descrição:** Cadeia de evolução não encontrada para o ID fornecido.
        *   **Corpo da Resposta (`application/json`):**
            ```json
            {
              "message": "Cadeia de evolução não encontrada."
            }
            ```
    *   **Erro (`500 Internal Server Error`):**
        *   **Descrição:** Erro inesperado no servidor.

---

## Itens (`item.route.js`)

Endpoints para gerenciar itens do universo Pokémon.

**Prefixo Base:** `/api/items`

### `GET /api/items/:nameOrId`

*   **Descrição:** Busca detalhes de um item Pokémon pelo seu nome ou ID numérico.
*   **Controlador:** `getItemDetails` (de `item.controller.js`)
*   **Parâmetros da Requisição:**
    *   **Path Parameters:**
        *   `nameOrId` (string ou integer, obrigatório): Nome (ex: "master-ball") ou ID numérico (ex: 1) do item.
            *   *Exemplo (nome):* `master-ball`
            *   *Exemplo (ID):* `1`
*   **Respostas:**
    *   **Sucesso (`200 OK`):**
        *   **Descrição:** Detalhes do item.
        *   **Corpo da Resposta (`application/json`):** (Estrutura baseada na PokeAPI)
            ```json
            {
              "id": 1,
              "name": "master-ball",
              "cost": 0,
              "effect_entries": [
                {
                  "effect": "Catches a wild Pokémon without fail.",
                  "language": { "name": "en", "url": "..." },
                  "short_effect": "Catches a wild Pokémon without fail."
                }
              ],
              "sprites": {
                "default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png"
              }
              // ... outras informações
            }
            ```
    *   **Erro (`404 Not Found`):**
        *   **Descrição:** Item não encontrado para o nome ou ID fornecido.
        *   **Corpo da Resposta (`application/json`):**
            ```json
            {
              "message": "Item não encontrado."
            }
            ```
    *   **Erro (`500 Internal Server Error`):**
        *   **Descrição:** Erro inesperado no servidor.

---

## Pokémons (`pokemon.route.js`)

Endpoints para gerenciar dados de Pokémon.

**Prefixo Base:** `/api/pokemon`

### `GET /api/pokemon`

*   **Descrição:** Lista Pokémon. Suporta paginação através de query parameters.
*   **Controlador:** `getPokemonList` (de `pokemon.controller.js`)
*   **Parâmetros da Requisição:**
    *   **Query Parameters (opcionais):**
        *   `limit` (integer): Número de Pokémon a serem retornados por página.
            *   *Exemplo:* `?limit=20`
            *   *Padrão (se não fornecido):* (Defina o padrão do seu controller, ex: 20)
        *   `offset` (integer): Número de Pokémon a serem pulados (para paginação).
            *   *Exemplo:* `?offset=40`
            *   *Padrão (se não fornecido):* (Defina o padrão do seu controller, ex: 0)
*   **Respostas:**
    *   **Sucesso (`200 OK`):**
        *   **Descrição:** Lista paginada de Pokémon.
        *   **Corpo da Resposta (`application/json`):** (Estrutura baseada na PokeAPI)
            ```json
            {
              "count": 1281, // Total de Pokémon
              "next": "https://pokeapi.co/api/v2/pokemon?offset=20&limit=20", // URL para a próxima página
              "previous": null, // URL para a página anterior (ou null)
              "results": [
                {
                  "name": "bulbasaur",
                  "url": "https://pokeapi.co/api/v2/pokemon/1/"
                },
                {
                  "name": "ivysaur",
                  "url": "https://pokeapi.co/api/v2/pokemon/2/"
                }
                // ... mais Pokémon
              ]
            }
            ```
    *   **Erro (`500 Internal Server Error`):**
        *   **Descrição:** Erro inesperado no servidor.

### `GET /api/pokemon/:nameOrId`

*   **Descrição:** Busca detalhes de um Pokémon específico pelo seu nome ou ID numérico.
*   **Controlador:** `getPokemonDetails` (de `pokemon.controller.js`)
*   **Parâmetros da Requisição:**
    *   **Path Parameters:**
        *   `nameOrId` (string ou integer, obrigatório): Nome (ex: "pikachu") ou ID numérico (ex: 25) do Pokémon.
            *   *Exemplo (nome):* `pikachu`
            *   *Exemplo (ID):* `25`
*   **Respostas:**
    *   **Sucesso (`200 OK`):**
        *   **Descrição:** Detalhes do Pokémon.
        *   **Corpo da Resposta (`application/json`):** (Estrutura baseada na PokeAPI)
            ```json
            {
              "id": 25,
              "name": "pikachu",
              "height": 4,
              "weight": 60,
              "sprites": {
                "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
                // ... outros sprites
              },
              "types": [
                {
                  "slot": 1,
                  "type": {
                    "name": "electric",
                    "url": "https://pokeapi.co/api/v2/type/13/"
                  }
                }
              ],
              "stats": [
                // ... lista de stats
              ],
              "abilities": [
                // ... lista de abilities
              ]
              // ... outras informações
            }
            ```
    *   **Erro (`404 Not Found`):**
        *   **Descrição:** Pokémon não encontrado para o nome ou ID fornecido.
        *   **Corpo da Resposta (`application/json`):**
            ```json
            {
              "message": "Pokémon não encontrado."
            }
            ```
    *   **Erro (`500 Internal Server Error`):**
        *   **Descrição:** Erro inesperado no servidor.

### `GET /api/pokemon/:nameOrId/species`

*   **Descrição:** Busca detalhes da espécie de um Pokémon específico pelo nome ou ID numérico do Pokémon.
*   **Controlador:** `getPokemonSpeciesDetails` (de `pokemon.controller.js`)
*   **Parâmetros da Requisição:**
    *   **Path Parameters:**
        *   `nameOrId` (string ou integer, obrigatório): Nome (ex: "pikachu") ou ID numérico (ex: 25) do Pokémon.
            *   *Exemplo (nome):* `pikachu`
            *   *Exemplo (ID):* `25`
*   **Respostas:**
    *   **Sucesso (`200 OK`):**
        *   **Descrição:** Detalhes da espécie do Pokémon.
        *   **Corpo da Resposta (`application/json`):** (Estrutura baseada na PokeAPI)
            ```json
            {
              "id": 25,
              "name": "pikachu",
              "order": 35,
              "gender_rate": 4,
              "capture_rate": 190,
              "base_happiness": 70,
              "is_baby": false,
              "is_legendary": false,
              "is_mythical": false,
              "hatch_counter": 10,
              "has_gender_differences": true,
              "forms_switchable": false,
              "growth_rate": {
                "name": "medium",
                "url": "https://pokeapi.co/api/v2/growth-rate/2/"
              },
              "pokedex_numbers": [
                // ... entradas da Pokedex
              ],
              "egg_groups": [
                // ... egg groups
              ],
              "color": {
                "name": "yellow",
                "url": "https://pokeapi.co/api/v2/pokemon-color/10/"
              },
              "shape": {
                "name": "quadruped",
                "url": "https://pokeapi.co/api/v2/pokemon-shape/8/"
              },
              "evolves_from_species": {
                "name": "pichu",
                "url": "https://pokeapi.co/api/v2/pokemon-species/172/"
              },
              "evolution_chain": {
                "url": "https://pokeapi.co/api/v2/evolution-chain/10/"
              }
              // ... outras informações da espécie
            }
            ```
    *   **Erro (`404 Not Found`):**
        *   **Descrição:** Espécie de Pokémon não encontrada para o nome ou ID fornecido.
        *   **Corpo da Resposta (`application/json`):**
            ```json
            {
              "message": "Espécie de Pokémon não encontrada."
            }
            ```
    *   **Erro (`500 Internal Server Error`):**
        *   **Descrição:** Erro inesperado no servidor.

### `GET /api/pokemon/:nameOrId/evolution`

*   **Descrição:** Busca a cadeia de evolução de um Pokémon específico pelo nome ou ID numérico do Pokémon. (Este endpoint provavelmente busca primeiro a espécie para obter o ID da cadeia de evolução e depois busca a cadeia).
*   **Controlador:** `getPokemonEvolution` (de `pokemon.controller.js`)
*   **Parâmetros da Requisição:**
    *   **Path Parameters:**
        *   `nameOrId` (string ou integer, obrigatório): Nome (ex: "pikachu") ou ID numérico (ex: 25) do Pokémon.
            *   *Exemplo (nome):* `pikachu`
            *   *Exemplo (ID):* `25`
*   **Respostas:**
    *   **Sucesso (`200 OK`):**
        *   **Descrição:** Detalhes da cadeia de evolução do Pokémon.
        *   **Corpo da Resposta (`application/json`):** (Similar à resposta de `/api/evolution-chain/:chainId`)
            ```json
            {
              "id": 10, // ID da cadeia de evolução
              "baby_trigger_item": null,
              "chain": {
                "evolution_details": [],
                "evolves_to": [
                  {
                    "evolution_details": [ /* ... */ ],
                    "evolves_to": [ /* ... */ ],
                    "is_baby": false,
                    "species": { "name": "pikachu", "url": "..." }
                  }
                ],
                "is_baby": true,
                "species": { "name": "pichu", "url": "..." }
              }
            }
            ```
    *   **Erro (`404 Not Found`):**
        *   **Descrição:** Pokémon ou sua cadeia de evolução não encontrados.
        *   **Corpo da Resposta (`application/json`):**
            ```json
            {
              "message": "Cadeia de evolução não encontrada para este Pokémon."
            }
            ```
    *   **Erro (`500 Internal Server Error`):**
        *   **Descrição:** Erro inesperado no servidor.

---

## Tipos (`type.route.js`)

Endpoints para gerenciar os tipos de Pokémon.

**Prefixo Base:** `/api/types`

### `GET /api/types/:nameOrId`

*   **Descrição:** Busca detalhes de um tipo de Pokémon pelo seu nome ou ID numérico.
*   **Controlador:** `getTypeDetails` (de `type.controller.js`)
*   **Parâmetros da Requisição:**
    *   **Path Parameters:**
        *   `nameOrId` (string ou integer, obrigatório): Nome (ex: "electric") ou ID numérico (ex: 13) do tipo.
            *   *Exemplo (nome):* `electric`
            *   *Exemplo (ID):* `13`
*   **Respostas:**
    *   **Sucesso (`200 OK`):**
        *   **Descrição:** Detalhes do tipo de Pokémon.
        *   **Corpo da Resposta (`application/json`):** (Estrutura baseada na PokeAPI)
            ```json
            {
              "id": 13,
              "name": "electric",
              "damage_relations": {
                "no_damage_to": [
                  {
                    "name": "ground",
                    "url": "https://pokeapi.co/api/v2/type/5/"
                  }
                ],
                "half_damage_to": [
                  {
                    "name": "grass",
                    "url": "https://pokeapi.co/api/v2/type/12/"
                  },
                  {
                    "name": "electric",
                    "url": "https://pokeapi.co/api/v2/type/13/"
                  },
                  {
                    "name": "dragon",
                    "url": "https://pokeapi.co/api/v2/type/16/"
                  }
                ],
                "double_damage_to": [
                  {
                    "name": "flying",
                    "url": "https://pokeapi.co/api/v2/type/3/"
                  },
                  {
                    "name": "water",
                    "url": "https://pokeapi.co/api/v2/type/11/"
                  }
                ],
                "no_damage_from": [],
                "half_damage_from": [
                  {
                    "name": "flying",
                    "url": "https://pokeapi.co/api/v2/type/3/"
                  },
                  {
                    "name": "steel",
                    "url": "https://pokeapi.co/api/v2/type/9/"
                  },
                  {
                    "name": "electric",
                    "url": "https://pokeapi.co/api/v2/type/13/"
                  }
                ],
                "double_damage_from": [
                  {
                    "name": "ground",
                    "url": "https://pokeapi.co/api/v2/type/5/"
                  }
                ]
              },
              "game_indices": [
                // ... game indices
              ],
              "generation": {
                "name": "generation-i",
                "url": "https://pokeapi.co/api/v2/generation/1/"
              },
              "move_damage_class": {
                "name": "special",
                "url": "https://pokeapi.co/api/v2/move-damage-class/3/"
              },
              "names": [
                {
                  "language": {
                    "name": "en",
                    "url": "https://pokeapi.co/api/v2/language/9/"
                  },
                  "name": "Electric"
                }
                // ... outros nomes
              ],
              "pokemon": [
                {
                  "pokemon": {
                    "name": "pikachu",
                    "url": "https://pokeapi.co/api/v2/pokemon/25/"
                  },
                  "slot": 1
                }
                // ... outros Pokémon deste tipo
              ],
              "moves": [
                {
                  "name": "thunder-punch",
                  "url": "https://pokeapi.co/api/v2/move/9/"
                }
                // ... outros movimentos deste tipo
              ]
            }
            ```
    *   **Erro (`404 Not Found`):**
        *   **Descrição:** Tipo de Pokémon não encontrado para o nome ou ID fornecido.
        *   **Corpo da Resposta (`application/json`):**
            ```json
            {
              "message": "Tipo de Pokémon não encontrado."
            }
            ```
    *   **Erro (`500 Internal Server Error`):**
        *   **Descrição:** Erro inesperado no servidor.

---

## Usuários (`user.route.js`)

Endpoints para gerenciar usuários (registro e login).

**Prefixo Base:** `/api/auth`

### `POST /api/auth/register`

*   **Descrição:** Registra um novo usuário no sistema.
*   **Controlador:** `register` (de `user.controller.js`)
*   **Parâmetros da Requisição:**
    *   **Request Body** (`application/json`):
        *   `username` (string, obrigatório): Nome de usuário único.
            *   *Exemplo:* `"ashketchum"`
        *   `email` (string, obrigatório): Endereço de e-mail único.
            *   *Exemplo:* `"ash@pokemon.com"`
        *   `password` (string, obrigatório): Senha do usuário (mínimo X caracteres).
            *   *Exemplo:* `"Pikachu123!"`
    *   **Exemplo de Corpo da Requisição:**
        ```json
        {
          "username": "ashketchum",
          "email": "ash@pokemon.com",
          "password": "Pikachu123!"
        }
        ```
*   **Respostas:**
    *   **Sucesso (`201 Created`):**
        *   **Descrição:** Usuário registrado com sucesso.
        *   **Corpo da Resposta (`application/json`):**
            ```json
            {
              "message": "Usuário registrado com sucesso!",
              "userId": "60d0fe4f5311236168a109df" // ID do usuário criado
              // Pode opcionalmente retornar o objeto do usuário sem a senha
            }
            ```
    *   **Erro (`400 Bad Request`):**
        *   **Descrição:** Dados de entrada inválidos (ex: email inválido, senha fraca, campos faltando).
        *   **Corpo da Resposta (`application/json`):**
            ```json
            {
              "message": "Nome de usuário, email e senha são obrigatórios."
            }
            ```
            ou
            ```json
            {
              "message": "O email fornecido já está em uso."
            }
            ```
            ou
            ```json
            {
              "message": "O nome de usuário fornecido já está em uso."
            }
            ```
    *   **Erro (`500 Internal Server Error`):**
        *   **Descrição:** Erro inesperado no servidor durante o registro.

### `POST /api/auth/login`

*   **Descrição:** Autentica um usuário existente e retorna um token de acesso (JWT).
*   **Controlador:** `login` (de `user.controller.js`)
*   **Parâmetros da Requisição:**
    *   **Request Body** (`application/json`):
        *   `email` (string, obrigatório): Email do usuário.
            *   *Exemplo:* `"ash@pokemon.com"`
        *   `password` (string, obrigatório): Senha do usuário.
            *   *Exemplo:* `"Pikachu123!"`
    *   **Exemplo de Corpo da Requisição:**
        ```json
        {
          "email": "ash@pokemon.com",
          "password": "Pikachu123!"
        }
        ```
*   **Respostas:**
    *   **Sucesso (`200 OK`):**
        *   **Descrição:** Login bem-sucedido. Retorna um token de acesso e informações do usuário.
        *   **Corpo da Resposta (`application/json`):**
            ```json
            {
              "message": "Login bem-sucedido!",
              "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
              "userId": "60d0fe4f5311236168a109df",
              "username": "ashketchum"
              // Outras informações do usuário que podem ser úteis no frontend
            }
            ```
    *   **Erro (`400 Bad Request`):**
        *   **Descrição:** Email ou senha não fornecidos.
        *   **Corpo da Resposta (`application/json`):**
            ```json
            {
              "message": "Email e senha são obrigatórios."
            }
            ```
    *   **Erro (`401 Unauthorized`):**
        *   **Descrição:** Credenciais inválidas (email não encontrado ou senha incorreta).
        *   **Corpo da Resposta (`application/json`):**
            ```json
            {
              "message": "Credenciais inválidas."
            }
            ```
    *   **Erro (`500 Internal Server Error`):**
        *   **Descrição:** Erro inesperado no servidor durante o login.

---
