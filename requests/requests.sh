# Rota para criar uma nova postagem
curl --request POST \--url http://localhost:3000/protected/blog \--header 'Content-Type: application/json' \--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MWZhMWQ2OGU1NjMzYTc5Yjc2YmI1OSIsImlhdCI6MTc0NjkwNTM3MCwiZXhwIjoxNzQ2OTkxNzcwfQ.c5KQX90wt-cZ3Ij8Sn9QfWdG10gkH44GkH-rwl91VuA' \--data '{"title":"blog teste criado localmente","content":"isso e um teste"}'

# Rota para trazer todas as postagens do usuário logado
curl --request GET \--url http://localhost:3000/protected/blog \--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MWZhMWQ2OGU1NjMzYTc5Yjc2YmI1OSIsImlhdCI6MTc0NjkwNTM3MCwiZXhwIjoxNzQ2OTkxNzcwfQ.c5KQX90wt-cZ3Ij8Sn9QfWdG10gkH44GkH-rwl91VuA'

# Rota para trazer somente uma postagem do usuário logado por postID
curl --request GET \--url http://localhost:3000/protected/blog/9 \--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MWZhMWQ2OGU1NjMzYTc5Yjc2YmI1OSIsImlhdCI6MTc0NjkwNTM3MCwiZXhwIjoxNzQ2OTkxNzcwfQ.c5KQX90wt-cZ3Ij8Sn9QfWdG10gkH44GkH-rwl91VuA'

# Rota para editar uma postagem completamente
curl --request PUT \--url http://localhost:3000/protected/blog/ \--header 'Content-Type: application/json' \--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MWZhMWU1OGU1NjMzYTc5Yjc2YmI1YiIsImlhdCI6MTc0NjkwNzEyNiwiZXhwIjoxNzQ2OTkzNTI2fQ.CtKQWVhlNgHxdbmViEOIKaz6x_j3dnTS9ifFukW5IWk' \--data '{"title":"TITULO NOVO POR PUT 3","content":"isso e um teste NOVO"}'

# Rota para editar uma postagem parcialmente
curl --request PATCH \--url http://localhost:3000/protected/blog/16 \--header 'Content-Type: application/json' \--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MWZhMWU1OGU1NjMzYTc5Yjc2YmI1YiIsImlhdCI6MTc0NjkwNzEyNiwiZXhwIjoxNzQ2OTkzNTI2fQ.CtKQWVhlNgHxdbmViEOIKaz6x_j3dnTS9ifFukW5IWk' \--data '{"title":"TITULO NOVO POR patch 3"}'

# Rota para deletar uma postagem
curl --request DELETE \--url http://localhost:3000/protected/blog/16 \--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MWZhMWU1OGU1NjMzYTc5Yjc2YmI1YiIsImlhdCI6MTc0NjkwNzEyNiwiZXhwIjoxNzQ2OTkzNTI2fQ.CtKQWVhlNgHxdbmViEOIKaz6x_j3dnTS9ifFukW5IWk'

# Login como usuario principal
curl --request POST \--url http://localhost:3000/users/login \--header 'Content-Type: application/json' \--data '{"username":"userteste1","password":"senhateste01"}'

# Login como usuario secundario
curl --request POST \--url http://localhost:3000/users/login \--header 'Content-Type: application/json' \--data '{"username":"userteste2","password":"senhateste01"}'
